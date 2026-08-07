export interface CalculatorMeta {
  slug: string;
  title: string;
  shortTitle: string;
  description: string;
}

export const calculators: CalculatorMeta[] = [
  {
    slug: "paint-calculator",
    title: "Paint Calculator",
    shortTitle: "Paint",
    description: "Work out how many gallons or liters of paint you need for a room.",
  },
  {
    slug: "flooring-calculator",
    title: "Flooring Calculator",
    shortTitle: "Flooring",
    description: "Calculate how much flooring material and how many boxes to buy.",
  },
  {
    slug: "wallpaper-calculator",
    title: "Wallpaper Calculator",
    shortTitle: "Wallpaper",
    description: "Find out how many rolls of wallpaper a room needs, waste included.",
  },
  {
    slug: "room-area-calculator",
    title: "Room Area Calculator",
    shortTitle: "Room Area",
    description: "Quickly calculate a room's floor area and perimeter.",
  },
  {
    slug: "electricity-cost-calculator",
    title: "Electricity Cost Calculator",
    shortTitle: "Electricity Cost",
    description: "Estimate what it costs to run an appliance per day, month, and year.",
  },
  {
    slug: "ac-btu-calculator",
    title: "Air Conditioner BTU Calculator",
    shortTitle: "AC BTU Size",
    description: "Get a BTU sizing estimate for a room air conditioner.",
  },
  {
    slug: "concrete-calculator",
    title: "Concrete Volume Calculator",
    shortTitle: "Concrete Volume",
    description: "Calculate concrete volume and bags needed for a slab or footing.",
  },
  {
    slug: "tile-calculator",
    title: "Tile Calculator",
    shortTitle: "Tile",
    description: "Work out how many tiles and boxes you need for a floor or wall.",
  },
];

export function getCalculator(slug: string): CalculatorMeta | undefined {
  return calculators.find((c) => c.slug === slug);
}
