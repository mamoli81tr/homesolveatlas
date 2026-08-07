import { z } from "zod";
import { round } from "./units";

export const tileInputSchema = z.object({
  unit: z.enum(["imperial", "metric"]),
  roomLength: z.coerce.number().positive("Room length must be greater than 0"),
  roomWidth: z.coerce.number().positive("Room width must be greater than 0"),
  // Tile dimensions in inches (imperial) or centimeters (metric).
  tileLength: z.coerce.number().positive("Tile length must be greater than 0"),
  tileWidth: z.coerce.number().positive("Tile width must be greater than 0"),
  wastePercent: z.coerce.number().min(0).max(50).default(10),
  tilesPerBox: z.coerce.number().int().positive().optional(),
});

export type TileInput = z.infer<typeof tileInputSchema>;

export interface TileResult {
  roomAreaNative: number;
  tileAreaNative: number;
  tilesNeeded: number;
  tilesWithWaste: number;
  boxesNeeded: number | null;
}

export function calculateTile(input: TileInput): TileResult {
  const roomAreaNative = input.roomLength * input.roomWidth;

  // Convert tile dimensions (inches or cm) to the same unit as the room (ft or m).
  const unitDivisor = input.unit === "imperial" ? 12 : 100;
  const tileAreaNative =
    (input.tileLength / unitDivisor) * (input.tileWidth / unitDivisor);

  const tilesNeeded = Math.ceil(roomAreaNative / tileAreaNative);
  const tilesWithWaste = Math.ceil(tilesNeeded * (1 + input.wastePercent / 100));

  const boxesNeeded = input.tilesPerBox
    ? Math.ceil(tilesWithWaste / input.tilesPerBox)
    : null;

  return {
    roomAreaNative: round(roomAreaNative),
    tileAreaNative: round(tileAreaNative, 4),
    tilesNeeded,
    tilesWithWaste,
    boxesNeeded,
  };
}

export const tileFormula =
  "Tiles needed = room area ÷ single-tile area, rounded up. Add a waste allowance (10% is typical for straight-lay, more for diagonal or patterned layouts) to get the amount to actually buy.";
