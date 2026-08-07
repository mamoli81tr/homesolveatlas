import { getAllArticles } from "./loader";
import type { Article, CategorySlug } from "./schema";

export { getAllArticles } from "./loader";

export function getArticleByHref(href: string): Article | undefined {
  return getAllArticles().find((a) => a.href === href);
}

export function getArticlesByCategory(category: CategorySlug): Article[] {
  return getAllArticles().filter((a) => a.frontmatter.category === category);
}

export function getArticlesBySubcategory(
  category: CategorySlug,
  subcategory: string,
): Article[] {
  return getAllArticles().filter(
    (a) =>
      a.frontmatter.category === category && a.frontmatter.subcategory === subcategory,
  );
}

export function getArticlesByBrand(brand: string): Article[] {
  return getAllArticles().filter((a) => a.frontmatter.brand === brand);
}

export function getArticlesByCategoryAndBrand(
  category: CategorySlug,
  brand: string,
): Article[] {
  return getAllArticles().filter(
    (a) => a.frontmatter.category === category && a.frontmatter.brand === brand,
  );
}

export function getArticlesByRoom(room: string): Article[] {
  return getAllArticles().filter((a) => a.frontmatter.room.includes(room));
}

export function getFeaturedArticles(limit?: number): Article[] {
  const featured = getAllArticles().filter((a) => a.frontmatter.featured);
  return typeof limit === "number" ? featured.slice(0, limit) : featured;
}

export function getLatestArticles(limit = 6): Article[] {
  return getAllArticles().slice(0, limit);
}

/**
 * Minimum number of articles a taxonomy hub (appliance subcategory, brand,
 * or room) needs before it's treated as a real search-landing page. Below
 * this, the hub still renders (with a friendly empty/thin state) but is
 * marked `noindex` and excluded from the sitemap — a single article isn't
 * enough to justify a dedicated ranking page distinct from the article
 * itself. Raise this as the content library grows.
 */
export const HUB_INDEX_THRESHOLD = 2;

export function isHubIndexable(articleCount: number): boolean {
  return articleCount >= HUB_INDEX_THRESHOLD;
}

export interface ArticleFilters {
  appliance?: string;
  brand?: string;
  room?: string;
  subcategory?: string;
  difficulty?: string;
  safetyLevel?: string;
}

export function filterArticles(articles: Article[], filters: ArticleFilters): Article[] {
  return articles.filter((a) => {
    const fm = a.frontmatter;
    if (filters.appliance && fm.appliance !== filters.appliance) return false;
    if (filters.brand && fm.brand !== filters.brand) return false;
    if (filters.room && !fm.room.includes(filters.room)) return false;
    if (filters.subcategory && fm.subcategory !== filters.subcategory) return false;
    if (filters.difficulty && fm.difficulty !== filters.difficulty) return false;
    if (filters.safetyLevel && fm.safetyLevel !== filters.safetyLevel) return false;
    return true;
  });
}

const RELATED_LIMIT = 4;

/**
 * Related-article selection.
 *
 * 1. Explicit `relatedArticles` hrefs from frontmatter always win, in order.
 * 2. Remaining slots are filled by a signal-based score: same error-code
 *    family > same brand > same appliance > same category+subcategory >
 *    shared room > same category.
 */
export function getRelatedArticles(article: Article, limit = RELATED_LIMIT): Article[] {
  const all = getAllArticles().filter((a) => a.href !== article.href);
  const fm = article.frontmatter;

  const explicit = fm.relatedArticles
    .map((href) => all.find((a) => a.href === href))
    .filter((a): a is Article => Boolean(a));

  const explicitHrefs = new Set(explicit.map((a) => a.href));
  const remaining = all.filter((a) => !explicitHrefs.has(a.href));

  function score(candidate: Article): number {
    const c = candidate.frontmatter;
    let s = 0;
    if (fm.errorCode && c.errorCode && sameErrorFamily(fm.errorCode, c.errorCode)) s += 5;
    if (fm.brand && c.brand === fm.brand) s += 4;
    if (fm.appliance && c.appliance === fm.appliance) s += 4;
    if (fm.category === c.category && fm.subcategory && c.subcategory === fm.subcategory)
      s += 3;
    if (fm.room.some((r) => c.room.includes(r))) s += 2;
    if (fm.category === c.category) s += 1;
    return s;
  }

  const ranked = remaining
    .map((a) => ({ a, s: score(a) }))
    .filter(({ s }) => s > 0)
    .sort((x, y) => y.s - x.s)
    .map(({ a }) => a);

  return [...explicit, ...ranked].slice(0, limit);
}

function sameErrorFamily(a: string, b: string): boolean {
  const normalize = (code: string) => code.replace(/[^A-Za-z0-9]/g, "").toUpperCase();
  return normalize(a) === normalize(b);
}

export interface SearchResult {
  article: Article;
  score: number;
}

/**
 * Relevance-ranked search over title, description, symptoms, quick answer,
 * category, brand, appliance, error code, and keywords. No external index
 * needed at this content scale — swap for a hosted search service if the
 * catalog grows into the thousands of pages.
 *
 * Scoring layers, highest-impact first:
 *  1. Exact title match
 *  2. Full query phrase found in the title (e.g. "not draining")
 *  3. Exact error-code match (e.g. "4C")
 *  4. Per-term weighted field matches (title > error code > brand > body fields)
 */
export function searchArticles(query: string, limit = 20): SearchResult[] {
  const q = query.trim().toLowerCase();
  if (!q.length) return [];
  const terms = q.split(/\s+/).filter(Boolean);

  const results = getAllArticles().map((article) => {
    const fm = article.frontmatter;
    const titleLower = fm.title.toLowerCase();
    const errorCodeLower = (fm.errorCode ?? "").toLowerCase();

    const haystacks: Array<[string, number]> = [
      [titleLower, 5],
      [fm.description.toLowerCase(), 2],
      [fm.quickAnswer.toLowerCase(), 2],
      [fm.symptoms.join(" ").toLowerCase(), 2],
      [fm.category.toLowerCase(), 2],
      [(fm.subcategory ?? "").toLowerCase(), 2],
      [(fm.brand ?? "").toLowerCase(), 3],
      [(fm.appliance ?? "").toLowerCase(), 2],
      [errorCodeLower, 4],
      [fm.keywords.join(" ").toLowerCase(), 2],
    ];

    let score = 0;
    for (const term of terms) {
      for (const [haystack, weight] of haystacks) {
        if (haystack && haystack.includes(term)) score += weight;
      }
    }

    if (titleLower === q) score += 20;
    else if (titleLower.includes(q)) score += 8;
    if (errorCodeLower && errorCodeLower === q) score += 15;

    return { article, score };
  });

  return results
    .filter((r) => r.score > 0)
    .sort((a, b) => b.score - a.score || a.article.frontmatter.title.localeCompare(b.article.frontmatter.title))
    .slice(0, limit);
}
