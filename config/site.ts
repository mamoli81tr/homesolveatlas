/**
 * Central site identity config.
 *
 * This is the ONLY file you should need to edit to rebrand the site (name,
 * tagline, domain, social links) or point it at a different domain — every
 * page, the sitemap, RSS feed, OG image generator, and structured data read
 * from here. See README.md → "How to change the site name and URL".
 */

const PRODUCTION_URL = "https://homesolveatlas.com";

const rawSiteUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim();
const isProductionBuild = process.env.NODE_ENV === "production";

// Resolution order: explicit env var > production domain (safe default for
// any production build, even if NEXT_PUBLIC_SITE_URL was accidentally left
// unset) > localhost (local dev only). This means metadata, canonical URLs,
// and JSON-LD can never accidentally ship pointing at localhost.
const resolvedUrl = rawSiteUrl || (isProductionBuild ? PRODUCTION_URL : "http://localhost:3000");

export const siteConfig = {
  name: "HomeSolveAtlas",
  shortName: "HomeSolveAtlas",
  tagline: "Practical solutions for everyday home problems.",
  defaultTitle: "HomeSolveAtlas — Practical solutions for everyday home problems.",
  description:
    "HomeSolveAtlas helps you diagnose appliance error codes, fix common household breakdowns, remove stubborn stains, and stop moisture, mold, and odor problems before they spread — with clear, safety-first, step-by-step guides.",
  url: resolvedUrl.replace(/\/+$/, ""),
  // Bare hostname of whichever URL is currently active (localhost:3000 in
  // dev, homesolveatlas.com in production) — kept in sync with `url` above
  // rather than hardcoded, since it's used for non-URL contexts like the
  // robots.txt Host directive.
  domain: new URL(resolvedUrl).host,
  locale: "en-US",
  language: "en",
  founded: 2024,
  publisher: "HomeSolveAtlas",
  defaultAuthor: "Home Solutions Editorial Team",
  // Leave blank until real accounts exist — genuinely unused (never
  // fabricated) social handles are simply omitted from structured data and
  // the footer rather than rendering a fake/dead link.
  social: {
    twitter: "",
    facebook: "",
    pinterest: "",
  },
  // No contact address is invented here. Set NEXT_PUBLIC_CONTACT_EMAIL once
  // a real, monitored inbox exists — until then the Contact page and legal
  // pages detect the empty string and show an honest "not yet available"
  // state instead of a fake or broken mailto: link.
  contactEmail: process.env.NEXT_PUBLIC_CONTACT_EMAIL?.trim() ?? "",
  keywords: [
    "appliance error codes",
    "home repair guide",
    "stain removal",
    "home maintenance",
    "mold and moisture",
    "heating and cooling problems",
    "home calculators",
  ],
} as const;

export type SiteConfig = typeof siteConfig;
