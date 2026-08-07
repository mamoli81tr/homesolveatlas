import type { Article } from "@/lib/content/schema";
import { ArticleCard } from "@/components/articles/ArticleCard";

export function RelatedArticles({ articles }: { articles: Article[] }) {
  if (!articles.length) return null;
  return (
    <section aria-labelledby="related-heading">
      <h2 id="related-heading" className="text-ink-950 mb-4 text-xl font-bold">
        Related guides
      </h2>
      <div className="grid gap-4 sm:grid-cols-2">
        {articles.map((article) => (
          <ArticleCard key={article.href} article={article} />
        ))}
      </div>
    </section>
  );
}
