import type { LucideIcon } from "lucide-react";
import {
  WashingMachine,
  Wind,
  Refrigerator,
  UtensilsCrossed,
  Flame,
  Microwave,
  Snowflake,
  Droplets,
  Shirt,
  Bath,
  Sparkles,
  Bug,
  Zap,
  Fan,
  Thermometer,
  AlertOctagon,
  Wrench,
  LayoutGrid,
  AppWindow,
  Layers,
  Sun,
  Calculator,
} from "lucide-react";
import type { CategorySlug } from "@/config/taxonomy";

/**
 * Visual identity system for content that has no uploaded photo. Every
 * article/hub gets a deterministic icon + gradient pairing based on its
 * category/subcategory instead of a missing or fake stock photo — cheap
 * (inline SVG, no image request), consistent, and copyright-free.
 */

export interface Visual {
  icon: LucideIcon;
  gradient: [string, string];
}

const DEFAULT_GRADIENT: [string, string] = ["#2563eb", "#10b981"];

const categoryVisuals: Record<CategorySlug, Visual> = {
  appliances: { icon: WashingMachine, gradient: ["#2563eb", "#0ea5e9"] },
  "error-codes": { icon: AlertOctagon, gradient: ["#d97706", "#dc2626"] },
  cleaning: { icon: Sparkles, gradient: ["#0ea5e9", "#10b981"] },
  maintenance: { icon: Wrench, gradient: ["#4f46e5", "#2563eb"] },
  "heating-cooling": { icon: Thermometer, gradient: ["#ea580c", "#2563eb"] },
};

const subcategoryVisuals: Record<string, Visual> = {
  // appliances
  "washing-machines": { icon: WashingMachine, gradient: ["#2563eb", "#0ea5e9"] },
  dryers: { icon: Wind, gradient: ["#0891b2", "#2563eb"] },
  refrigerators: { icon: Refrigerator, gradient: ["#0ea5e9", "#4f46e5"] },
  dishwashers: { icon: UtensilsCrossed, gradient: ["#2563eb", "#10b981"] },
  ovens: { icon: Flame, gradient: ["#ea580c", "#dc2626"] },
  microwaves: { icon: Microwave, gradient: ["#4f46e5", "#0ea5e9"] },
  "air-conditioners": { icon: Snowflake, gradient: ["#0ea5e9", "#2563eb"] },
  "vacuum-cleaners": { icon: Sparkles, gradient: ["#7c3aed", "#2563eb"] },
  "water-heaters": { icon: Droplets, gradient: ["#dc2626", "#ea580c"] },
  // cleaning
  "carpet-stains": { icon: Layers, gradient: ["#0ea5e9", "#10b981"] },
  "clothing-stains": { icon: Shirt, gradient: ["#2563eb", "#0ea5e9"] },
  "bathroom-cleaning": { icon: Bath, gradient: ["#0891b2", "#10b981"] },
  "kitchen-cleaning": { icon: UtensilsCrossed, gradient: ["#10b981", "#0ea5e9"] },
  "mold-and-mildew": { icon: Droplets, gradient: ["#4f46e5", "#7c3aed"] },
  "odor-removal": { icon: Wind, gradient: ["#0ea5e9", "#4f46e5"] },
  "hard-water-stains": { icon: Droplets, gradient: ["#0891b2", "#2563eb"] },
  "appliance-cleaning": { icon: WashingMachine, gradient: ["#2563eb", "#10b981"] },
  // maintenance
  "moisture-and-humidity": { icon: Droplets, gradient: ["#0ea5e9", "#4f46e5"] },
  "windows-and-doors": { icon: AppWindow, gradient: ["#2563eb", "#0891b2"] },
  "walls-and-ceilings": { icon: Layers, gradient: ["#4f46e5", "#2563eb"] },
  flooring: { icon: LayoutGrid, gradient: ["#7c3aed", "#2563eb"] },
  "plumbing-symptoms": { icon: Droplets, gradient: ["#0891b2", "#10b981"] },
  "electrical-warning-signs": { icon: Zap, gradient: ["#d97706", "#dc2626"] },
  "seasonal-maintenance": { icon: Sun, gradient: ["#ea580c", "#d97706"] },
  "pest-prevention": { icon: Bug, gradient: ["#16a34a", "#4f46e5"] },
  // heating-cooling
  "heating-systems": { icon: Flame, gradient: ["#ea580c", "#dc2626"] },
  "air-conditioning": { icon: Snowflake, gradient: ["#0ea5e9", "#2563eb"] },
  ventilation: { icon: Fan, gradient: ["#0891b2", "#4f46e5"] },
  thermostats: { icon: Thermometer, gradient: ["#4f46e5", "#ea580c"] },
};

export function getCategoryVisual(category: CategorySlug): Visual {
  return categoryVisuals[category] ?? { icon: Wrench, gradient: DEFAULT_GRADIENT };
}

export function getSubcategoryVisual(subcategory?: string): Visual | undefined {
  if (!subcategory) return undefined;
  return subcategoryVisuals[subcategory];
}

/** Best-available visual for an article: subcategory > category. */
export function getArticleVisual(fm: { category: CategorySlug; subcategory?: string }): Visual {
  return getSubcategoryVisual(fm.subcategory) ?? getCategoryVisual(fm.category);
}

export const calculatorVisual: Visual = { icon: Calculator, gradient: DEFAULT_GRADIENT };
