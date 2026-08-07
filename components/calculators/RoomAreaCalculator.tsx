"use client";

import { useMemo } from "react";
import {
  calculateRoomArea,
  roomAreaInputSchema,
  roomAreaFormula,
} from "@/lib/calculators/room-area";
import { NumberField, UnitToggle, ResultStat } from "@/components/calculators/fields";
import { useCalculatorUrlState } from "@/components/calculators/useCalculatorUrlState";
import { Card } from "@/components/ui/Card";

export function RoomAreaCalculator() {
  const [state, update] = useCalculatorUrlState({
    unit: "imperial" as "imperial" | "metric",
    length: 12,
    width: 10,
  });

  const parsed = roomAreaInputSchema.safeParse(state);
  const result = useMemo(
    () => (parsed.success ? calculateRoomArea(parsed.data) : null),
    [parsed],
  );
  const fieldErrors = parsed.success ? {} : parsed.error.flatten().fieldErrors;
  const lengthUnit = state.unit === "imperial" ? "ft" : "m";

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
      <Card className="p-6">
        <div className="mb-5">
          <UnitToggle value={state.unit} onChange={(unit) => update({ unit })} />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <NumberField
            id="length"
            label="Length"
            value={state.length}
            onChange={(v) => update({ length: Number(v) })}
            suffix={lengthUnit}
            error={fieldErrors.length?.[0]}
          />
          <NumberField
            id="width"
            label="Width"
            value={state.width}
            onChange={(v) => update({ width: Number(v) })}
            suffix={lengthUnit}
            error={fieldErrors.width?.[0]}
          />
        </div>
      </Card>

      <div aria-live="polite">
        {result ? (
          <Card className="space-y-3 p-6">
            <ResultStat
              label="Area"
              value={`${result.areaSqft} sq ft (${result.areaSqm} sqm)`}
              emphasis
            />
            <ResultStat
              label="Perimeter"
              value={`${result.perimeterNative} ${lengthUnit}`}
            />
            <p className="text-ink-500 text-xs leading-relaxed">{roomAreaFormula}</p>
          </Card>
        ) : (
          <Card className="text-ink-500 p-6 text-sm">
            Enter valid dimensions to calculate area.
          </Card>
        )}
      </div>
    </div>
  );
}
