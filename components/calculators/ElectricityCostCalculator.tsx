"use client";

import { useMemo } from "react";
import {
  calculateElectricityCost,
  electricityInputSchema,
  electricityFormula,
} from "@/lib/calculators/electricity";
import { NumberField, ResultStat } from "@/components/calculators/fields";
import { useCalculatorUrlState } from "@/components/calculators/useCalculatorUrlState";
import { Card } from "@/components/ui/Card";

export function ElectricityCostCalculator() {
  const [state, update] = useCalculatorUrlState({
    watts: 1500,
    hoursPerDay: 3,
    daysPerMonth: 30,
    costPerKwh: 0.16,
  });

  const parsed = electricityInputSchema.safeParse(state);
  const result = useMemo(
    () => (parsed.success ? calculateElectricityCost(parsed.data) : null),
    [parsed],
  );
  const fieldErrors = parsed.success ? {} : parsed.error.flatten().fieldErrors;

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
      <Card className="p-6">
        <div className="grid gap-4 sm:grid-cols-2">
          <NumberField
            id="watts"
            label="Appliance power"
            value={state.watts}
            onChange={(v) => update({ watts: Number(v) })}
            suffix="watts"
            hint="Check the appliance label or manual."
            error={fieldErrors.watts?.[0]}
          />
          <NumberField
            id="hours"
            label="Hours used per day"
            value={state.hoursPerDay}
            onChange={(v) => update({ hoursPerDay: Number(v) })}
            suffix="hrs"
            min={0}
            max={24}
            error={fieldErrors.hoursPerDay?.[0]}
          />
          <NumberField
            id="days"
            label="Days per month"
            value={state.daysPerMonth}
            onChange={(v) => update({ daysPerMonth: Number(v) })}
            suffix="days"
            min={1}
            max={31}
            error={fieldErrors.daysPerMonth?.[0]}
          />
          <NumberField
            id="rate"
            label="Electricity rate"
            value={state.costPerKwh}
            onChange={(v) => update({ costPerKwh: Number(v) })}
            suffix="$/kWh"
            hint="Find this on your utility bill."
            error={fieldErrors.costPerKwh?.[0]}
          />
        </div>
      </Card>

      <div aria-live="polite">
        {result ? (
          <Card className="space-y-3 p-6">
            <ResultStat
              label="Estimated cost per month"
              value={`$${result.costPerMonth.toFixed(2)}`}
              emphasis
            />
            <ResultStat
              label="Cost per year"
              value={`$${result.costPerYear.toFixed(2)}`}
            />
            <ResultStat label="Energy per month" value={`${result.kwhPerMonth} kWh`} />
            <p className="text-ink-500 text-xs leading-relaxed">{electricityFormula}</p>
          </Card>
        ) : (
          <Card className="text-ink-500 p-6 text-sm">
            Enter valid appliance details to estimate running cost.
          </Card>
        )}
      </div>
    </div>
  );
}
