"use client";

import { useMemo } from "react";
import {
  calculateWallpaper,
  wallpaperInputSchema,
  wallpaperFormula,
} from "@/lib/calculators/wallpaper";
import { NumberField, UnitToggle, ResultStat } from "@/components/calculators/fields";
import { useCalculatorUrlState } from "@/components/calculators/useCalculatorUrlState";
import { Card } from "@/components/ui/Card";

export function WallpaperCalculator() {
  const [state, update] = useCalculatorUrlState({
    unit: "imperial" as "imperial" | "metric",
    length: 12,
    width: 10,
    height: 8,
    doors: 1,
    windows: 1,
    patternRepeatWastePercent: 15,
  });

  const parsed = wallpaperInputSchema.safeParse(state);
  const result = useMemo(
    () => (parsed.success ? calculateWallpaper(parsed.data) : null),
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
            id="height"
            label="Wall height"
            value={state.height}
            onChange={(v) => update({ height: Number(v) })}
            suffix={lengthUnit}
            error={fieldErrors.height?.[0]}
          />
          <NumberField
            id="waste"
            label="Pattern-repeat waste"
            value={state.patternRepeatWastePercent}
            onChange={(v) => update({ patternRepeatWastePercent: Number(v) })}
            suffix="%"
            min={0}
            max={50}
            error={fieldErrors.patternRepeatWastePercent?.[0]}
          />
          <NumberField
            id="doors"
            label="Doors in this room"
            value={state.doors}
            onChange={(v) => update({ doors: Number(v) })}
            min={0}
            step={1}
            error={fieldErrors.doors?.[0]}
          />
          <NumberField
            id="windows"
            label="Windows in this room"
            value={state.windows}
            onChange={(v) => update({ windows: Number(v) })}
            min={0}
            step={1}
            error={fieldErrors.windows?.[0]}
          />
        </div>
      </Card>

      <div aria-live="polite">
        {result ? (
          <Card className="space-y-3 p-6">
            <ResultStat label="Rolls needed" value={`${result.rollsNeeded}`} emphasis />
            <ResultStat
              label="Area to cover"
              value={`${result.areaWithWasteNative} ${areaUnit} (with waste)`}
            />
            <ResultStat
              label="Wall area"
              value={`${result.wallAreaNative} ${areaUnit}`}
            />
            <p className="text-ink-500 text-xs leading-relaxed">{wallpaperFormula}</p>
          </Card>
        ) : (
          <Card className="text-ink-500 p-6 text-sm">
            Enter valid room dimensions to calculate wallpaper needed.
          </Card>
        )}
      </div>
    </div>
  );
}
