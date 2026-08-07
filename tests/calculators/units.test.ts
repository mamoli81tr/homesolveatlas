import { describe, it, expect } from "vitest";
import {
  feetToMeters,
  metersToFeet,
  sqftToSqm,
  sqmToSqft,
  gallonsToLiters,
  litersToGallons,
  cubicFeetToCubicMeters,
  cubicMetersToCubicFeet,
  cubicMetersToCubicYards,
  cubicYardsToCubicMeters,
  round,
} from "@/lib/calculators/units";

describe("unit conversions", () => {
  it("converts feet to meters and back", () => {
    expect(feetToMeters(10)).toBeCloseTo(3.048, 5);
    expect(metersToFeet(3.048)).toBeCloseTo(10, 5);
  });

  it("converts square feet to square meters and back", () => {
    expect(sqftToSqm(100)).toBeCloseTo(9.290304, 5);
    expect(sqmToSqft(9.290304)).toBeCloseTo(100, 5);
  });

  it("converts gallons to liters and back", () => {
    expect(gallonsToLiters(1)).toBeCloseTo(3.785411784, 6);
    expect(litersToGallons(3.785411784)).toBeCloseTo(1, 6);
  });

  it("converts cubic feet to cubic meters and back", () => {
    expect(cubicFeetToCubicMeters(1)).toBeCloseTo(0.028316846592, 8);
    expect(cubicMetersToCubicFeet(0.028316846592)).toBeCloseTo(1, 6);
  });

  it("converts cubic meters to cubic yards and back", () => {
    expect(cubicMetersToCubicYards(0.764554857984)).toBeCloseTo(1, 6);
    expect(cubicYardsToCubicMeters(1)).toBeCloseTo(0.764554857984, 6);
  });

  it("rounds to the given number of decimals", () => {
    expect(round(1.23456, 2)).toBe(1.23);
    expect(round(1.005, 2)).toBe(1.01);
    expect(round(10, 2)).toBe(10);
  });
});
