"use client";

import { useMemo } from "react";
import {
  calculateFlooring,
  flooringInputSchema,
  flooringFormula,
} from "@/lib/calculators/flooring";
import { NumberField, UnitToggle, ResultStat } from "@/components/calculators/fields";
import { useCalculatorUrlState } from "@/components/calculators/useCalculatorUrlState";
import { Card } from "@/components/ui/Card";

export function FlooringCalculator() {
  const [state, update] = useCalculatorUrlState({
    unit: "imperial" as "imperial" | "metric",
    length: 14,
    width: 11,
    wastePercent: 10,
    coveragePerBox: 20,
  });

  const parsed = flooringInputSchema.safeParse(state);
  const result = useMemo(
    () => (parsed.success ? calculateFlooring(parsed.data) : null),
    [parsed],
  );
  const fieldErrors = parsed.success ? {} : parsed.error.flatten().fieldErrors;
  const lengthUnit = state.unit === "imperial" ? "ft" : "m";
  const areaUnit = state.unit === "imperial" ? "sq ft" : "sqm";

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
      <Card className="p-6">
        <div className="mb-5">
          <UnitToggle value={state.unit} onChange={(unit) => update({ unit })} />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <NumberField
            id="length"
            label="Room length"
            value={state.length}
            onChange={(v) => update({ length: Number(v) })}
            suffix={lengthUnit}
            error={fieldErrors.length?.[0]}
          />
          <NumberField
            id="width"
            label="Room width"
            value={state.width}
            onChange={(v) => update({ width: Number(v) })}
            suffix={lengthUnit}
            error={fieldErrors.width?.[0]}
          />
          <NumberField
            id="waste"
            label="Waste allowance"
            value={state.wastePercent}
            onChange={(v) => update({ wastePercent: Number(v) })}
            suffix="%"
            min={0}
            max={50}
            hint="10% is typical; use 15% for diagonal layouts."
            error={fieldErrors.wastePercent?.[0]}
          />
          <NumberField
            id="coverage"
            label="Coverage per box"
            value={state.coveragePerBox}
            onChange={(v) => update({ coveragePerBox: Number(v) })}
            suffix={areaUnit}
            hint="Check your product packaging for exact box coverage."
            error={fieldErrors.coveragePerBox?.[0]}
          />
        </div>
      </Card>

      <div aria-live="polite">
        {result ? (
          <Card className="space-y-3 p-6">
            <ResultStat
              label="Material to buy"
              value={`${state.unit === "imperial" ? result.areaWithWasteSqft : result.areaWithWasteSqm} ${areaUnit}`}
              emphasis
            />
            {result.boxesNeeded !== null && (
              <ResultStat label="Boxes needed" value={`${result.boxesNeeded}`} />
            )}
            <ResultStat
              label="Exact floor area"
              value={`${result.areaSqft} sq ft (${result.areaSqm} sqm)`}
            />
            <p className="text-ink-500 text-xs leading-relaxed">{flooringFormula}</p>
          </Card>
        ) : (
          <Card className="text-ink-500 p-6 text-sm">
            Enter valid room dimensions to calculate flooring material.
          </Card>
        )}
      </div>
    </div>
  );
}
