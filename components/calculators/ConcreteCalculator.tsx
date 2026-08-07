"use client";

import { useMemo } from "react";
import {
  calculateConcrete,
  concreteInputSchema,
  concreteFormula,
} from "@/lib/calculators/concrete";
import {
  NumberField,
  SelectField,
  UnitToggle,
  ResultStat,
} from "@/components/calculators/fields";
import { useCalculatorUrlState } from "@/components/calculators/useCalculatorUrlState";
import { Card } from "@/components/ui/Card";

export function ConcreteCalculator() {
  const [state, update] = useCalculatorUrlState({
    unit: "imperial" as "imperial" | "metric",
    length: 10,
    width: 10,
    thickness: 4,
    bagSize: "60lb" as string,
  });

  const parsed = concreteInputSchema.safeParse(state);
  const result = useMemo(
    () => (parsed.success ? calculateConcrete(parsed.data) : null),
    [parsed],
  );
  const fieldErrors = parsed.success ? {} : parsed.error.flatten().fieldErrors;
  const lengthUnit = state.unit === "imperial" ? "ft" : "m";
  const thicknessUnit = state.unit === "imperial" ? "in" : "cm";

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
      <Card className="p-6">
        <div className="mb-5">
          <UnitToggle value={state.unit} onChange={(unit) => update({ unit })} />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <NumberField
            id="length"
            label="Slab length"
            value={state.length}
            onChange={(v) => update({ length: Number(v) })}
            suffix={lengthUnit}
            error={fieldErrors.length?.[0]}
          />
          <NumberField
            id="width"
            label="Slab width"
            value={state.width}
            onChange={(v) => update({ width: Number(v) })}
            suffix={lengthUnit}
            error={fieldErrors.width?.[0]}
          />
          <NumberField
            id="thickness"
            label="Thickness"
            value={state.thickness}
            onChange={(v) => update({ thickness: Number(v) })}
            suffix={thicknessUnit}
            error={fieldErrors.thickness?.[0]}
          />
          {state.unit === "imperial" && (
            <SelectField
              id="bagSize"
              label="Bag size"
              value={state.bagSize}
              onChange={(v) => update({ bagSize: v })}
              options={[
                { value: "40lb", label: "40 lb bag" },
                { value: "60lb", label: "60 lb bag" },
                { value: "80lb", label: "80 lb bag" },
              ]}
            />
          )}
        </div>
      </Card>

      <div aria-live="polite">
        {result ? (
          <Card className="space-y-3 p-6">
            <ResultStat
              label="Concrete volume"
              value={`${result.volumeCubicYards} yd³ (${result.volumeCubicMeters} m³)`}
              emphasis
            />
            {result.bagsNeeded !== null && (
              <ResultStat
                label="Bags needed"
                value={`${result.bagsNeeded} × ${state.unit === "imperial" ? state.bagSize : "25 kg"}`}
              />
            )}
            <ResultStat
              label="Volume in cubic feet"
              value={`${result.volumeCubicFeet} ft³`}
            />
            <p className="text-ink-500 text-xs leading-relaxed">{concreteFormula}</p>
          </Card>
        ) : (
          <Card className="text-ink-500 p-6 text-sm">
            Enter valid slab dimensions to estimate concrete needed.
          </Card>
        )}
      </div>
    </div>
  );
}
