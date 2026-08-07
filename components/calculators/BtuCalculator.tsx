"use client";

import { useMemo } from "react";
import { calculateBtu, btuInputSchema, btuFormula } from "@/lib/calculators/btu";
import {
  NumberField,
  SelectField,
  UnitToggle,
  ResultStat,
} from "@/components/calculators/fields";
import { useCalculatorUrlState } from "@/components/calculators/useCalculatorUrlState";
import { Card } from "@/components/ui/Card";
import { Callout } from "@/components/ui/Callout";

export function BtuCalculator() {
  const [state, update] = useCalculatorUrlState({
    unit: "imperial" as "imperial" | "metric",
    area: 200,
    occupants: 2,
    sunExposure: "normal" as string,
    hasKitchen: false as boolean,
  });

  const parsed = btuInputSchema.safeParse(state);
  const result = useMemo(
    () => (parsed.success ? calculateBtu(parsed.data) : null),
    [parsed],
  );
  const fieldErrors = parsed.success ? {} : parsed.error.flatten().fieldErrors;
  const areaUnit = state.unit === "imperial" ? "sq ft" : "sqm";

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
      <Card className="p-6">
        <div className="mb-5">
          <UnitToggle value={state.unit} onChange={(unit) => update({ unit })} />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <NumberField
            id="area"
            label="Room area"
            value={state.area}
            onChange={(v) => update({ area: Number(v) })}
            suffix={areaUnit}
            error={fieldErrors.area?.[0]}
          />
          <NumberField
            id="occupants"
            label="Regular occupants"
            value={state.occupants}
            onChange={(v) => update({ occupants: Number(v) })}
            min={1}
            max={20}
            step={1}
            error={fieldErrors.occupants?.[0]}
          />
          <SelectField
            id="sun"
            label="Sun exposure"
            value={state.sunExposure}
            onChange={(v) => update({ sunExposure: v })}
            options={[
              { value: "shaded", label: "Shaded / north-facing" },
              { value: "normal", label: "Normal" },
              { value: "sunny", label: "Sunny / south-facing" },
            ]}
          />
          <label className="text-ink-700 flex items-center gap-2.5 self-end text-sm font-medium">
            <input
              type="checkbox"
              checked={state.hasKitchen}
              onChange={(e) => update({ hasKitchen: e.target.checked })}
              className="border-ink-300 h-4 w-4 rounded text-blue-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
            />
            Room includes a kitchen
          </label>
        </div>
      </Card>

      <div aria-live="polite" className="space-y-4">
        {result ? (
          <Card className="space-y-3 p-6">
            <ResultStat
              label="Recommended BTU range"
              value={`${result.recommendedRangeLow.toLocaleString()}–${result.recommendedRangeHigh.toLocaleString()} BTU`}
              emphasis
            />
            <ResultStat
              label="Baseline estimate"
              value={`${result.adjustedBtu.toLocaleString()} BTU`}
            />
            <p className="text-ink-500 text-xs leading-relaxed">{btuFormula}</p>
          </Card>
        ) : (
          <Card className="text-ink-500 p-6 text-sm">
            Enter a valid room area to estimate the AC size you need.
          </Card>
        )}
        <Callout variant="info">
          This is a quick sizing estimate for a single room, not a professional Manual J
          load calculation. For whole-home systems or unusual layouts, get a load
          calculation from an HVAC contractor before buying.
        </Callout>
      </div>
    </div>
  );
}
