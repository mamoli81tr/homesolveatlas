/**
 * Site taxonomy: categories, subcategories, brands, and rooms.
 *
 * This is the single source of truth for every classification used across
 * content frontmatter, filters, hub pages, and breadcrumbs.
 *
 * To add a new brand or subcategory, add an entry to the relevant array
 * below — hub pages and filters pick it up automatically. See
 * README.md → "How to add a new category" / "How to add a new brand".
 */

export type CategorySlug =
  "appliances" | "error-codes" | "cleaning" | "maintenance" | "heating-cooling";

export interface Category {
  slug: CategorySlug;
  label: string;
  shortLabel: string;
  description: string;
  href: string;
}

export const categories: Category[] = [
  {
    slug: "appliances",
    label: "Appliance Problems",
    shortLabel: "Appliances",
    description:
      "Diagnose washers, dryers, refrigerators, dishwashers, ovens, and other household appliances that are misbehaving.",
    href: "/appliances",
  },
  {
    slug: "error-codes",
    label: "Error Codes",
    shortLabel: "Error Codes",
    description:
      "Look up what an error code on your appliance display means, by brand, and what to check before calling for service.",
    href: "/error-codes",
  },
  {
    slug: "cleaning",
    label: "Cleaning & Stain Removal",
    shortLabel: "Cleaning",
    description:
      "Step-by-step stain removal and cleaning guides for carpets, clothing, kitchens, bathrooms, and more.",
    href: "/cleaning",
  },
  {
    slug: "maintenance",
    label: "Home Maintenance",
    shortLabel: "Maintenance",
    description:
      "Spot early warning signs around moisture, plumbing, electrical, flooring, and the building envelope before they become expensive.",
    href: "/maintenance",
  },
  {
    slug: "heating-cooling",
    label: "Heating & Cooling",
    shortLabel: "Heating & Cooling",
    description:
      "Troubleshoot furnaces, radiators, air conditioners, and ventilation problems and know when to call an HVAC technician.",
    href: "/heating-cooling",
  },
];

export function getCategory(slug: string): Category | undefined {
  return categories.find((c) => c.slug === slug);
}

export interface Subcategory {
  slug: string;
  label: string;
  category: CategorySlug;
  description: string;
}

export const applianceTypes: Subcategory[] = [
  {
    slug: "washing-machines",
    label: "Washing Machines",
    category: "appliances",
    description: "Draining, spinning, leaking, noise, and cycle problems.",
  },
  {
    slug: "dryers",
    label: "Dryers",
    category: "appliances",
    description: "Drying performance, heating, noise, and airflow issues.",
  },
  {
    slug: "refrigerators",
    label: "Refrigerators",
    category: "appliances",
    description: "Cooling, freezing, ice maker, and temperature problems.",
  },
  {
    slug: "dishwashers",
    label: "Dishwashers",
    category: "appliances",
    description: "Drainage, cleaning performance, and leak issues.",
  },
  {
    slug: "ovens",
    label: "Ovens",
    category: "appliances",
    description: "Heating, temperature accuracy, and self-clean problems.",
  },
  {
    slug: "microwaves",
    label: "Microwaves",
    category: "appliances",
    description: "Heating performance, noise, and sparking issues.",
  },
  {
    slug: "air-conditioners",
    label: "Air Conditioners",
    category: "appliances",
    description: "Cooling performance, leaks, noise, and airflow problems.",
  },
  {
    slug: "vacuum-cleaners",
    label: "Vacuum Cleaners",
    category: "appliances",
    description: "Suction loss, brush roll, and battery problems.",
  },
  {
    slug: "water-heaters",
    label: "Water Heaters",
    category: "appliances",
    description: "Hot water supply, temperature, and noise problems.",
  },
];

export const cleaningTypes: Subcategory[] = [
  {
    slug: "carpet-stains",
    label: "Carpet Stains",
    category: "cleaning",
    description: "Lift stains from carpet and rugs without damaging fibers.",
  },
  {
    slug: "clothing-stains",
    label: "Clothing Stains",
    category: "cleaning",
    description: "Treat fabric stains before and after they set.",
  },
  {
    slug: "bathroom-cleaning",
    label: "Bathroom Cleaning",
    category: "cleaning",
    description: "Tackle grime, soap scum, and mildew in bathrooms.",
  },
  {
    slug: "kitchen-cleaning",
    label: "Kitchen Cleaning",
    category: "cleaning",
    description: "Cut through grease, grime, and baked-on residue.",
  },
  {
    slug: "mold-and-mildew",
    label: "Mold and Mildew",
    category: "cleaning",
    description: "Remove surface mold safely and stop it coming back.",
  },
  {
    slug: "odor-removal",
    label: "Odor Removal",
    category: "cleaning",
    description: "Get rid of persistent household and fabric odors.",
  },
  {
    slug: "hard-water-stains",
    label: "Hard-Water Stains",
    category: "cleaning",
    description: "Dissolve mineral buildup on fixtures, glass, and tile.",
  },
  {
    slug: "appliance-cleaning",
    label: "Appliance Cleaning",
    category: "cleaning",
    description: "Keep washers, dishwashers, and ovens running cleanly.",
  },
];

export const maintenanceTypes: Subcategory[] = [
  {
    slug: "moisture-and-humidity",
    label: "Moisture and Humidity",
    category: "maintenance",
    description: "Identify and reduce excess indoor humidity and condensation.",
  },
  {
    slug: "windows-and-doors",
    label: "Windows and Doors",
    category: "maintenance",
    description: "Drafts, condensation, and sealing problems.",
  },
  {
    slug: "walls-and-ceilings",
    label: "Walls and Ceilings",
    category: "maintenance",
    description: "Cracks, stains, and signs of hidden problems.",
  },
  {
    slug: "flooring",
    label: "Flooring",
    category: "maintenance",
    description: "Warping, squeaks, and wear across floor types.",
  },
  {
    slug: "plumbing-symptoms",
    label: "Plumbing Symptoms",
    category: "maintenance",
    description: "Slow drains, pressure loss, and leak warning signs.",
  },
  {
    slug: "electrical-warning-signs",
    label: "Electrical Warning Signs",
    category: "maintenance",
    description: "Symptoms that call for a licensed electrician.",
  },
  {
    slug: "seasonal-maintenance",
    label: "Seasonal Maintenance",
    category: "maintenance",
    description: "Prepare your home for each season.",
  },
  {
    slug: "pest-prevention",
    label: "Pest Prevention",
    category: "maintenance",
    description: "Keep common household pests out.",
  },
];

export const heatingCoolingTypes: Subcategory[] = [
  {
    slug: "heating-systems",
    label: "Heating Systems",
    category: "heating-cooling",
    description: "Furnaces, radiators, and boilers.",
  },
  {
    slug: "air-conditioning",
    label: "Air Conditioning",
    category: "heating-cooling",
    description: "Central and window AC units.",
  },
  {
    slug: "ventilation",
    label: "Ventilation",
    category: "heating-cooling",
    description: "Airflow, filters, and indoor air quality.",
  },
  {
    slug: "thermostats",
    label: "Thermostats",
    category: "heating-cooling",
    description: "Controls, scheduling, and sensor issues.",
  },
];

export const allSubcategories: Subcategory[] = [
  ...applianceTypes,
  ...cleaningTypes,
  ...maintenanceTypes,
  ...heatingCoolingTypes,
];

export function getSubcategoriesForCategory(category: CategorySlug): Subcategory[] {
  return allSubcategories.filter((s) => s.category === category);
}

export function getSubcategory(
  category: CategorySlug,
  slug: string,
): Subcategory | undefined {
  return allSubcategories.find((s) => s.category === category && s.slug === slug);
}

export interface Brand {
  slug: string;
  label: string;
}

export const brands: Brand[] = [
  { slug: "samsung", label: "Samsung" },
  { slug: "lg", label: "LG" },
  { slug: "bosch", label: "Bosch" },
  { slug: "whirlpool", label: "Whirlpool" },
  { slug: "ge", label: "GE" },
  { slug: "frigidaire", label: "Frigidaire" },
  { slug: "maytag", label: "Maytag" },
  { slug: "electrolux", label: "Electrolux" },
  { slug: "kitchenaid", label: "KitchenAid" },
  { slug: "hotpoint", label: "Hotpoint" },
];

export function getBrand(slug: string): Brand | undefined {
  return brands.find((b) => b.slug === slug);
}

export interface Room {
  slug: string;
  label: string;
  description: string;
}

export const rooms: Room[] = [
  {
    slug: "kitchen",
    label: "Kitchen",
    description: "Appliance, plumbing, and cleaning problems in the kitchen.",
  },
  {
    slug: "bathroom",
    label: "Bathroom",
    description: "Moisture, mold, and fixture problems in the bathroom.",
  },
  {
    slug: "bedroom",
    label: "Bedroom",
    description: "Humidity, air quality, and comfort issues in bedrooms.",
  },
  {
    slug: "living-room",
    label: "Living Room",
    description: "Comfort, flooring, and climate issues in living spaces.",
  },
  {
    slug: "laundry-room",
    label: "Laundry Room",
    description: "Washer, dryer, and ventilation problems in the laundry room.",
  },
  {
    slug: "basement",
    label: "Basement",
    description: "Moisture, mold, and structural warning signs below ground.",
  },
  {
    slug: "garage",
    label: "Garage",
    description: "Temperature, pests, and storage-related issues.",
  },
  {
    slug: "garden",
    label: "Garden",
    description: "Outdoor maintenance and seasonal upkeep.",
  },
];

export function getRoom(slug: string): Room | undefined {
  return rooms.find((r) => r.slug === slug);
}

export const difficultyLevels = ["easy", "moderate", "advanced"] as const;
export type Difficulty = (typeof difficultyLevels)[number];

export const safetyLevels = ["low", "medium", "high"] as const;
export type SafetyLevel = (typeof safetyLevels)[number];

export const difficultyLabels: Record<Difficulty, string> = {
  easy: "Easy — no tools needed",
  moderate: "Moderate — basic tools",
  advanced: "Advanced — consider a professional",
};

export const safetyLevelLabels: Record<SafetyLevel, string> = {
  low: "Low safety risk",
  medium: "Moderate safety risk — read warnings",
  high: "High safety risk — professional recommended",
};
