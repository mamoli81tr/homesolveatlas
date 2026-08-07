import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo/metadata";
import { getCategory, heatingCoolingTypes } from "@/config/taxonomy";
import { getArticlesByCategory, filterArticles } from "@/lib/content/queries";
import { ArticleListPage, paginate } from "@/components/articles/ArticleListPage";
import { FilterForm } from "@/components/search/FilterForm";

const category = getCategory("heating-cooling")!;

export const metadata: Metadata = buildMetadata({
  title: category.label,
  description: category.description,
  path: "/heating-cooling",
});

export default async function HeatingCoolingPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | undefined>>;
}) {
  const sp = await searchParams;
  const all = getArticlesByCategory("heating-cooling");
  const filtered = filterArticles(all, { subcategory: sp.subcategory });
  const { pageItems, totalPages, currentPage, totalCount } = paginate(
    filtered,
    Number(sp.page) || 1,
  );

  return (
    <ArticleListPage
      title={category.label}
      description={category.description}
      breadcrumbs={[{ label: category.label, href: "/heating-cooling" }]}
      articles={pageItems}
      totalCount={totalCount}
      currentPage={currentPage}
      totalPages={totalPages}
      basePath="/heating-cooling"
      searchParams={sp}
      filters={
        <FilterForm
          action="/heating-cooling"
          values={sp}
          fields={[
            {
              name: "subcategory",
              label: "Type",
              options: heatingCoolingTypes.map((t) => ({
                value: t.slug,
                label: t.label,
              })),
            },
          ]}
        />
      }
    />
  );
}
