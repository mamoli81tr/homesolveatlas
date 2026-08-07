import { Suspense } from "react";
import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo/metadata";
import { CalculatorShell } from "@/components/calculators/CalculatorShell";
import { CalculatorSkeleton } from "@/components/calculators/CalculatorSkeleton";
import { BtuCalculator } from "@/components/calculators/BtuCalculator";

const path = "/calculators/ac-btu-calculator";
const title = "Air Conditioner BTU Calculator";
const description =
  "Get a BTU sizing estimate for a room air conditioner based on area, sun exposure, and occupancy.";

export const metadata: Metadata = buildMetadata({ title, description, path, ogCategory: "Calculator" });

export default function Page() {
  return (
    <CalculatorShell
      title={title}
      description={description}
      path={path}
      howItWorks="Base BTU = room area × 20. We adjust ±10% for sun exposure, add 600 BTU per occupant beyond two, and add 4,000 BTU if the room includes a kitchen, then show a recommended range rather than one exact number."
      unitInfo="Enter room area in square feet or square meters. Results are shown in BTU (British Thermal Units per hour), the standard rating unit printed on every air conditioner's spec sheet."
      examples={[
        {
          label: "200 sq ft bedroom, 2 occupants, normal sun, no kitchen",
          result: "≈ 3,800–4,400 BTU recommended range.",
        },
        {
          label: "300 sq ft sunny living room + kitchen, 4 occupants",
          result: "≈ 9,000–10,400 BTU recommended range.",
        },
      ]}
      faqs={[
        {
          q: "What happens if I buy an AC unit that's too big?",
          a: "An oversized unit cools the room quickly but shuts off before it has run long enough to remove humidity, leaving the room feeling cool but clammy — bigger isn't automatically better.",
        },
        {
          q: "Is this accurate enough for buying a whole-home central system?",
          a: "No — this is a single-room sizing estimate. Whole-home central air needs a professional Manual J load calculation that accounts for insulation, windows, and ductwork in detail.",
        },
        {
          q: "Does ceiling height change the BTU I need?",
          a: "The base rule assumes a standard 8 ft ceiling. Noticeably taller ceilings increase the room's actual air volume and may need a modest upward adjustment beyond this estimate.",
        },
      ]}
      relatedGuides={[
        {
          label: "What Size Air Conditioner Do I Need?",
          href: "/heating-cooling/what-size-air-conditioner-do-i-need",
        },
        {
          label: "How Often Should You Change an AC Filter?",
          href: "/heating-cooling/how-often-change-ac-filter",
        },
      ]}
    >
      <Suspense fallback={<CalculatorSkeleton fieldCount={4} hasUnitToggle={true} />}>
        <BtuCalculator />
      </Suspense>
    </CalculatorShell>
  );
}
