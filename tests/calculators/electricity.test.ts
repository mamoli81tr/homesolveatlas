import { describe, it, expect } from "vitest";
import {
  calculateElectricityCost,
  electricityInputSchema,
} from "@/lib/calculators/electricity";

describe("Electricity Cost Calculator", () => {
  it("calculates daily, monthly, and yearly cost", () => {
    const input = electricityInputSchema.parse({
      watts: 1500,
      hoursPerDay: 3,
      daysPerMonth: 30,
      costPerKwh: 0.16,
    });
    const result = calculateElectricityCost(input);

    // kWh/day = 1500 * 3 / 1000 = 4.5
    expect(result.kwhPerDay).toBeCloseTo(4.5, 3);
    // cost/day = 4.5 * 0.16 = 0.72
    expect(result.costPerDay).toBeCloseTo(0.72, 2);
    // cost/month = 0.72 * 30 = 21.6
    expect(result.costPerMonth).toBeCloseTo(21.6, 1);
    // cost/year = 0.72 * 365 = 262.8
    expect(result.costPerYear).toBeCloseTo(262.8, 1);
  });

  it("scales linearly with wattage", () => {
    const base = electricityInputSchema.parse({
      watts: 1000,
      hoursPerDay: 1,
      daysPerMonth: 30,
      costPerKwh: 0.1,
    });
    const doubled = electricityInputSchema.parse({ ...base, watts: 2000 });

    expect(calculateElectricityCost(doubled).costPerDay).toBeCloseTo(
      calculateElectricityCost(base).costPerDay * 2,
      5,
    );
  });

  it("rejects hours per day above 24", () => {
    const result = electricityInputSchema.safeParse({
      watts: 1000,
      hoursPerDay: 25,
      daysPerMonth: 30,
      costPerKwh: 0.1,
    });
    expect(result.success).toBe(false);
  });

  it("rejects a non-positive electricity rate", () => {
    const result = electricityInputSchema.safeParse({
      watts: 1000,
      hoursPerDay: 3,
      daysPerMonth: 30,
      costPerKwh: 0,
    });
    expect(result.success).toBe(false);
  });
});
