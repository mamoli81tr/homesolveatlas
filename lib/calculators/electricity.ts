import { z } from "zod";
import { round } from "./units";

export const electricityInputSchema = z.object({
  watts: z.coerce.number().positive("Power (watts) must be greater than 0"),
  hoursPerDay: z.coerce.number().min(0).max(24, "Hours per day cannot exceed 24"),
  daysPerMonth: z.coerce.number().min(1).max(31).default(30),
  costPerKwh: z.coerce.number().positive("Electricity rate must be greater than 0"),
});

export type ElectricityInput = z.infer<typeof electricityInputSchema>;

export interface ElectricityResult {
  kwhPerDay: number;
  kwhPerMonth: number;
  costPerDay: number;
  costPerMonth: number;
  costPerYear: number;
}

export function calculateElectricityCost(input: ElectricityInput): ElectricityResult {
  const kwhPerDay = (input.watts * input.hoursPerDay) / 1000;
  const kwhPerMonth = kwhPerDay * input.daysPerMonth;
  const costPerDay = kwhPerDay * input.costPerKwh;
  const costPerMonth = kwhPerMonth * input.costPerKwh;
  const costPerYear = costPerDay * 365;

  return {
    kwhPerDay: round(kwhPerDay, 3),
    kwhPerMonth: round(kwhPerMonth, 2),
    costPerDay: round(costPerDay, 2),
    costPerMonth: round(costPerMonth, 2),
    costPerYear: round(costPerYear, 2),
  };
}

export const electricityFormula =
  "Energy (kWh) = watts × hours used ÷ 1000. Cost = energy (kWh) × your price per kWh. Monthly and yearly figures scale the daily energy use accordingly.";
