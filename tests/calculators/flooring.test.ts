import { describe, it, expect } from "vitest";
import { calculateFlooring, flooringInputSchema } from "@/lib/calculators/flooring";

describe("Flooring Calculator", () => {
  it("calculates area with waste and boxes needed", () => {
    const input = flooringInputSchema.parse({
      unit: "imperial",
      length: 14,
      width: 11,
      wastePercent: 10,
      coveragePerBox: 20,
    });
    const result = calculateFlooring(input);

    expect(result.areaSqft).toBe(154);
    expect(result.areaWithWasteSqft).toBeCloseTo(169.4, 1);
    expect(result.boxesNeeded).toBe(Math.ceil(169.4 / 20));
  });

  it("returns null boxesNeeded when no coverage is provided", () => {
    const input = flooringInputSchema.parse({ unit: "imperial", length: 10, width: 10 });
    const result = calculateFlooring(input);
    expect(result.boxesNeeded).toBeNull();
  });

  it("applies a 0% waste allowance without change", () => {
    const input = flooringInputSchema.parse({
      unit: "imperial",
      length: 10,
      width: 10,
      wastePercent: 0,
    });
    const result = calculateFlooring(input);
    expect(result.areaWithWasteSqft).toBe(result.areaSqft);
  });

  it("rejects waste percentages above the allowed maximum", () => {
    const result = flooringInputSchema.safeParse({
      unit: "imperial",
      length: 10,
      width: 10,
      wastePercent: 999,
    });
    expect(result.success).toBe(false);
  });
});
