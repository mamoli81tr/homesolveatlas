import type { ConsentState } from "./types";

/**
 * Google Consent Mode (v2) integration.
 *
 * This maps HomeSolveAtlas's own two-toggle consent model (`analytics` /
 * `advertising` — see ./types.ts) onto Google's four standard consent
 * signals, using Google's own `gtag('consent', ...)` API — the same API
 * Google's certified CMP (Funding Choices, enabled in AdSense for
 * EEA/UK/Switzerland) uses to report a visitor's regulatory consent choice.
 * This is deliberately the ONLY consent vocabulary in play: whether a
 * decision originates from our own banner (components/layout/CookieConsent.tsx)
 * or from Google's CMP (components/layout/GoogleCmp.tsx), both are expressed
 * through this one shared shape rather than two parallel systems.
 *
 * Reference: https://developers.google.com/tag-platform/security/guides/consent
 */

export const CONSENT_MODE_SIGNALS = [
  "analytics_storage",
  "ad_storage",
  "ad_user_data",
  "ad_personalization",
] as const;

export type ConsentModeSignal = (typeof CONSENT_MODE_SIGNALS)[number];
export type ConsentModeValue = "granted" | "denied";
export type ConsentModeParams = Partial<Record<ConsentModeSignal, ConsentModeValue>>;

/**
 * The default state applied as early as possible (before GA4, before any
 * ad tag, before Google's CMP has even loaded) — everything denied. This
 * preserves the site's existing "no collection before an explicit choice"
 * behavior; it does not change what was already true, it just also
 * expresses it in the vocabulary Google's own tags (and, later, AdSense)
 * read directly, rather than only in our own localStorage-backed store.
 *
 * No `region` scoping is used deliberately — that would require guessing a
 * visitor's location ourselves (explicitly out of scope: no geolocation/IP
 * detection), and a non-EEA fallback default of "granted" would actually
 * weaken today's deny-by-default behavior outside the EEA/UK/Switzerland,
 * not preserve it.
 */
export const CONSENT_MODE_DEFAULT: ConsentModeParams & { wait_for_update?: number } = {
  analytics_storage: "denied",
  ad_storage: "denied",
  ad_user_data: "denied",
  ad_personalization: "denied",
};

/** How long (ms) Google tags should hold pings for a consent update before the default applies. */
export const CONSENT_MODE_WAIT_FOR_UPDATE_MS = 500;

/** Custom DOM event dispatched by the inline bootstrap stub for every `gtag('consent', 'update', ...)` call — see components/layout/ConsentModeBootstrap.tsx and ConsentModeBridge.tsx. */
export const CONSENT_MODE_UPDATE_EVENT = "homesolveatlas-consent-mode-update";

/**
 * Our ConsentState -> Google's four Consent Mode signals.
 *
 * `advertising` (a single toggle in our UI) maps to all three ad-related
 * signals uniformly — HomeSolveAtlas doesn't currently expose separate
 * controls for ad storage vs. personalization vs. user-data sharing, and
 * splitting that would be a consent-UI redesign, out of scope here.
 */
export function buildConsentModeUpdate(state: Pick<ConsentState, "analytics" | "advertising">): Required<ConsentModeParams> {
  return {
    analytics_storage: state.analytics ? "granted" : "denied",
    ad_storage: state.advertising ? "granted" : "denied",
    ad_user_data: state.advertising ? "granted" : "denied",
    ad_personalization: state.advertising ? "granted" : "denied",
  };
}

/**
 * The reverse mapping: a Consent Mode `update` call (from Google's CMP, or
 * from our own banner echoing its own choice) -> our ConsentState shape.
 *
 * Update calls aren't guaranteed to include all four keys every time (a CMP
 * may report analytics and ad signals separately), so any signal absent
 * from `params` falls back to whatever was previously stored rather than
 * being assumed denied — that would let a partial update silently regress
 * an already-granted choice, and assumed-granted would silently widen one.
 */
export function mapConsentModeUpdateToState(
  params: ConsentModeParams,
  previous: Pick<ConsentState, "analytics" | "advertising"> | null,
): { analytics: boolean; advertising: boolean } {
  const analytics =
    "analytics_storage" in params
      ? params.analytics_storage === "granted"
      : (previous?.analytics ?? false);

  // ad_storage is treated as the primary/base advertising signal — if it's
  // present we trust it; ad_user_data/ad_personalization are additional
  // dimensions Google's own ad tags read directly and don't need to also
  // gate our own (currently placeholder-only) AdSlot rendering.
  const advertising =
    "ad_storage" in params ? params.ad_storage === "granted" : (previous?.advertising ?? false);

  return { analytics, advertising };
}
