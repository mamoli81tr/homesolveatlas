"use client";

import { useMemo } from "react";
import {
  calculatePaint,
  paintInputSchema,
  formulaExplanation,
  DEFAULT_COVERAGE_SQFT_PER_GALLON,
} from "@/lib/calculators/paint";
import { NumberField, UnitToggle, ResultStat } from "@/components/calculators/fields";
import { useCalculatorUrlState } from "@/components/calculators/useCalculatorUrlState";
import { Card } from "@/components/ui/Card";

export function PaintCalculator() {
  const [state, update] = useCalculatorUrlState({
    unit: "imperial" as "imperial" | "metric",
    length: 12,
    width: 10,
    height: 8,
    doors: 1,
    windows: 1,
    coats: 2,
  });

  const parsed = paintInputSchema.safeParse({
    unit: state.unit,
    length: state.length,
    width: state.width,
    height: state.height,
    doors: state.doors,
    windows: state.windows,
    coats: state.coats,
    coveragePerGallon: DEFAULT_COVERAGE_SQFT_PER_GALLON,
  });

  const result = useMemo(
    () => (parsed.success ? calculatePaint(parsed.data) : null),
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
            id="height"
            label="Wall height"
            value={state.height}
            onChange={(v) => update({ height: Number(v) })}
            suffix={lengthUnit}
            error={fieldErrors.height?.[0]}
          />
          <NumberField
            id="coats"
            label="Number of coats"
            value={state.coats}
            onChange={(v) => update({ coats: Number(v) })}
            min={1}
            max={4}
            step={1}
            error={fieldErrors.coats?.[0]}
          />
          <NumberField
            id="doors"
            label="Doors in this room"
            value={state.doors}
            onChange={(v) => update({ doors: Number(v) })}
            min={0}
            step={1}
            hint="Each door subtracts ~21 sq ft (~2 sqm) of wall area."
            error={fieldErrors.doors?.[0]}
          />
          <NumberField
            id="windows"
            label="Windows in this room"
            value={state.windows}
            onChange={(v) => update({ windows: Number(v) })}
            min={0}
            step={1}
            hint="Each window subtracts ~15 sq ft (~1.4 sqm) of wall area."
            error={fieldErrors.windows?.[0]}
          />
        </div>
      </Card>

      <div aria-live="polite">
        {result ? (
          <Card className="space-y-3 p-6">
            <ResultStat
              label="Paint needed"
              value={`${result.gallonsNeeded} gal (${result.litersNeeded} L)`}
              emphasis
            />
            <ResultStat label="Gallon cans to buy" value={`${result.cansOfGallon}`} />
            <ResultStat
              label="Paintable wall area"
              value={`${result.paintableAreaSqft} sq ft (${result.wallAreaSqm} sqm)`}
            />
            <p className="text-ink-500 text-xs leading-relaxed">
              {formulaExplanation(state.unit)}
            </p>
          </Card>
        ) : (
          <Card className="text-ink-500 p-6 text-sm">
            Enter valid room dimensions to see how much paint you need.
          </Card>
        )}
      </div>
    </div>
  );
}
