import { Suspense } from "react";
import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo/metadata";
import { CalculatorShell } from "@/components/calculators/CalculatorShell";
import { CalculatorSkeleton } from "@/components/calculators/CalculatorSkeleton";
import { FlooringCalculator } from "@/components/calculators/FlooringCalculator";

const path = "/calculators/flooring-calculator";
const title = "Flooring Calculator";
const description =
  "Calculate how much flooring material and how many boxes you need, including a waste allowance.";

export const metadata: Metadata = buildMetadata({ title, description, path, ogCategory: "Calculator" });

export default function Page() {
  return (
    <CalculatorShell
      title={title}
      description={description}
      path={path}
      howItWorks="We multiply your room's length and width to get floor area, add your chosen waste percentage for cuts and offcuts, then divide by the coverage of a single box to estimate how many boxes to buy."
      unitInfo="Enter room dimensions in feet or meters. Box coverage is entered in the matching unit (sq ft or sqm) — check your flooring product's packaging for its exact coverage per box."
      examples={[
        {
          label: "14 × 11 ft room, 10% waste, 20 sq ft per box",
          result: "154 sq ft floor → 169.4 sq ft with waste → 9 boxes.",
        },
        {
          label: "5 × 4 m room, 15% waste (diagonal lay), 2.2 sqm per box",
          result: "20 sqm floor → 23 sqm with waste → 11 boxes.",
        },
      ]}
      faqs={[
        {
          q: "How much waste allowance should I use?",
          a: "10% is standard for a straight lay along the room's length. Increase to 15% for diagonal layouts, herringbone patterns, or rooms with lots of alcoves and cuts.",
        },
        {
          q: "Should I order all boxes at once?",
          a: "Yes when possible — flooring is manufactured in batches (dye lots), and boxes from different batches can show a subtle color or shade difference.",
        },
        {
          q: "Does this work for both laminate and hardwood flooring?",
          a: "Yes — the area and waste-percentage math is the same regardless of material. Only the coverage-per-box figure changes, which you enter based on your specific product.",
        },
      ]}
      relatedGuides={[
        { label: "Tile Calculator", href: "/calculators/tile-calculator" },
        { label: "Room Area Calculator", href: "/calculators/room-area-calculator" },
      ]}
    >
      <Suspense fallback={<CalculatorSkeleton fieldCount={4} hasUnitToggle={true} />}>
        <FlooringCalculator />
      </Suspense>
    </CalculatorShell>
  );
}
