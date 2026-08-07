import { Suspense } from "react";
import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo/metadata";
import { CalculatorShell } from "@/components/calculators/CalculatorShell";
import { CalculatorSkeleton } from "@/components/calculators/CalculatorSkeleton";
import { WallpaperCalculator } from "@/components/calculators/WallpaperCalculator";

const path = "/calculators/wallpaper-calculator";
const title = "Wallpaper Calculator";
const description =
  "Find out how many rolls of wallpaper a room needs, including an allowance for pattern repeats.";

export const metadata: Metadata = buildMetadata({ title, description, path, ogCategory: "Calculator" });

export default function Page() {
  return (
    <CalculatorShell
      title={title}
      description={description}
      path={path}
      howItWorks="We calculate wall area from your room's dimensions, subtract average door and window openings, add a pattern-repeat waste allowance, then divide by the usable coverage of one roll."
      unitInfo="Works in feet or meters. A standard US double roll covers about 56 sq ft (5.2 sqm) after trim — adjust the roll-coverage field if your product's label states a different figure."
      examples={[
        {
          label: "12 × 10 ft room, 8 ft ceilings, 1 door, 1 window, 15% waste",
          result: "≈ 285 sq ft to cover → 6 rolls.",
        },
        {
          label: "Large pattern repeat (24 in+), same room",
          result: "Increase waste to 20–25% — large repeats need more trimming per strip.",
        },
      ]}
      faqs={[
        {
          q: "Why does pattern repeat matter so much?",
          a: "Every strip has to line up with the one next to it. A large pattern repeat means more of each roll gets trimmed away to keep the pattern matched, so it needs a bigger waste allowance than plain or small-repeat wallpaper.",
        },
        {
          q: "Is a 'double roll' the same as two single rolls?",
          a: "Not quite in usable coverage — a double roll is one continuous longer roll, which usually wastes less than two separate single rolls because there are fewer seams to match.",
        },
        {
          q: "Should I buy extra for future repairs?",
          a: "Yes — buy at least one extra roll from the same dye lot for future patch repairs, since wallpaper is often discontinued or re-dyed differently in later print runs.",
        },
      ]}
      relatedGuides={[
        { label: "Paint Calculator", href: "/calculators/paint-calculator" },
        { label: "Room Area Calculator", href: "/calculators/room-area-calculator" },
      ]}
    >
      <Suspense fallback={<CalculatorSkeleton fieldCount={6} hasUnitToggle={true} />}>
        <WallpaperCalculator />
      </Suspense>
    </CalculatorShell>
  );
}
