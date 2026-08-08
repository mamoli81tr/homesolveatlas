import { categories, allSubcategories, brands, rooms } from "@/config/taxonomy";
import { calculators } from "@/config/calculators";
import {
  getAllArticles,
  getArticlesBySubcategory,
  getArticlesByCategoryAndBrand,
  getArticlesByRoom,
  isHubIndexable,
} from "@/lib/content/queries";

/**
 * The set of site-relative paths that are actually eligible for public
 * discovery — the same paths app/sitemap.ts lists. IndexNow submissions use
 * this to reject URLs that don't belong in the sitemap (draft articles,
 * taxonomy hubs below `HUB_INDEX_THRESHOLD`, `/search`, typos) rather than
 * duplicating that filtering logic by hand.
 *
 * This mirrors app/sitemap.ts's own filters intentionally rather than
 * sitemap.ts importing from here — sitemap.ts additionally needs per-section
 * priority/changeFrequency metadata that has nothing to do with IndexNow, so
 * keeping them separate avoids coupling the sitemap's ranking hints to the
 * IndexNow allow-list. Both read from the same taxonomy config and the same
 * `isHubIndexable()` threshold, so the two lists can't drift on *which*
 * hubs are indexable — only sitemap.ts should change if a new *static* page
 * is added to the site (update STATIC_PATHS below to match).
 */
const STATIC_PATHS = [
  "/",
  "/about",
  "/contact",
  "/editorial-policy",
  "/privacy-policy",
  "/terms-of-use",
  "/cookie-policy",
  "/disclaimer",
  "/calculators",
];

export function getPublicUrlPaths(): string[] {
  const staticPaths = [...STATIC_PATHS];

  const categoryPaths = categories.map((c) => c.href);

  const subcategoryPaths = allSubcategories
    .filter((s) => s.category === "appliances")
    .filter((s) => isHubIndexable(getArticlesBySubcategory("appliances", s.slug).length))
    .map((s) => `/appliances/${s.slug}`);

  const brandPaths = brands
    .filter((b) => isHubIndexable(getArticlesByCategoryAndBrand("error-codes", b.slug).length))
    .map((b) => `/error-codes/${b.slug}`);

  const roomPaths = rooms
    .filter((r) => isHubIndexable(getArticlesByRoom(r.slug).length))
    .map((r) => `/rooms/${r.slug}`);

  const calculatorPaths = calculators.map((c) => `/calculators/${c.slug}`);

  // getAllArticles() already excludes draft:true articles — see
  // lib/content/loader.ts.
  const articlePaths = getAllArticles().map((a) => a.href);

  return [
    ...staticPaths,
    ...categoryPaths,
    ...subcategoryPaths,
    ...brandPaths,
    ...roomPaths,
    ...calculatorPaths,
    ...articlePaths,
  ];
}

let cachedPathSet: Set<string> | null = null;

/** Same data as getPublicUrlPaths(), memoized as a Set for O(1) lookups. */
export function getPublicUrlPathSet(): Set<string> {
  if (!cachedPathSet) {
    cachedPathSet = new Set(getPublicUrlPaths());
  }
  return cachedPathSet;
}
