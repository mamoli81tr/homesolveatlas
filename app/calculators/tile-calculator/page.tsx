import { Suspense } from "react";
import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo/metadata";
import { CalculatorShell } from "@/components/calculators/CalculatorShell";
import { CalculatorSkeleton } from "@/components/calculators/CalculatorSkeleton";
import { TileCalculator } from "@/components/calculators/TileCalculator";

const path = "/calculators/tile-calculator";
const title = "Tile Calculator";
const description =
  "Work out how many tiles and boxes you need for a floor or wall, including a waste allowance.";

export const metadata: Metadata = buildMetadata({ title, description, path, ogCategory: "Calculator" });

export default function Page() {
  return (
    <CalculatorShell
      title={title}
      description={description}
      path={path}
      howItWorks="Tiles needed = room area ÷ single-tile area, rounded up. We add your chosen waste percentage — 10% is typical for a straight lay, more for diagonal or patterned layouts — to get the amount to actually buy."
      unitInfo="Room dimensions use feet or meters; tile dimensions use the smaller matching unit (inches or centimeters), since tiles are sized far smaller than the room itself."
      examples={[
        {
          label: "10 × 8 ft room, 12 × 12 in tiles, 10% waste",
          result: "80 tiles needed → 88 with waste → 9 boxes at 10 tiles/box.",
        },
        {
          label: "Same room, diagonal layout",
          result: "Increase waste to 15–20% for the extra angled cuts a diagonal lay needs.",
        },
      ]}
      faqs={[
        {
          q: "How much waste allowance should I use for tile?",
          a: "10% is standard for a straight lay. Diagonal layouts, herringbone patterns, or rooms with lots of corners and fixtures to cut around should use 15–20%.",
        },
        {
          q: "Should I buy tiles from the same batch?",
          a: "Yes — tile color and shade can vary slightly between production batches, so buying enough from one batch (including your waste allowance) avoids a visible mismatch partway through.",
        },
        {
          q: "Does grout width affect how many tiles I need?",
          a: "Grout lines take up a small amount of space between tiles, but for most standard grout widths (1/8–3/16 in) the effect on total tile count is small enough that the waste allowance already covers it.",
        },
      ]}
      relatedGuides={[
        { label: "Flooring Calculator", href: "/calculators/flooring-calculator" },
        { label: "Room Area Calculator", href: "/calculators/room-area-calculator" },
      ]}
    >
      <Suspense fallback={<CalculatorSkeleton fieldCount={6} hasUnitToggle={true} />}>
        <TileCalculator />
      </Suspense>
    </CalculatorShell>
  );
}
