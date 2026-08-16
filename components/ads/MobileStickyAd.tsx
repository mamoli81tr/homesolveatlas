import { AdSlot } from "@/components/ads/AdSlot";
import { shouldRenderAdPlaceholder } from "@/config/ads";

/**
 * Fixed footer ad shown on mobile only. Reserves its height so content
 * never shifts. Renders nothing at all (not even the bar) when
 * `shouldRenderAdPlaceholder()` is false, so pre-approval production
 * visitors don't get an empty white strip pinned to the bottom of the
 * screen — see ArticleLayout.tsx, which also skips its matching content
 * spacer in that case.
 */
export function MobileStickyAd() {
  if (!shouldRenderAdPlaceholder()) return null;
  return (
    <div className="border-ink-100 fixed inset-x-0 bottom-0 z-30 border-t bg-white p-1.5 md:hidden">
      <AdSlot placement="mobile-sticky" />
    </div>
  );
}
