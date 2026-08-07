import { z } from "zod";
import { sqftToSqm, sqmToSqft, round } from "./units";

export const flooringInputSchema = z.object({
  unit: z.enum(["imperial", "metric"]),
  length: z.coerce.number().positive("Length must be greater than 0"),
  width: z.coerce.number().positive("Width must be greater than 0"),
  wastePercent: z.coerce.number().min(0).max(50).default(10),
  coveragePerBox: z.coerce.number().positive().optional(),
});

export type FlooringInput = z.infer<typeof flooringInputSchema>;

export interface FlooringResult {
  areaSqft: number;
  areaSqm: number;
  areaWithWasteSqft: number;
  areaWithWasteSqm: number;
  boxesNeeded: number | null;
}

/** Length/width are used as entered (converted to sq ft for the imperial figure only for display). */
export function calculateFlooring(input: FlooringInput): FlooringResult {
  const areaNative = input.length * input.width;
  const areaSqft =
    input.unit === "imperial" ? areaNative : round(sqmToSqft(areaNative), 4);
  const areaSqm = input.unit === "metric" ? areaNative : round(sqftToSqm(areaNative), 4);

  const wasteMultiplier = 1 + input.wastePercent / 100;
  const areaWithWasteSqft = areaSqft * wasteMultiplier;
  const areaWithWasteSqm = areaSqm * wasteMultiplier;

  const boxesNeeded = input.coveragePerBox
    ? Math.ceil(
        (input.unit === "imperial" ? areaWithWasteSqft : areaWithWasteSqm) /
          input.coveragePerBox,
      )
    : null;

  return {
    areaSqft: round(areaSqft),
    areaSqm: round(areaSqm),
    areaWithWasteSqft: round(areaWithWasteSqft),
    areaWithWasteSqm: round(areaWithWasteSqm),
    boxesNeeded,
  };
}

export const flooringFormula =
  "Floor area = length × width. Material to buy = floor area × (1 + waste %). Boxes needed = material to buy ÷ coverage per box, rounded up.";
