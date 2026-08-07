/**
 * Unit conversion constants and helpers shared by every calculator.
 * Keep all conversion factors in this one file so they're tested once
 * (see tests/calculators/units.test.ts) and reused everywhere.
 */

export const FEET_TO_METERS = 0.3048;
export const METERS_TO_FEET = 1 / FEET_TO_METERS;

export const SQFT_TO_SQM = 0.09290304;
export const SQM_TO_SQFT = 1 / SQFT_TO_SQM;

export const INCHES_TO_CM = 2.54;
export const CM_TO_INCHES = 1 / INCHES_TO_CM;

export const GALLONS_TO_LITERS = 3.785411784;
export const LITERS_TO_GALLONS = 1 / GALLONS_TO_LITERS;

export const CUBIC_FEET_TO_CUBIC_METERS = 0.028316846592;
export const CUBIC_METERS_TO_CUBIC_FEET = 1 / CUBIC_FEET_TO_CUBIC_METERS;

export const CUBIC_YARDS_TO_CUBIC_METERS = 0.764554857984;
export const CUBIC_METERS_TO_CUBIC_YARDS = 1 / CUBIC_YARDS_TO_CUBIC_METERS;

export const CUBIC_FEET_TO_CUBIC_YARDS = 1 / 27;

export function feetToMeters(feet: number): number {
  return feet * FEET_TO_METERS;
}

export function metersToFeet(meters: number): number {
  return meters * METERS_TO_FEET;
}

export function sqftToSqm(sqft: number): number {
  return sqft * SQFT_TO_SQM;
}

export function sqmToSqft(sqm: number): number {
  return sqm * SQM_TO_SQFT;
}

export function gallonsToLiters(gallons: number): number {
  return gallons * GALLONS_TO_LITERS;
}

export function litersToGallons(liters: number): number {
  return liters * LITERS_TO_GALLONS;
}

export function cubicFeetToCubicMeters(cubicFeet: number): number {
  return cubicFeet * CUBIC_FEET_TO_CUBIC_METERS;
}

export function cubicMetersToCubicFeet(cubicMeters: number): number {
  return cubicMeters * CUBIC_METERS_TO_CUBIC_FEET;
}

export function cubicMetersToCubicYards(cubicMeters: number): number {
  return cubicMeters * CUBIC_METERS_TO_CUBIC_YARDS;
}

export function cubicYardsToCubicMeters(cubicYards: number): number {
  return cubicYards * CUBIC_YARDS_TO_CUBIC_METERS;
}

export type UnitSystem = "imperial" | "metric";

export function round(value: number, decimals = 2): number {
  // The exponential-notation round-trip avoids classic binary floating-point
  // artifacts (e.g. a naive `Math.round(1.005 * 100) / 100` yields 1 instead
  // of 1.01) by rounding against the shortest decimal string representation
  // instead of the raw binary value.
  const shifted = Number(`${value}e${decimals}`);
  const rounded = Math.round(shifted);
  return Number(`${rounded}e-${decimals}`);
}
