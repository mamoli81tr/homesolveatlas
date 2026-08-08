"use client";

import { useEffect, useState } from "react";

/**
 * Lifecycle of Google's certified CMP (Funding Choices, turned on in
 * AdSense's Privacy & Messaging settings for EEA/UK/Switzerland) on the
 * current pageview.
 *
 *  - "not-configured": no AdSense publisher ID is set
 *    (NEXT_PUBLIC_ADSENSE_CLIENT_ID empty) — Google's CMP isn't loaded at
 *    all (see components/layout/GoogleCmp.tsx). This is the site's exact
 *    current behavior, unchanged.
 *  - "pending": the CMP script has been requested and is still resolving
 *    the visitor's applicable consent status.
 *  - "active": the CMP has resolved — Google's own documented
 *    `CONSENT_DATA_READY` callback fired — and is authoritative for this
 *    visitor (whether or not it actually displayed a message to them).
 *  - "unavailable": the CMP was configured but never signaled readiness
 *    within a bounded timeout (blocked by an ad-blocker, network failure,
 *    script error) — treated as "not present" so the site always still has
 *    a working consent mechanism.
 */
export type GoogleCmpStatus = "not-configured" | "pending" | "active" | "unavailable";

const READY_TIMEOUT_MS = 3000;

type GoogleFcGlobal = {
  callbackQueue?: Array<Record<string, () => void>>;
};

/**
 * Whether HomeSolveAtlas's own custom banner
 * (components/layout/CookieConsent.tsx) should render, given what's
 * currently known. Pure and unit-tested (tests/consent/googleCmpStatus.test.ts)
 * — the component itself just calls this with live values from hooks.
 *
 * The one rule this exists to enforce: never show our banner while Google's
 * CMP might also be showing its own regulatory message
 * (`cmpStatus === "pending" | "active"`), while still guaranteeing a working
 * consent experience when the CMP isn't configured, or fails to load.
 *
 * Deliberately does NOT try to detect "is this visitor in the EEA/UK/CH"
 * itself — that would mean rebuilding region logic Google's own CMP already
 * owns and keeps current, and risks silently drifting from it. Once the
 * CMP is configured, it is trusted to decide for itself, per visitor,
 * whether a message is needed — exactly what a managed CMP is for.
 */
export function shouldShowCustomBanner(params: {
  hasStoredConsent: boolean;
  cmpConfigured: boolean;
  cmpStatus: GoogleCmpStatus;
}): boolean {
  if (params.hasStoredConsent) return false;
  if (!params.cmpConfigured) return true;
  return params.cmpStatus === "unavailable";
}

/**
 * Tracks Google's CMP lifecycle via its own documented
 * `googlefc.callbackQueue` / `CONSENT_DATA_READY` signal
 * (https://developers.google.com/funding-choices) — never geolocation or
 * IP-based detection. `cmpConfigured` should reflect whether
 * NEXT_PUBLIC_ADSENSE_CLIENT_ID is set (i.e. whether
 * components/layout/GoogleCmp.tsx is actually loading the CMP script).
 */
export function useGoogleCmpStatus(cmpConfigured: boolean): GoogleCmpStatus {
  // `cmpConfigured` is derived from a build-time env var (see CookieConsent.tsx),
  // so it's effectively constant for the app's lifetime — the initial value
  // here already covers both cases correctly on first render, and the
  // effect below only needs to run the CMP-specific subscription/timeout
  // when it's true, not re-set state that's already correct.
  const [status, setStatus] = useState<GoogleCmpStatus>(
    cmpConfigured ? "pending" : "not-configured",
  );

  useEffect(() => {
    if (!cmpConfigured) return;

    let settled = false;

    const w = window as typeof window & { googlefc?: GoogleFcGlobal };
    w.googlefc = w.googlefc || {};
    w.googlefc.callbackQueue = w.googlefc.callbackQueue || [];
    w.googlefc.callbackQueue.push({
      CONSENT_DATA_READY: () => {
        if (settled) return;
        settled = true;
        setStatus("active");
      },
    });

    const timeout = window.setTimeout(() => {
      if (settled) return;
      settled = true;
      setStatus("unavailable");
    }, READY_TIMEOUT_MS);

    return () => window.clearTimeout(timeout);
  }, [cmpConfigured]);

  return status;
}
