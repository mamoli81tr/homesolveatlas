import { z } from "zod";
import { round } from "./units";

// A standard US double roll covers about 56 sq ft (5.2 sqm) usable after trim.
export const DEFAULT_ROLL_COVERAGE_SQFT = 56;
export const DEFAULT_ROLL_COVERAGE_SQM = 5.2;

export const wallpaperInputSchema = z.object({
  unit: z.enum(["imperial", "metric"]),
  length: z.coerce.number().positive("Length must be greater than 0"),
  width: z.coerce.number().positive("Width must be greater than 0"),
  height: z.coerce.number().positive("Height must be greater than 0"),
  doors: z.coerce.number().int().min(0).default(1),
  windows: z.coerce.number().int().min(0).default(1),
  patternRepeatWastePercent: z.coerce.number().min(0).max(50).default(15),
  rollCoverage: z.coerce.number().positive().optional(),
});

export type WallpaperInput = z.infer<typeof wallpaperInputSchema>;

export interface WallpaperResult {
  wallAreaNative: number;
  paintableAreaNative: number;
  areaWithWasteNative: number;
  rollsNeeded: number;
}

const AVG_DOOR = { imperial: 21, metric: 1.95 };
const AVG_WINDOW = { imperial: 15, metric: 1.4 };

export function calculateWallpaper(input: WallpaperInput): WallpaperResult {
  const grossWallArea = 2 * (input.length + input.width) * input.height;
  const openings =
    input.doors * AVG_DOOR[input.unit] + input.windows * AVG_WINDOW[input.unit];
  const paintableArea = Math.max(grossWallArea - openings, 0);

  const areaWithWaste = paintableArea * (1 + input.patternRepeatWastePercent / 100);

  const defaultCoverage =
    input.unit === "imperial" ? DEFAULT_ROLL_COVERAGE_SQFT : DEFAULT_ROLL_COVERAGE_SQM;
  const coverage = input.rollCoverage ?? defaultCoverage;
  const rollsNeeded = Math.ceil(areaWithWaste / coverage);

  return {
    wallAreaNative: round(grossWallArea),
    paintableAreaNative: round(paintableArea),
    areaWithWasteNative: round(areaWithWaste),
    rollsNeeded,
  };
}

export const wallpaperFormula =
  "Wall area = 2 × (length + width) × height, minus average door/window openings. Add a pattern-repeat waste allowance, then divide by the usable coverage of one roll, rounded up.";
