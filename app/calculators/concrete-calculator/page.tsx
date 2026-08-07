import { Suspense } from "react";
import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo/metadata";
import { CalculatorShell } from "@/components/calculators/CalculatorShell";
import { CalculatorSkeleton } from "@/components/calculators/CalculatorSkeleton";
import { ConcreteCalculator } from "@/components/calculators/ConcreteCalculator";

const path = "/calculators/concrete-calculator";
const title = "Concrete Volume Calculator";
const description =
  "Calculate concrete volume and the number of bags needed for a slab, footing, or small pour.";

export const metadata: Metadata = buildMetadata({ title, description, path, ogCategory: "Calculator" });

export default function Page() {
  return (
    <CalculatorShell
      title={title}
      description={description}
      path={path}
      howItWorks="Volume = length × width × thickness, with thickness converted to the same unit first. Bags needed = volume ÷ yield per bag, rounded up. Always add 5–10% extra for spillage and an uneven subgrade."
      unitInfo="Length and width are entered in feet or meters; thickness uses a smaller unit (inches or centimeters) since slabs are typically just a few inches deep. Bag yield is based on standard 40/60/80 lb bags (imperial) or 25 kg bags (metric)."
      examples={[
        {
          label: "10 × 10 ft slab, 4 in thick, 60 lb bags",
          result: "≈ 1.23 yd³ (0.94 m³) → ≈ 74 bags.",
        },
        {
          label: "3 × 2 m footing, 30 cm thick",
          result: "≈ 1.8 m³ → ≈ 155 bags (25 kg).",
        },
      ]}
      faqs={[
        {
          q: "How much extra concrete should I order beyond the calculated volume?",
          a: "Add 5–10% on top of the calculated volume to account for an uneven subgrade, spillage, and minor form variations — running short mid-pour is a much bigger problem than having a little extra.",
        },
        {
          q: "Is bagged concrete practical for a large slab?",
          a: "For anything beyond a small pour (a few cubic yards), ready-mix delivered by truck is usually more practical and often cheaper per yard than dozens of bags — use this calculator's volume figure to get a delivery quote.",
        },
        {
          q: "Does slab thickness really need to be exact?",
          a: "Thickness has an outsized effect on volume since it's multiplied by the full length and width — even a half-inch difference can meaningfully change how many bags you need, so measure it carefully at a few points.",
        },
      ]}
      relatedGuides={[
        { label: "Tile Calculator", href: "/calculators/tile-calculator" },
        { label: "How to Remove Oil Stains From Concrete", href: "/cleaning/remove-oil-stains-from-concrete" },
      ]}
    >
      <Suspense fallback={<CalculatorSkeleton fieldCount={4} hasUnitToggle={true} />}>
        <ConcreteCalculator />
      </Suspense>
    </CalculatorShell>
  );
}
