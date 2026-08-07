import { Suspense } from "react";
import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo/metadata";
import { CalculatorShell } from "@/components/calculators/CalculatorShell";
import { CalculatorSkeleton } from "@/components/calculators/CalculatorSkeleton";
import { PaintCalculator } from "@/components/calculators/PaintCalculator";

const path = "/calculators/paint-calculator";
const title = "Paint Calculator";
const description =
  "Calculate how many gallons or liters of paint you need for a room, based on wall area, coats, and coverage.";

export const metadata: Metadata = buildMetadata({ title, description, path, ogCategory: "Calculator" });

export default function Page() {
  return (
    <CalculatorShell
      title={title}
      description={description}
      path={path}
      howItWorks="We calculate the gross wall area from your room's length, width, and height, subtract average door and window openings, then divide by your paint's coverage rate and multiply by the number of coats you plan to apply."
      unitInfo="Enter length, width, and height in feet (imperial) or meters (metric) — results are shown in both gallons/liters so you can shop from either unit's product labels."
      examples={[
        {
          label: "12 × 10 ft bedroom, 8 ft ceilings, 1 door, 1 window, 2 coats",
          result: "≈ 1.8 gallons (6.8 L) — round up to 2 gallon cans.",
        },
        {
          label: "14 × 12 ft living room, 9 ft ceilings, 2 doors, 3 windows, 2 coats",
          result: "≈ 2.5 gallons (9.5 L) — round up to 3 gallon cans.",
        },
      ]}
      faqs={[
        {
          q: "Do I need to paint the ceiling too?",
          a: "This calculator covers walls only. Ceilings are usually painted with a separate ceiling paint and calculated as ceiling length × width, since that's a flat area rather than a wall perimeter.",
        },
        {
          q: "How much paint does one gallon actually cover?",
          a: "Most standard wall paints cover 350–400 sq ft per gallon on a single coat over primed drywall. Check your specific product's label — heavily textured walls or deep colors sometimes cover less.",
        },
        {
          q: "Should I buy extra paint beyond the calculated amount?",
          a: "A little extra (round up to the next full gallon, or buy an extra quart) is worth it for touch-ups later and to avoid a mid-job store run if you underestimate slightly.",
        },
        {
          q: "Does primer need to be calculated separately?",
          a: "Yes — if your walls need a primer coat (color change, new drywall, or stain-blocking), estimate that as a separate 'first coat' using the same coverage-rate math, since primer and paint aren't interchangeable.",
        },
      ]}
      relatedGuides={[
        {
          label: "How Much Paint Do I Need for a Room?",
          href: "/maintenance/how-much-paint-do-i-need-for-a-room",
        },
        { label: "Wallpaper Calculator", href: "/calculators/wallpaper-calculator" },
        { label: "Room Area Calculator", href: "/calculators/room-area-calculator" },
      ]}
    >
      <Suspense fallback={<CalculatorSkeleton fieldCount={6} hasUnitToggle={true} />}>
        <PaintCalculator />
      </Suspense>
    </CalculatorShell>
  );
}
