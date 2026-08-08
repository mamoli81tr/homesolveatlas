"use client";

import Script from "next/script";

// Same publisher ID as AdSense's own client ID — Funding Choices' snippet
// wants it without the "ca-" prefix Google's AdSense ad-unit tag uses.
const RAW_CLIENT_ID = process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID?.trim();
const PUBLISHER_ID = RAW_CLIENT_ID?.replace(/^ca-/, "");

const signalGooglefcPresentScript = `
(function () {
  function signalGooglefcPresent() {
    if (!window.frames.googlefc) {
      if (document.body) {
        var iframe = document.createElement("iframe");
        iframe.style = "width:0;height:0;border:none;display:none";
        iframe.name = "googlefc";
        document.body.appendChild(iframe);
      } else {
        setTimeout(signalGooglefcPresent, 0);
      }
    }
  }
  signalGooglefcPresent();
})();
`;

/**
 * Loads Google's certified CMP (Funding Choices) — turned on in AdSense's
 * Privacy & Messaging settings for EEA/UK/Switzerland. This is entirely
 * separate from serving ads: Funding Choices is a consent-collection tool
 * Google explicitly supports enabling ahead of ads going live, so this
 * component does not read or touch `config/ads.ts`'s `enabled` flag (still
 * `false` — the AdSense site review is pending) at all.
 *
 * Renders nothing when NEXT_PUBLIC_ADSENSE_CLIENT_ID is unset — identical
 * to today's behavior (custom banner only, see CookieConsent.tsx) until a
 * real AdSense publisher ID is configured. No ID is ever fabricated here.
 *
 * The two scripts below are Google's own documented Funding Choices
 * integration (https://developers.google.com/funding-choices) — the
 * `signalGooglefcPresent` iframe stub lets the CMP detect it's present on
 * the page even before its own script has finished loading, which is also
 * why `lib/consent/googleCmpStatus.ts` can safely push onto
 * `googlefc.callbackQueue` immediately without waiting for this to load
 * first.
 */
export function GoogleCmp() {
  if (!PUBLISHER_ID) return null;

  return (
    <>
      <Script id="google-cmp-signal-present" strategy="afterInteractive">
        {signalGooglefcPresentScript}
      </Script>
      <Script
        id="google-cmp-funding-choices"
        strategy="afterInteractive"
        src={`https://fundingchoicesmessages.google.com/i/${PUBLISHER_ID}?ers=1`}
      />
    </>
  );
}
