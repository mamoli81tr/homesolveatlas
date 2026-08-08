"use client";

import Script from "next/script";
import { CONSENT_STORAGE_KEY } from "@/lib/consent/types";
import {
  CONSENT_MODE_DEFAULT,
  CONSENT_MODE_WAIT_FOR_UPDATE_MS,
  CONSENT_MODE_UPDATE_EVENT,
} from "@/lib/consent/googleConsentMode";

// Kept as a plain string template (not JSX/TS logic) because this specific
// script MUST run via Next's `beforeInteractive` strategy, before React
// hydrates — Google Consent Mode's guarantee only holds if `consent
// default` runs before any Google tag can possibly fire, which for GA4
// (loaded via components/layout/Analytics.tsx) or Google's CMP (loaded via
// components/layout/GoogleCmp.tsx) means "before hydration," not "in a
// React effect." Business logic stays out of this string on purpose — it
// only defines the shared `gtag`/`dataLayer` globals, sets the default
// consent state, resyncs an already-stored choice, and rebroadcasts every
// `consent update` call as a plain DOM CustomEvent for
// ConsentModeBridge.tsx (a normal, hydrated, testable component) to react
// to.
//
// The inline resync block below duplicates
// lib/consent/googleConsentMode.ts's buildConsentModeUpdate() mapping by
// necessity (an inline script can't import a TS module) — update both if
// this mapping ever changes.
const bootstrapScript = `
(function () {
  window.dataLayer = window.dataLayer || [];
  function gtag() {
    dataLayer.push(arguments);
    if (arguments[0] === "consent" && arguments[1] === "update") {
      window.dispatchEvent(
        new CustomEvent(${JSON.stringify(CONSENT_MODE_UPDATE_EVENT)}, { detail: arguments[2] })
      );
    }
  }
  window.gtag = gtag;

  gtag("consent", "default", ${JSON.stringify({
    ...CONSENT_MODE_DEFAULT,
    wait_for_update: CONSENT_MODE_WAIT_FOR_UPDATE_MS,
  })});

  try {
    var raw = window.localStorage.getItem(${JSON.stringify(CONSENT_STORAGE_KEY)});
    if (raw) {
      var stored = JSON.parse(raw);
      gtag("consent", "update", {
        analytics_storage: stored.analytics ? "granted" : "denied",
        ad_storage: stored.advertising ? "granted" : "denied",
        ad_user_data: stored.advertising ? "granted" : "denied",
        ad_personalization: stored.advertising ? "granted" : "denied",
      });
    }
  } catch (e) {}
})();
`;

/**
 * Establishes Google Consent Mode (v2) as early as possible — see the
 * comment on `bootstrapScript` above for why this has to be an inline,
 * `beforeInteractive` script rather than a React effect.
 *
 * Always mounted, unconditionally (unlike Analytics.tsx/GoogleCmp.tsx,
 * which stay no-ops until their respective env vars are set) — Consent
 * Mode defaults are good, inert infrastructure to have in place site-wide
 * even before GA4 or Google's CMP exist, and cost nothing (a few lines of
 * inline JS, no network request).
 */
// The `no-before-interactive-script-outside-document` rule predates
// first-class App Router support for `beforeInteractive` in the root
// layout — Next.js's own docs explicitly document this exact usage:
// https://nextjs.org/docs/app/api-reference/components/script#beforeinteractive
export function ConsentModeBootstrap() {
  return (
    // eslint-disable-next-line @next/next/no-before-interactive-script-outside-document -- see comment above
    <Script id="consent-mode-bootstrap" strategy="beforeInteractive">
      {bootstrapScript}
    </Script>
  );
}
