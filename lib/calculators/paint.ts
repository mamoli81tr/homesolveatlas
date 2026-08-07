import { z } from "zod";
import { sqftToSqm, gallonsToLiters, round, type UnitSystem } from "./units";

// Average opening sizes subtracted from wall area. These are reasonable
// US/UK residential averages, not measurements of the user's actual doors
// and windows — the calculator explains this assumption inline.
export const AVG_DOOR_SQFT = 21; // ~80in x 36in
export const AVG_WINDOW_SQFT = 15; // ~5ft x 3ft

// Coverage assumes one coat on primed drywall; two coats is the common
// recommendation and is applied via the `coats` input, not baked in here.
export const DEFAULT_COVERAGE_SQFT_PER_GALLON = 350;

export const paintInputSchema = z.object({
  unit: z.enum(["imperial", "metric"]),
  length: z.coerce.number().positive("Length must be greater than 0"),
  width: z.coerce.number().positive("Width must be greater than 0"),
  height: z.coerce.number().positive("Height must be greater than 0"),
  doors: z.coerce.number().int().min(0).default(1),
  windows: z.coerce.number().int().min(0).default(1),
  coats: z.coerce.number().int().min(1).max(4).default(2),
  coveragePerGallon: z.coerce
    .number()
    .positive()
    .default(DEFAULT_COVERAGE_SQFT_PER_GALLON),
});

export type PaintInput = z.infer<typeof paintInputSchema>;

export interface PaintResult {
  wallAreaSqft: number;
  wallAreaSqm: number;
  paintableAreaSqft: number;
  gallonsNeeded: number;
  litersNeeded: number;
  cansOfGallon: number;
}

/**
 * All internal math happens in feet/sqft. Metric inputs are converted to
 * feet on the way in, so the wall-area formula only has to be written once.
 */
export function calculatePaint(input: PaintInput): PaintResult {
  const toFeet = (value: number) => (input.unit === "metric" ? value / 0.3048 : value);

  const lengthFt = toFeet(input.length);
  const widthFt = toFeet(input.width);
  const heightFt = toFeet(input.height);

  const grossWallAreaSqft = 2 * (lengthFt + widthFt) * heightFt;
  const openingsSqft = input.doors * AVG_DOOR_SQFT + input.windows * AVG_WINDOW_SQFT;
  const paintableAreaSqft = Math.max(grossWallAreaSqft - openingsSqft, 0);

  const gallonsNeeded = (paintableAreaSqft * input.coats) / input.coveragePerGallon;

  return {
    wallAreaSqft: round(grossWallAreaSqft),
    wallAreaSqm: round(sqftToSqm(grossWallAreaSqft)),
    paintableAreaSqft: round(paintableAreaSqft),
    gallonsNeeded: round(gallonsNeeded, 2),
    litersNeeded: round(gallonsToLiters(gallonsNeeded), 1),
    cansOfGallon: Math.ceil(gallonsNeeded),
  };
}

export function formulaExplanation(unit: UnitSystem): string {
  return unit === "imperial"
    ? "Wall area = 2 × (length + width) × height, minus ~21 sq ft per door and ~15 sq ft per window. Paint needed = paintable area × number of coats ÷ coverage per gallon."
    : "Wall area = 2 × (length + width) × height, minus average door/window openings, converted from imperial coverage. Paint needed = paintable area × number of coats ÷ coverage per gallon (converted to liters).";
}
