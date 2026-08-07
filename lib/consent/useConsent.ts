"use client";

import { useSyncExternalStore } from "react";
import { getSnapshot, getServerSnapshot, subscribe } from "./store";
import type { ConsentState } from "./types";

/**
 * Reactively reads the visitor's cookie-consent choice on the client.
 * Returns `null` until the visitor has made an explicit choice.
 */
export function useConsent(): ConsentState | null {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
