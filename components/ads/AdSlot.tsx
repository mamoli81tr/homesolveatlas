"use client";

import { useEffect, useRef, useState } from "react";
import { adsConfig, type AdPlacement } from "@/config/ads";
import { useConsent } from "@/lib/consent/useConsent";
import { cn } from "@/lib/utils/cn";

/**
 * Reusable ad slot with a permanently reserved box size, so no ad ever
 * causes layout shift (CLS) whether it's a placeholder or a real unit.
 *
 * - Lazy-loads: the slot only "activates" once it scrolls near the viewport.
 * - Consent-gated: with `adsConfig.enabled = true`, the real ad script only
 *   renders after the visitor accepts the "Advertising" cookie category.
 * - Until a real ad network is wired up (see config/ads.ts), this always
 *   renders a clearly-labeled placeholder box — never a fake ad, never
 *   anything styled to look like a button or navigation.
 */
export function AdSlot({
  placement,
  className,
}: {
  placement: AdPlacement;
  className?: string;
}) {
  const definition = adsConfig.placements[placement];
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  const consent = useConsent();

  useEffect(() => {
    const node = ref.current;
    if (!node || typeof IntersectionObserver === "undefined") {
      setInView(true);
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setInView(true);
          observer.disconnect();
        }
      },
      { rootMargin: "200px" },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  const showRealAd =
    adsConfig.enabled && consent?.advertising && definition.slotId && inView;

  return (
    <div
      ref={ref}
      data-ad-placement={placement}
      aria-label="Advertisement"
      role="complementary"
      className={cn("mx-auto flex items-center justify-center", className)}
      style={{ width: "100%", maxWidth: definition.width, minHeight: definition.height }}
    >
      {showRealAd ? (
        // Real ad network markup goes here once config/ads.ts is enabled —
        // see that file's header comment for the AdSense integration steps.
        <div style={{ width: definition.width, height: definition.height }} />
      ) : (
        <div
          className="border-ink-300 bg-ink-50 text-ink-500 flex h-full w-full items-center justify-center rounded-lg border border-dashed text-xs"
          style={{ minHeight: definition.height }}
        >
          Advertisement — {definition.label}
        </div>
      )}
    </div>
  );
}
