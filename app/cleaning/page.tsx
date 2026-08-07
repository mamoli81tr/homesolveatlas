import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo/metadata";
import { getCategory, cleaningTypes } from "@/config/taxonomy";
import { getArticlesByCategory, filterArticles } from "@/lib/content/queries";
import { ArticleListPage, paginate } from "@/components/articles/ArticleListPage";
import { FilterForm } from "@/components/search/FilterForm";

const category = getCategory("cleaning")!;

export const metadata: Metadata = buildMetadata({
  title: category.label,
  description: category.description,
  path: "/cleaning",
});

export default async function CleaningPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | undefined>>;
}) {
  const sp = await searchParams;
  const all = getArticlesByCategory("cleaning");
  const filtered = filterArticles(all, {
    subcategory: sp.subcategory,
    difficulty: sp.difficulty,
  });
  const { pageItems, totalPages, currentPage, totalCount } = paginate(
    filtered,
    Number(sp.page) || 1,
  );

  return (
    <ArticleListPage
      title={category.label}
      description={category.description}
      breadcrumbs={[{ label: category.label, href: "/cleaning" }]}
      articles={pageItems}
      totalCount={totalCount}
      currentPage={currentPage}
      totalPages={totalPages}
      basePath="/cleaning"
      searchParams={sp}
      filters={
        <FilterForm
          action="/cleaning"
          values={sp}
          fields={[
            {
              name: "subcategory",
              label: "Type",
              options: cleaningTypes.map((t) => ({ value: t.slug, label: t.label })),
            },
            {
              name: "difficulty",
              label: "Difficulty",
              options: [
                { value: "easy", label: "Easy" },
                { value: "moderate", label: "Moderate" },
                { value: "advanced", label: "Advanced" },
              ],
            },
          ]}
        />
      }
    />
  );
}
