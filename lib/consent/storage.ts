"use client";

import { getSnapshot, setConsent } from "./store";
import type { ConsentState } from "./types";

/** One-off (non-reactive) read — prefer the `useConsent()` hook in components. */
export function getStoredConsent(): ConsentState | null {
  return getSnapshot();
}

export function setStoredConsent(state: Omit<ConsentState, "necessary">): void {
  setConsent(state);
}
