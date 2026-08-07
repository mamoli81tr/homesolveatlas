import { SearchX } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { ArticleCard } from "@/components/articles/ArticleCard";
import { Pagination } from "@/components/layout/Pagination";
import { AdSlot } from "@/components/ads/AdSlot";
import type { Article } from "@/lib/content/schema";
import type { Crumb } from "@/lib/seo/schema";

export const PAGE_SIZE = 12;

export function paginate<T>(items: T[], page: number, pageSize = PAGE_SIZE) {
  const totalPages = Math.max(Math.ceil(items.length / pageSize), 1);
  const safePage = Math.min(Math.max(page, 1), totalPages);
  const start = (safePage - 1) * pageSize;
  return {
    pageItems: items.slice(start, start + pageSize),
    totalPages,
    currentPage: safePage,
    totalCount: items.length,
  };
}

export function ArticleListPage({
  title,
  description,
  breadcrumbs,
  articles,
  totalCount,
  currentPage,
  totalPages,
  basePath,
  searchParams,
  filters,
  emptyMessage,
}: {
  title: string;
  description: string;
  breadcrumbs: Crumb[];
  articles: Article[];
  totalCount: number;
  currentPage: number;
  totalPages: number;
  basePath: string;
  searchParams?: Record<string, string | undefined>;
  filters?: React.ReactNode;
  emptyMessage?: string;
}) {
  return (
    <Container className="py-8">
      <Breadcrumbs items={breadcrumbs} />

      <header className="mt-4 max-w-3xl">
        <h1 className="text-ink-950 text-3xl leading-tight font-extrabold sm:text-4xl">
          {title}
        </h1>
        <p className="text-ink-500 mt-3 text-base leading-relaxed">{description}</p>
      </header>

      <AdSlot placement="header-banner" className="my-8" />

      {filters}

      <p className="text-ink-500 mb-4 text-sm">
        {totalCount} {totalCount === 1 ? "guide" : "guides"}
      </p>

      {articles.length > 0 ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {articles.map((article) => (
            <ArticleCard key={article.href} article={article} />
          ))}
        </div>
      ) : (
        <div className="border-ink-300 flex flex-col items-center gap-3 rounded-2xl border border-dashed bg-white py-16 text-center">
          <SearchX className="text-ink-300 h-8 w-8" aria-hidden="true" />
          <p className="text-ink-500 max-w-sm text-sm">
            {emptyMessage ??
              "We don't have any guides here yet — check back soon, or browse another category."}
          </p>
        </div>
      )}

      <Pagination
        basePath={basePath}
        currentPage={currentPage}
        totalPages={totalPages}
        searchParams={searchParams}
      />
    </Container>
  );
}
