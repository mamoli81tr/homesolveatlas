"use client";

import { CONSENT_STORAGE_KEY, CONSENT_CHANGE_EVENT, type ConsentState } from "./types";

/**
 * A minimal external store for cookie consent, read via useSyncExternalStore
 * (see useConsent.ts). Centralizing reads/writes here — instead of calling
 * setState from inside a useEffect in each consuming component — avoids the
 * extra render pass and hydration-mismatch pitfalls that come with treating
 * localStorage as component state instead of an external store.
 */

type Listener = () => void;
const listeners = new Set<Listener>();

function parse(raw: string | null): ConsentState | null {
  if (!raw) return null;
  try {
    const data = JSON.parse(raw);
    return {
      necessary: true,
      analytics: Boolean(data.analytics),
      advertising: Boolean(data.advertising),
    };
  } catch {
    return null;
  }
}

// Cached so repeated getSnapshot() calls return a referentially stable
// object between actual changes, which useSyncExternalStore requires.
let cachedSnapshot: ConsentState | null | undefined;

export function getSnapshot(): ConsentState | null {
  if (cachedSnapshot === undefined) {
    cachedSnapshot =
      typeof window === "undefined"
        ? null
        : parse(window.localStorage.getItem(CONSENT_STORAGE_KEY));
  }
  return cachedSnapshot;
}

export function getServerSnapshot(): ConsentState | null {
  return null;
}

export function subscribe(callback: Listener): () => void {
  function handleChange(event: Event) {
    const detail = (event as CustomEvent<ConsentState>).detail;
    cachedSnapshot = detail ?? null;
    callback();
  }
  window.addEventListener(CONSENT_CHANGE_EVENT, handleChange);
  listeners.add(callback);
  return () => {
    window.removeEventListener(CONSENT_CHANGE_EVENT, handleChange);
    listeners.delete(callback);
  };
}

export function setConsent(state: Omit<ConsentState, "necessary">): void {
  const full: ConsentState = { ...state, necessary: true };
  cachedSnapshot = full;
  window.localStorage.setItem(CONSENT_STORAGE_KEY, JSON.stringify(full));
  window.dispatchEvent(new CustomEvent(CONSENT_CHANGE_EVENT, { detail: full }));
}
