/**
 * Central ad configuration.
 *
 * The site currently renders `<AdSlot />` PLACEHOLDERS ONLY — no ad network
 * script is loaded anywhere. This keeps local dev clean and means legal/CLS
 * behaviour can be reviewed before any real ad code goes live.
 *
 * ── To go live with Google AdSense ──────────────────────────────────────
 * 1. Set `NEXT_PUBLIC_ADSENSE_CLIENT_ID` in `.env.local` (see .env.example).
 * 2. Set `enabled: true` below.
 * 3. Replace each placement's `slotId` with the matching ad unit ID from
 *    your AdSense dashboard.
 * 4. `components/ads/AdSlot.tsx` will then render the real `<ins class="adsbygoogle">`
 *    tag instead of the placeholder, but ONLY after the visitor has accepted
 *    the "Advertising" cookie category (see components/layout/CookieConsent.tsx).
 * 5. Extend the CSP `script-src`/`frame-src` in `next.config.ts` to allow
 *    AdSense's domains (googlesyndication.com, doubleclick.net, etc.).
 *
 * See README.md → "How to add real ad code" for the full walkthrough.
 *
 * ── Google's certified CMP (Funding Choices) is separate from this file ──
 * `NEXT_PUBLIC_ADSENSE_CLIENT_ID` alone (independent of `enabled` here)
 * already loads Google's consent-collection CMP for EEA/UK/Switzerland —
 * see components/layout/GoogleCmp.tsx and README.md → "Google Consent Mode
 * & Google's certified CMP". This lets consent collection go live ahead of
 * ads themselves, which is intentional while an AdSense site review is
 * pending — flipping `enabled` here has no effect on the CMP either way.
 */

export type AdPlacement =
  | "header-banner"
  | "in-article-top"
  | "in-article-mid-35"
  | "in-article-mid-70"
  | "article-end"
  | "sidebar"
  | "mobile-sticky";

export interface AdSlotDefinition {
  /** Real ad-network slot/unit ID. Empty string = placeholder only. */
  slotId: string;
  /** Reserved box size (prevents layout shift before the ad script loads). */
  width: number;
  height: number;
  /** Human label shown on the placeholder in development. */
  label: string;
}

export const adsConfig: {
  enabled: boolean;
  clientId: string;
  placements: Record<AdPlacement, AdSlotDefinition>;
} = {
  // Master switch. Leave `false` until real ad code + policy review is done.
  enabled: false,
  clientId: process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID ?? "",
  placements: {
    "header-banner": { slotId: "", width: 728, height: 90, label: "Header banner" },
    "in-article-top": { slotId: "", width: 336, height: 280, label: "In-article (top)" },
    "in-article-mid-35": {
      slotId: "",
      width: 336,
      height: 280,
      label: "In-article (35%)",
    },
    "in-article-mid-70": {
      slotId: "",
      width: 336,
      height: 280,
      label: "In-article (70%)",
    },
    "article-end": { slotId: "", width: 336, height: 280, label: "Article end" },
    sidebar: { slotId: "", width: 300, height: 600, label: "Sidebar" },
    "mobile-sticky": {
      slotId: "",
      width: 320,
      height: 50,
      label: "Mobile sticky footer",
    },
  },
};
