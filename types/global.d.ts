export {};

/**
 * The IAB TCF v2 CMP API (https://github.com/InteractiveAdvertisingBureau/GDPR-Transparency-and-Consent-Framework),
 * injected by any TCF-registered CMP — including Google's certified CMP
 * (Funding Choices) once it determines TCF applies to a visitor. Consumed
 * read-only in lib/consent/googleCmpStatus.ts to detect
 * `eventStatus === "cmpuishown"`, the standardized signal that a CMP is
 * actively displaying its consent UI right now.
 */
export interface TcfEventData {
  eventStatus?: "tcloaded" | "cmpuishown" | "useractioncomplete" | "addtlconsent" | string;
  gdprApplies?: boolean | null;
  listenerId?: number;
  [key: string]: unknown;
}

export type TcfApi = (
  command: "addEventListener" | "removeEventListener" | string,
  version: 2,
  callback: (tcData: TcfEventData, success: boolean) => void,
  parameter?: unknown,
) => void;

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
    __tcfapi?: TcfApi;
  }
}
