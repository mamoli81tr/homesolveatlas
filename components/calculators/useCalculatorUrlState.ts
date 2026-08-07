"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

/**
 * Persists a calculator's form state to the URL query string (so results
 * are shareable/bookmarkable) without ever sending the data to a server —
 * `router.replace` only rewrites the browser URL for the current client.
 */
export function useCalculatorUrlState<
  T extends Record<string, string | number | boolean | undefined>,
>(defaults: T): [T, (next: Partial<T>) => void] {
  const searchParams = useSearchParams();
  const router = useRouter();
  const isFirstRender = useRef(true);

  const [state, setState] = useState<T>(() => {
    const initial = { ...defaults };
    for (const key of Object.keys(defaults)) {
      const raw = searchParams.get(key);
      if (raw === null) continue;
      const defaultValue = defaults[key];
      if (typeof defaultValue === "number") {
        const parsed = Number(raw);
        if (!Number.isNaN(parsed)) (initial as Record<string, unknown>)[key] = parsed;
      } else if (typeof defaultValue === "boolean") {
        (initial as Record<string, unknown>)[key] = raw === "true";
      } else {
        (initial as Record<string, unknown>)[key] = raw;
      }
    }
    return initial;
  });

  const update = useCallback((next: Partial<T>) => {
    setState((prev) => ({ ...prev, ...next }));
  }, []);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    const params = new URLSearchParams();
    for (const [key, value] of Object.entries(state)) {
      if (value !== undefined && value !== "") params.set(key, String(value));
    }
    router.replace(`?${params.toString()}`, { scroll: false });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state]);

  return [state, update];
}
