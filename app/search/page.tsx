import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { SearchBox } from "@/components/search/SearchBox";
import { ArticleCard } from "@/components/articles/ArticleCard";
import { AdSlot } from "@/components/ads/AdSlot";
import { buildMetadata } from "@/lib/seo/metadata";
import { searchArticles, getFeaturedArticles } from "@/lib/content/queries";
import { categories } from "@/config/taxonomy";

/** A few guaranteed-to-match starting points, drawn from real featured content. */
function popularSearchTerms(): string[] {
  const terms = new Set<string>();
  for (const article of getFeaturedArticles()) {
    const term = article.frontmatter.keywords[0] ?? article.frontmatter.appliance;
    if (term) terms.add(term);
    if (terms.size >= 6) break;
  }
  return Array.from(terms);
}

export const metadata: Metadata = buildMetadata({
  title: "Search",
  description:
    "Search HomeSolveAtlas for appliance error codes, symptoms, stain-removal guides, and more.",
  path: "/search",
  noindex: true,
});

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q = "" } = await searchParams;
  const results = q ? searchArticles(q) : [];
  const popularTerms = popularSearchTerms();

  return (
    <Container className="py-8">
      <Breadcrumbs items={[{ label: "Search", href: "/search" }]} />

      <header className="mt-4 max-w-2xl">
        <h1 className="text-ink-950 text-3xl leading-tight font-extrabold sm:text-4xl">
          Search
        </h1>
        <div className="mt-4">
          <SearchBox defaultValue={q} size="lg" />
        </div>
      </header>

      <AdSlot placement="header-banner" className="my-8" />

      {q ? (
        <>
          <h2 className="text-ink-500 mb-4 text-sm font-normal">
            {results.length} {results.length === 1 ? "result" : "results"} for &ldquo;{q}
            &rdquo;
          </h2>

          {results.length > 0 ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {results.map(({ article }) => (
                <ArticleCard key={article.href} article={article} />
              ))}
            </div>
          ) : (
            <div className="border-ink-300 rounded-2xl border border-dashed bg-white p-8 text-center">
              <p className="text-ink-500 mb-4 text-sm">
                No guides matched &ldquo;{q}&rdquo;. Try a different term, or browse a
                category below.
              </p>
              <div className="flex flex-wrap justify-center gap-2">
                {categories.map((c) => (
                  <Link
                    key={c.slug}
                    href={c.href}
                    className="border-ink-300 text-ink-700 hover:bg-ink-100 rounded-full border px-3.5 py-1.5 text-sm font-medium"
                  >
                    {c.shortLabel}
                  </Link>
                ))}
              </div>
            </div>
          )}
        </>
      ) : (
        <div className="border-ink-300 rounded-2xl border border-dashed bg-white p-8 text-center">
          <p className="text-ink-500 mb-4 text-sm">
            Try searching for an appliance, a brand, an error code like &ldquo;4C&rdquo;, or
            a problem like &ldquo;musty smell&rdquo;.
          </p>
          {popularTerms.length > 0 && (
            <div className="flex flex-wrap justify-center gap-2">
              {popularTerms.map((term) => (
                <Link
                  key={term}
                  href={`/search?q=${encodeURIComponent(term)}`}
                  className="border-ink-300 text-ink-700 hover:bg-ink-100 rounded-full border px-3.5 py-1.5 text-sm font-medium"
                >
                  {term}
                </Link>
              ))}
            </div>
          )}
        </div>
      )}
    </Container>
  );
}
