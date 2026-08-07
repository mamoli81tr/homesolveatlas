import { Suspense } from "react";
import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo/metadata";
import { CalculatorShell } from "@/components/calculators/CalculatorShell";
import { CalculatorSkeleton } from "@/components/calculators/CalculatorSkeleton";
import { ElectricityCostCalculator } from "@/components/calculators/ElectricityCostCalculator";

const path = "/calculators/electricity-cost-calculator";
const title = "Electricity Cost Calculator";
const description =
  "Estimate what it costs to run an appliance per day, month, and year based on its wattage and your electricity rate.";

export const metadata: Metadata = buildMetadata({ title, description, path, ogCategory: "Calculator" });

export default function Page() {
  return (
    <CalculatorShell
      title={title}
      description={description}
      path={path}
      howItWorks="Energy used (kWh) = watts × hours used ÷ 1000. Cost = energy (kWh) × your price per kWh. We scale the daily figure to monthly and yearly estimates."
      unitInfo="Enter power in watts (check the appliance label or manual) and your electricity rate in price per kilowatt-hour (kWh), found on your utility bill."
      examples={[
        {
          label: "1,500 W space heater, 3 hrs/day, $0.16/kWh",
          result: "≈ $0.72/day → ≈ $21.60/month → ≈ $262.80/year.",
        },
        {
          label: "150 W refrigerator, running ~8 effective hrs/day, $0.16/kWh",
          result: "≈ $0.19/day → ≈ $5.76/month → ≈ $70/year.",
        },
      ]}
      faqs={[
        {
          q: "How do I find an appliance's wattage?",
          a: "Check the nameplate or label, usually on the back or bottom of the appliance, or in the product manual. If it only lists amps and volts, multiply them together to get watts.",
        },
        {
          q: "Why does my fridge's 'hours used' matter if it runs all day?",
          a: "A refrigerator's compressor cycles on and off rather than running continuously — 'hours used' here means the effective running time at full wattage, typically 6–10 hours out of 24 for a normal fridge, not the full 24.",
        },
        {
          q: "Where do I find my electricity rate?",
          a: "Your utility bill lists a price per kWh directly, or you can divide your total bill amount by your total kWh usage for that billing period to calculate it yourself.",
        },
      ]}
      relatedGuides={[
        {
          label: "How Much Does It Cost to Run an Appliance?",
          href: "/maintenance/cost-to-run-an-appliance",
        },
      ]}
    >
      <Suspense fallback={<CalculatorSkeleton fieldCount={4} hasUnitToggle={false} />}>
        <ElectricityCostCalculator />
      </Suspense>
    </CalculatorShell>
  );
}
