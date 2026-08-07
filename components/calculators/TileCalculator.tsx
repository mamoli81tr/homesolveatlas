"use client";

import { useMemo } from "react";
import { calculateTile, tileInputSchema, tileFormula } from "@/lib/calculators/tile";
import { NumberField, UnitToggle, ResultStat } from "@/components/calculators/fields";
import { useCalculatorUrlState } from "@/components/calculators/useCalculatorUrlState";
import { Card } from "@/components/ui/Card";

export function TileCalculator() {
  const [state, update] = useCalculatorUrlState({
    unit: "imperial" as "imperial" | "metric",
    roomLength: 10,
    roomWidth: 8,
    tileLength: 12,
    tileWidth: 12,
    wastePercent: 10,
    tilesPerBox: 10,
  });

  const parsed = tileInputSchema.safeParse(state);
  const result = useMemo(
    () => (parsed.success ? calculateTile(parsed.data) : null),
    [parsed],
  );
  const fieldErrors = parsed.success ? {} : parsed.error.flatten().fieldErrors;
  const lengthUnit = state.unit === "imperial" ? "ft" : "m";
  const tileUnit = state.unit === "imperial" ? "in" : "cm";

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
      <Card className="p-6">
        <div className="mb-5">
          <UnitToggle value={state.unit} onChange={(unit) => update({ unit })} />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <NumberField
            id="roomLength"
            label="Room length"
            value={state.roomLength}
            onChange={(v) => update({ roomLength: Number(v) })}
            suffix={lengthUnit}
            error={fieldErrors.roomLength?.[0]}
          />
          <NumberField
            id="roomWidth"
            label="Room width"
            value={state.roomWidth}
            onChange={(v) => update({ roomWidth: Number(v) })}
            suffix={lengthUnit}
            error={fieldErrors.roomWidth?.[0]}
          />
          <NumberField
            id="tileLength"
            label="Tile length"
            value={state.tileLength}
            onChange={(v) => update({ tileLength: Number(v) })}
            suffix={tileUnit}
            error={fieldErrors.tileLength?.[0]}
          />
          <NumberField
            id="tileWidth"
            label="Tile width"
            value={state.tileWidth}
            onChange={(v) => update({ tileWidth: Number(v) })}
            suffix={tileUnit}
            error={fieldErrors.tileWidth?.[0]}
          />
          <NumberField
            id="waste"
            label="Waste allowance"
            value={state.wastePercent}
            onChange={(v) => update({ wastePercent: Number(v) })}
            suffix="%"
            min={0}
            max={50}
            error={fieldErrors.wastePercent?.[0]}
          />
          <NumberField
            id="perBox"
            label="Tiles per box"
            value={state.tilesPerBox}
            onChange={(v) => update({ tilesPerBox: Number(v) })}
            step={1}
            error={fieldErrors.tilesPerBox?.[0]}
          />
        </div>
      </Card>

      <div aria-live="polite">
        {result ? (
          <Card className="space-y-3 p-6">
            <ResultStat
              label="Tiles to buy"
              value={`${result.tilesWithWaste}`}
              emphasis
            />
            {result.boxesNeeded !== null && (
              <ResultStat label="Boxes needed" value={`${result.boxesNeeded}`} />
            )}
            <ResultStat label="Exact tiles needed" value={`${result.tilesNeeded}`} />
            <p className="text-ink-500 text-xs leading-relaxed">{tileFormula}</p>
          </Card>
        ) : (
          <Card className="text-ink-500 p-6 text-sm">
            Enter valid room and tile dimensions to calculate tiles needed.
          </Card>
        )}
      </div>
    </div>
  );
}
