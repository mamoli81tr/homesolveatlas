"use client";

import { useEffect, useState } from "react";
import type { TcfEventData } from "@/types/global";

/**
 * Lifecycle of Google's certified CMP (Funding Choices, turned on in
 * AdSense's Privacy & Messaging settings for EEA/UK/Switzerland) on the
 * current pageview.
 *
 *  - "not-configured": no AdSense publisher ID is set
 *    (NEXT_PUBLIC_ADSENSE_CLIENT_ID empty) — Google's CMP isn't loaded at
 *    all (see components/layout/GoogleCmp.tsx). Site's exact current
 *    behavior, unchanged.
 *  - "pending": the CMP script has been requested and we don't yet know
 *    whether it will show a message to this visitor.
 *  - "showing-message": Google's CMP is ACTIVELY presenting a consent
 *    message to this visitor right now (Case A) — confirmed via the IAB
 *    TCF v2 `eventStatus === "cmpuishown"` signal, not merely "the script
 *    loaded" or "the CMP resolved something."
 *  - "no-message-applicable": the CMP finished resolving (Google's own
 *    `CONSENT_DATA_READY` fired) but never reported a UI being shown —
 *    i.e. Google determined no regulatory message is needed for this
 *    visitor (Case B — e.g. a Chrome/Opera visitor outside the EEA/UK/CH,
 *    or a TCF-inapplicable region such as Turkey).
 *  - "unavailable": the CMP was configured but never resolved (blocked
 *    script, network failure, error — e.g. Brave's default shield
 *    behavior) within a bounded timeout (Case C).
 *
 * IMPORTANT: earlier code treated "the CMP script loaded/resolved
 * anything" as sufficient reason to hide our own banner, which is the bug
 * this file fixes — a resolved CMP is NOT the same as a CMP that is
 * actually handling this visitor's consent. Only "showing-message" (and,
 * transitively, an already-stored consent recorded from a *previous*
 * "showing-message" interaction — see shouldShowCustomBanner) suppresses
 * our banner.
 */
export type GoogleCmpStatus =
  | "not-configured"
  | "pending"
  | "showing-message"
  | "no-message-applicable"
  | "unavailable";

const READY_TIMEOUT_MS = 3000;

type GoogleFcGlobal = {
  callbackQueue?: Array<Record<string, () => void>>;
};

/**
 * Pure decision function behind the "showing-message" vs
 * "no-message-applicable" distinction — the core of this bug fix, and
 * directly unit-tested (tests/consent/googleCmpStatus.test.ts) including
 * the explicit regression case: "CMP loaded successfully but no consent
 * message displayed."
 *
 *  - `tcfUiShown`: true once IAB TCF v2 has reported
 *    `eventStatus === "cmpuishown"` for this visitor — the standardized,
 *    Google-supported signal that a CMP is actively displaying UI. Google's
 *    certified CMP is TCF-registered, so this fires whenever it shows its
 *    EEA/UK/Switzerland regulatory message, without HomeSolveAtlas having
 *    to know which regions those are.
 *  - `consentDataReady`: true once Google's own `CONSENT_DATA_READY`
 *    callback has fired — the CMP has finished making its determination
 *    for this visitor, whatever that determination was.
 *
 * `tcfUiShown` always wins if both are true (a message is being shown,
 * full stop), and either ordering of the two underlying async signals
 * resolves to the same, correct answer.
 */
export function resolveGoogleCmpMessageState(params: {
  tcfUiShown: boolean;
  consentDataReady: boolean;
}): "pending" | "showing-message" | "no-message-applicable" {
  if (params.tcfUiShown) return "showing-message";
  if (params.consentDataReady) return "no-message-applicable";
  return "pending";
}

/**
 * Whether HomeSolveAtlas's own custom banner
 * (components/layout/CookieConsent.tsx) should render, given what's
 * currently known. Pure and unit-tested (tests/consent/googleCmpStatus.test.ts)
 * — the component itself just calls this with live values from hooks.
 *
 * Case-by-case (see the task's exact scenarios):
 *  A. CMP is actively showing its message ("showing-message") -> hide ours.
 *  B. CMP resolved but no message applies ("no-message-applicable") -> show ours.
 *  C. CMP blocked/errored/timed out ("unavailable") -> show ours.
 *  D. A choice is already stored -> never show ours, regardless of CMP state.
 *
 * While still "pending" (haven't yet learned which of A/B/C applies), stay
 * hidden rather than flash-then-hide/flash-then-show — Consent Mode's
 * default-denied state already protects GA4/ads during that brief window.
 */
export function shouldShowCustomBanner(params: {
  hasStoredConsent: boolean;
  cmpConfigured: boolean;
  cmpStatus: GoogleCmpStatus;
}): boolean {
  if (params.hasStoredConsent) return false; // Case D
  if (!params.cmpConfigured) return true;
  switch (params.cmpStatus) {
    case "showing-message":
      return false; // Case A
    case "no-message-applicable":
    case "unavailable":
      return true; // Case B / Case C
    case "pending":
    case "not-configured":
    default:
      return false;
  }
}

/**
 * Tracks Google's CMP lifecycle using two of its own documented signals —
 * never geolocation, never a hardcoded country list:
 *
 *  1. `googlefc.callbackQueue` / `CONSENT_DATA_READY`
 *     (https://developers.google.com/funding-choices) — "the CMP has
 *     finished resolving something for this visitor."
 *  2. IAB TCF v2 `__tcfapi` `addEventListener` / `eventStatus === "cmpuishown"`
 *     (https://github.com/InteractiveAdvertisingBureau/GDPR-Transparency-and-Consent-Framework)
 *     — "the CMP is actually displaying its UI right now." Google's
 *     certified CMP is TCF-registered, so this fires for its EEA/UK/CH
 *     regulatory message without this code needing to know those regions.
 *
 * `__tcfapi` is injected asynchronously by the CMP script itself (same
 * "may not exist yet" race as `googlefc`), so this polls briefly for it
 * to appear rather than assuming it's there on mount.
 *
 * `cmpConfigured` should reflect whether NEXT_PUBLIC_ADSENSE_CLIENT_ID is
 * set (i.e. whether components/layout/GoogleCmp.tsx is actually loading
 * the CMP script).
 */
export function useGoogleCmpStatus(cmpConfigured: boolean): GoogleCmpStatus {
  // `cmpConfigured` is derived from a build-time env var (see CookieConsent.tsx),
  // so it's effectively constant for the app's lifetime — the initial value
  // here already covers both cases correctly on first render.
  const [status, setStatus] = useState<GoogleCmpStatus>(
    cmpConfigured ? "pending" : "not-configured",
  );

  useEffect(() => {
    if (!cmpConfigured) return;

    let tcfUiShown = false;
    let consentDataReady = false;
    let tcfListenerId: number | undefined;
    let tcfPollInterval: number | undefined;

    function recompute() {
      const next = resolveGoogleCmpMessageState({ tcfUiShown, consentDataReady });
      if (next !== "pending") setStatus(next);
    }

    // Signal 1: Google's own "CMP has resolved" callback.
    const w = window as typeof window & { googlefc?: GoogleFcGlobal };
    w.googlefc = w.googlefc || {};
    w.googlefc.callbackQueue = w.googlefc.callbackQueue || [];
    w.googlefc.callbackQueue.push({
      CONSENT_DATA_READY: () => {
        consentDataReady = true;
        recompute();
      },
    });

    // Signal 2: IAB TCF v2 "is the CMP UI actually shown" event.
    function attachTcfListener(): boolean {
      const tcfapi = window.__tcfapi;
      if (typeof tcfapi !== "function") return false;
      tcfapi("addEventListener", 2, (tcData: TcfEventData, success: boolean) => {
        if (!success || !tcData) return;
        if (typeof tcData.listenerId === "number") tcfListenerId = tcData.listenerId;
        if (tcData.eventStatus === "cmpuishown") {
          tcfUiShown = true;
          recompute();
        }
      });
      return true;
    }

    if (!attachTcfListener()) {
      // __tcfapi hasn't been injected yet — poll briefly. Stops as soon as
      // it appears, or when the overall timeout below settles the status
      // anyway (whichever comes first).
      tcfPollInterval = window.setInterval(() => {
        if (attachTcfListener() && tcfPollInterval !== undefined) {
          window.clearInterval(tcfPollInterval);
          tcfPollInterval = undefined;
        }
      }, 100);
    }

    const timeout = window.setTimeout(() => {
      if (!tcfUiShown && !consentDataReady) {
        setStatus("unavailable");
      }
    }, READY_TIMEOUT_MS);

    return () => {
      window.clearTimeout(timeout);
      if (tcfPollInterval !== undefined) window.clearInterval(tcfPollInterval);
      const tcfapi = window.__tcfapi;
      if (typeof tcfapi === "function" && tcfListenerId !== undefined) {
        tcfapi("removeEventListener", 2, () => {}, tcfListenerId);
      }
    };
  }, [cmpConfigured]);

  return status;
}
