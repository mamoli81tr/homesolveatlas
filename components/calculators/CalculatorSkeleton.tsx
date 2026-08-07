/**
 * Suspense fallback for calculator islands (needed because reading the URL
 * query string via `useSearchParams` requires a Suspense boundary during
 * static rendering). Mirrors the real calculator's grid structure — unit
 * toggle, N field rows, results card — instead of a single generic box, so
 * its height closely matches the hydrated component and swapping in the
 * real content doesn't shift the page (CLS).
 */
export function CalculatorSkeleton({
  fieldCount,
  hasUnitToggle = true,
}: {
  fieldCount: number;
  hasUnitToggle?: boolean;
}) {
  return (
    <div className="grid animate-pulse gap-6 lg:grid-cols-[minmax(0,1fr)_320px]" aria-hidden="true">
      <div className="border-ink-100 rounded-2xl border bg-white p-6">
        {hasUnitToggle && <div className="bg-ink-100 mb-5 h-9 w-56 rounded-xl" />}
        <div className="grid gap-4 sm:grid-cols-2">
          {Array.from({ length: fieldCount }).map((_, i) => (
            <div key={i}>
              <div className="bg-ink-100 mb-1.5 h-3.5 w-24 rounded" />
              <div className="bg-ink-100 h-10 w-full rounded-xl" />
            </div>
          ))}
        </div>
      </div>
      <div className="border-ink-100 space-y-3 rounded-2xl border bg-white p-6">
        <div className="bg-ink-100 h-16 w-full rounded-xl" />
        <div className="bg-ink-100 h-16 w-full rounded-xl" />
        <div className="bg-ink-100 h-16 w-full rounded-xl" />
      </div>
    </div>
  );
}
