/**
 * Header and footer navigation structure. Edit this file to add, remove, or
 * reorder nav links — both Header and Footer read from here so the two
 * never drift apart.
 */

export interface NavLink {
  label: string;
  href: string;
  description?: string;
}

export const mainNav: NavLink[] = [
  { label: "Appliance Problems", href: "/appliances" },
  { label: "Error Codes", href: "/error-codes" },
  { label: "Cleaning", href: "/cleaning" },
  { label: "Home Maintenance", href: "/maintenance" },
  { label: "Heating & Cooling", href: "/heating-cooling" },
  { label: "Calculators", href: "/calculators" },
];

export const footerCategoryLinks: NavLink[] = [
  { label: "Appliance Problems", href: "/appliances" },
  { label: "Error Codes", href: "/error-codes" },
  { label: "Cleaning & Stain Removal", href: "/cleaning" },
  { label: "Home Maintenance", href: "/maintenance" },
  { label: "Heating & Cooling", href: "/heating-cooling" },
  { label: "Calculators", href: "/calculators" },
];

export const footerCompanyLinks: NavLink[] = [
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
  { label: "Editorial Policy", href: "/editorial-policy" },
];

export const footerLegalLinks: NavLink[] = [
  { label: "Privacy Policy", href: "/privacy-policy" },
  { label: "Terms of Use", href: "/terms-of-use" },
  { label: "Cookie Policy", href: "/cookie-policy" },
  { label: "Disclaimer", href: "/disclaimer" },
];
