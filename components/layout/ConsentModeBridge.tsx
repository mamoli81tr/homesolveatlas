"use client";

import { useEffect } from "react";
import { getStoredConsent, setStoredConsent } from "@/lib/consent/storage";
import {
  CONSENT_MODE_UPDATE_EVENT,
  mapConsentModeUpdateToState,
  type ConsentModeParams,
} from "@/lib/consent/googleConsentMode";

/**
 * Listens for the `consent update` broadcast dispatched by the inline
 * bootstrap stub (see ConsentModeBootstrap.tsx) — the one path through
 * which Google's CMP (or anyone calling the page's shared `gtag('consent',
 * ...)`) can affect HomeSolveAtlas's own consent store. This is what lets
 * `useConsent()`-gated components — Analytics.tsx today, AdSlot.tsx once
 * ads are enabled — respect a decision made through Google's CMP UI
 * without a second, parallel "is this an EEA/UK/CH visitor" code path.
 *
 * Renders nothing — pure side-effect wiring, mounted once in the root layout.
 */
export function ConsentModeBridge() {
  useEffect(() => {
    function handleUpdate(event: Event) {
      const detail = (event as CustomEvent<ConsentModeParams>).detail;
      if (!detail) return;
      const next = mapConsentModeUpdateToState(detail, getStoredConsent());
      setStoredConsent(next);
    }

    window.addEventListener(CONSENT_MODE_UPDATE_EVENT, handleUpdate);
    return () => window.removeEventListener(CONSENT_MODE_UPDATE_EVENT, handleUpdate);
  }, []);

  return null;
}
