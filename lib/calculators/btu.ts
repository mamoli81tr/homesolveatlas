import { z } from "zod";
import { sqmToSqft, round } from "./units";

// Base rule of thumb used by most consumer BTU guides: ~20 BTU per sq ft.
export const BASE_BTU_PER_SQFT = 20;

export const sunExposureLevels = ["shaded", "normal", "sunny"] as const;
export type SunExposure = (typeof sunExposureLevels)[number];

const sunExposureMultiplier: Record<SunExposure, number> = {
  shaded: 0.9,
  normal: 1,
  sunny: 1.1,
};

export const btuInputSchema = z.object({
  unit: z.enum(["imperial", "metric"]),
  area: z.coerce.number().positive("Room area must be greater than 0"),
  ceilingHeight: z.coerce.number().positive().optional(),
  occupants: z.coerce.number().int().min(1).max(20).default(2),
  sunExposure: z.enum(sunExposureLevels).default("normal"),
  hasKitchen: z.boolean().default(false),
});

export type BtuInput = z.infer<typeof btuInputSchema>;

export interface BtuResult {
  areaSqft: number;
  baseBtu: number;
  adjustedBtu: number;
  recommendedRangeLow: number;
  recommendedRangeHigh: number;
}

/**
 * Simplified sizing estimate for a single room, based on the common
 * "20 BTU per sq ft" consumer rule of thumb, adjusted for sun exposure,
 * extra occupants, and kitchen heat load. This is NOT a substitute for a
 * professional Manual J load calculation, especially for whole-home systems.
 */
export function calculateBtu(input: BtuInput): BtuResult {
  const areaSqft = input.unit === "imperial" ? input.area : sqmToSqft(input.area);

  const baseBtu = areaSqft * BASE_BTU_PER_SQFT;
  let adjustedBtu = baseBtu * sunExposureMultiplier[input.sunExposure];

  const extraOccupants = Math.max(input.occupants - 2, 0);
  adjustedBtu += extraOccupants * 600;

  if (input.hasKitchen) adjustedBtu += 4000;

  return {
    areaSqft: round(areaSqft),
    baseBtu: Math.round(baseBtu),
    adjustedBtu: Math.round(adjustedBtu),
    recommendedRangeLow: Math.round(adjustedBtu * 0.95),
    recommendedRangeHigh: Math.round(adjustedBtu * 1.1),
  };
}

export const btuFormula =
  "Base BTU = room area (sq ft) × 20. Adjust for sun exposure (±10%), add 600 BTU per occupant beyond 2, and add 4,000 BTU if the room includes a kitchen. Shown as a range, not a single exact number.";
