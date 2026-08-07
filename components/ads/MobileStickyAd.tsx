import { AdSlot } from "@/components/ads/AdSlot";

/** Fixed footer ad shown on mobile only. Reserves its height so content never shifts. */
export function MobileStickyAd() {
  return (
    <div className="border-ink-100 fixed inset-x-0 bottom-0 z-30 border-t bg-white p-1.5 md:hidden">
      <AdSlot placement="mobile-sticky" />
    </div>
  );
}
