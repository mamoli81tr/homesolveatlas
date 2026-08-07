import { describe, it, expect } from "vitest";
import {
  calculatePaint,
  paintInputSchema,
  DEFAULT_COVERAGE_SQFT_PER_GALLON,
} from "@/lib/calculators/paint";

describe("Paint Calculator", () => {
  it("calculates paint needed for a standard imperial room", () => {
    const input = paintInputSchema.parse({
      unit: "imperial",
      length: 12,
      width: 10,
      height: 8,
      doors: 1,
      windows: 1,
      coats: 2,
      coveragePerGallon: DEFAULT_COVERAGE_SQFT_PER_GALLON,
    });
    const result = calculatePaint(input);

    // Gross wall area = 2 * (12+10) * 8 = 352 sq ft
    expect(result.wallAreaSqft).toBe(352);
    // Paintable = 352 - 21 (door) - 15 (window) = 316
    expect(result.paintableAreaSqft).toBe(316);
    // Gallons = 316 * 2 / 350 = 1.8057...
    expect(result.gallonsNeeded).toBeCloseTo(1.81, 2);
    expect(result.cansOfGallon).toBe(2);
  });

  it("converts metric input to consistent imperial-based math", () => {
    const input = paintInputSchema.parse({
      unit: "metric",
      length: 3.66, // ~12 ft
      width: 3.05, // ~10 ft
      height: 2.44, // ~8 ft
      doors: 0,
      windows: 0,
      coats: 1,
      coveragePerGallon: DEFAULT_COVERAGE_SQFT_PER_GALLON,
    });
    const result = calculatePaint(input);
    // Should be close to the imperial equivalent gross wall area (352 sqft) for 1 coat, no openings
    expect(result.wallAreaSqft).toBeGreaterThan(340);
    expect(result.wallAreaSqft).toBeLessThan(365);
  });

  it("never returns a negative paintable area when openings exceed wall area", () => {
    const input = paintInputSchema.parse({
      unit: "imperial",
      length: 4,
      width: 4,
      height: 4,
      doors: 5,
      windows: 5,
      coats: 1,
      coveragePerGallon: DEFAULT_COVERAGE_SQFT_PER_GALLON,
    });
    const result = calculatePaint(input);
    expect(result.paintableAreaSqft).toBeGreaterThanOrEqual(0);
  });

  it("rejects non-positive dimensions", () => {
    const result = paintInputSchema.safeParse({
      unit: "imperial",
      length: 0,
      width: 10,
      height: 8,
      doors: 1,
      windows: 1,
      coats: 2,
      coveragePerGallon: DEFAULT_COVERAGE_SQFT_PER_GALLON,
    });
    expect(result.success).toBe(false);
  });
});
