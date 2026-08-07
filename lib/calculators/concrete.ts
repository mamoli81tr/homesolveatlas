import { z } from "zod";
import {
  cubicFeetToCubicMeters,
  cubicMetersToCubicFeet,
  cubicMetersToCubicYards,
  round,
} from "./units";

// Approximate yield per pre-mixed bag, per common bag sizes.
export const BAG_YIELD_CUBIC_FEET: Record<"40lb" | "60lb" | "80lb", number> = {
  "40lb": 0.3,
  "60lb": 0.45,
  "80lb": 0.6,
};
export const BAG_YIELD_CUBIC_METERS_25KG = 0.0116;

export const concreteInputSchema = z.object({
  unit: z.enum(["imperial", "metric"]),
  length: z.coerce.number().positive("Length must be greater than 0"),
  width: z.coerce.number().positive("Width must be greater than 0"),
  // Thickness in inches (imperial) or centimeters (metric) — a separate,
  // smaller unit than length/width since slabs are usually a few inches thick.
  thickness: z.coerce.number().positive("Thickness must be greater than 0"),
  bagSize: z.enum(["40lb", "60lb", "80lb"]).default("60lb"),
});

export type ConcreteInput = z.infer<typeof concreteInputSchema>;

export interface ConcreteResult {
  volumeCubicFeet: number;
  volumeCubicYards: number;
  volumeCubicMeters: number;
  bagsNeeded: number | null;
}

export function calculateConcrete(input: ConcreteInput): ConcreteResult {
  let volumeCubicMeters: number;
  let volumeCubicFeet: number;

  if (input.unit === "imperial") {
    const thicknessFt = input.thickness / 12;
    volumeCubicFeet = input.length * input.width * thicknessFt;
    volumeCubicMeters = cubicFeetToCubicMeters(volumeCubicFeet);
  } else {
    const thicknessM = input.thickness / 100;
    volumeCubicMeters = input.length * input.width * thicknessM;
    volumeCubicFeet = cubicMetersToCubicFeet(volumeCubicMeters);
  }

  const bagsNeeded =
    input.unit === "imperial"
      ? Math.ceil(volumeCubicFeet / BAG_YIELD_CUBIC_FEET[input.bagSize])
      : Math.ceil(volumeCubicMeters / BAG_YIELD_CUBIC_METERS_25KG);

  return {
    volumeCubicFeet: round(volumeCubicFeet, 2),
    volumeCubicYards: round(cubicMetersToCubicYards(volumeCubicMeters), 3),
    volumeCubicMeters: round(volumeCubicMeters, 3),
    bagsNeeded,
  };
}

export const concreteFormula =
  "Volume = length × width × thickness (thickness converted to the same unit first). Bags needed = volume ÷ yield per bag, rounded up. Always add ~5–10% extra for spillage and an uneven subgrade.";
