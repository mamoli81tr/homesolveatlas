import { z } from "zod";
import { sqftToSqm, sqmToSqft, round } from "./units";

export const roomAreaInputSchema = z.object({
  unit: z.enum(["imperial", "metric"]),
  length: z.coerce.number().positive("Length must be greater than 0"),
  width: z.coerce.number().positive("Width must be greater than 0"),
});

export type RoomAreaInput = z.infer<typeof roomAreaInputSchema>;

export interface RoomAreaResult {
  areaSqft: number;
  areaSqm: number;
  perimeterNative: number;
}

export function calculateRoomArea(input: RoomAreaInput): RoomAreaResult {
  const areaNative = input.length * input.width;
  const perimeterNative = 2 * (input.length + input.width);

  return {
    areaSqft: round(input.unit === "imperial" ? areaNative : sqmToSqft(areaNative)),
    areaSqm: round(input.unit === "metric" ? areaNative : sqftToSqm(areaNative)),
    perimeterNative: round(perimeterNative),
  };
}

export const roomAreaFormula = "Area = length × width. Perimeter = 2 × (length + width).";
