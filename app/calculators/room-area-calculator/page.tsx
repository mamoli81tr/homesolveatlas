import { Suspense } from "react";
import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo/metadata";
import { CalculatorShell } from "@/components/calculators/CalculatorShell";
import { CalculatorSkeleton } from "@/components/calculators/CalculatorSkeleton";
import { RoomAreaCalculator } from "@/components/calculators/RoomAreaCalculator";

const path = "/calculators/room-area-calculator";
const title = "Room Area Calculator";
const description =
  "Quickly calculate a room's floor area and perimeter in imperial or metric units.";

export const metadata: Metadata = buildMetadata({ title, description, path, ogCategory: "Calculator" });

export default function Page() {
  return (
    <CalculatorShell
      title={title}
      description={description}
      path={path}
      howItWorks="Area is length × width. Perimeter is 2 × (length + width). Both figures are shown in square feet and square meters regardless of which unit you enter."
      unitInfo="Enter length and width in feet or meters — the calculator converts and displays area in both sq ft and sqm automatically, so you never need to convert by hand."
      examples={[
        { label: "12 × 10 ft room", result: "120 sq ft (11.15 sqm), perimeter 44 ft." },
        { label: "4 × 3.5 m room", result: "14 sqm (150.7 sq ft), perimeter 15 m." },
      ]}
      faqs={[
        {
          q: "Does this include alcoves or irregular room shapes?",
          a: "This calculator assumes a simple rectangle. For an L-shaped or irregular room, split it into rectangular sections, calculate each separately, and add the areas together.",
        },
        {
          q: "What's the difference between area and perimeter?",
          a: "Area (length × width) tells you how much floor surface you're covering — useful for flooring, tile, or carpet. Perimeter (the distance around the edge) is useful for baseboards, trim, or wallpaper border.",
        },
      ]}
      relatedGuides={[
        { label: "Flooring Calculator", href: "/calculators/flooring-calculator" },
        { label: "Paint Calculator", href: "/calculators/paint-calculator" },
        { label: "Tile Calculator", href: "/calculators/tile-calculator" },
      ]}
    >
      <Suspense fallback={<CalculatorSkeleton fieldCount={2} hasUnitToggle={true} />}>
        <RoomAreaCalculator />
      </Suspense>
    </CalculatorShell>
  );
}
