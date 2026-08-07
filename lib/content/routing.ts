import type { ArticleFrontmatter } from "./schema";

/**
 * Computes the canonical site path for an article from its frontmatter.
 * This is the ONE place URL structure is decided — keep hub pages and
 * `relatedArticles` links in sync by always going through this function
 * instead of hand-building paths.
 *
 *   appliances     -> /appliances/{subcategory}/{slug}
 *   error-codes    -> /error-codes/{brand}/{slug}
 *   cleaning       -> /cleaning/{slug}
 *   maintenance    -> /maintenance/{slug}
 *   heating-cooling -> /heating-cooling/{slug}
 */
export function getArticleHref(
  fm: Pick<ArticleFrontmatter, "category" | "subcategory" | "brand" | "slug">,
): string {
  switch (fm.category) {
    case "appliances":
      if (!fm.subcategory) {
        throw new Error(
          `Article "${fm.slug}" is in category "appliances" but has no subcategory`,
        );
      }
      return `/appliances/${fm.subcategory}/${fm.slug}`;
    case "error-codes":
      if (!fm.brand) {
        throw new Error(
          `Article "${fm.slug}" is in category "error-codes" but has no brand`,
        );
      }
      return `/error-codes/${fm.brand}/${fm.slug}`;
    case "cleaning":
      return `/cleaning/${fm.slug}`;
    case "maintenance":
      return `/maintenance/${fm.slug}`;
    case "heating-cooling":
      return `/heating-cooling/${fm.slug}`;
    default: {
      const _exhaustive: never = fm.category;
      throw new Error(`Unknown category: ${_exhaustive}`);
    }
  }
}
