export {};

/**
 * The single global `gtag`/`dataLayer` pair set up by
 * components/layout/ConsentModeBootstrap.tsx as early as possible (before
 * GA4, before Google's CMP). Every consumer — Analytics.tsx, CookieConsent.tsx,
 * Google's own CMP script — reads/writes through this one global, per
 * Google's documented Consent Mode API, rather than each defining its own.
 */
declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}
