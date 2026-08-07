import { describe, it, expect } from "vitest";
import { calculateBtu, btuInputSchema, BASE_BTU_PER_SQFT } from "@/lib/calculators/btu";

describe("AC BTU Calculator", () => {
  it("calculates baseline BTU for a normal room with 2 occupants", () => {
    const input = btuInputSchema.parse({
      unit: "imperial",
      area: 200,
      occupants: 2,
      sunExposure: "normal",
      hasKitchen: false,
    });
    const result = calculateBtu(input);
    expect(result.baseBtu).toBe(200 * BASE_BTU_PER_SQFT);
    expect(result.adjustedBtu).toBe(200 * BASE_BTU_PER_SQFT);
  });

  it("increases BTU for sunny rooms and decreases for shaded rooms", () => {
    const base = btuInputSchema.parse({
      unit: "imperial",
      area: 200,
      occupants: 2,
      sunExposure: "normal",
      hasKitchen: false,
    });
    const sunny = btuInputSchema.parse({ ...base, sunExposure: "sunny" });
    const shaded = btuInputSchema.parse({ ...base, sunExposure: "shaded" });

    expect(calculateBtu(sunny).adjustedBtu).toBeGreaterThan(
      calculateBtu(base).adjustedBtu,
    );
    expect(calculateBtu(shaded).adjustedBtu).toBeLessThan(calculateBtu(base).adjustedBtu);
  });

  it("adds 600 BTU per occupant beyond two", () => {
    const twoOccupants = btuInputSchema.parse({
      unit: "imperial",
      area: 200,
      occupants: 2,
      sunExposure: "normal",
      hasKitchen: false,
    });
    const fourOccupants = btuInputSchema.parse({ ...twoOccupants, occupants: 4 });

    const diff =
      calculateBtu(fourOccupants).adjustedBtu - calculateBtu(twoOccupants).adjustedBtu;
    expect(diff).toBe(1200);
  });

  it("adds 4000 BTU when the room includes a kitchen", () => {
    const withoutKitchen = btuInputSchema.parse({
      unit: "imperial",
      area: 150,
      occupants: 2,
      sunExposure: "normal",
      hasKitchen: false,
    });
    const withKitchen = btuInputSchema.parse({ ...withoutKitchen, hasKitchen: true });

    const diff =
      calculateBtu(withKitchen).adjustedBtu - calculateBtu(withoutKitchen).adjustedBtu;
    expect(diff).toBe(4000);
  });

  it("converts metric area to sqft before calculating", () => {
    const metric = btuInputSchema.parse({
      unit: "metric",
      area: 20,
      occupants: 2,
      sunExposure: "normal",
      hasKitchen: false,
    });
    const result = calculateBtu(metric);
    // 20 sqm ~= 215 sqft
    expect(result.areaSqft).toBeGreaterThan(210);
    expect(result.areaSqft).toBeLessThan(220);
  });
});
