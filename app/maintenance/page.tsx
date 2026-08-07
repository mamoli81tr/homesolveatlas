import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo/metadata";
import { getCategory, maintenanceTypes } from "@/config/taxonomy";
import { getArticlesByCategory, filterArticles } from "@/lib/content/queries";
import { ArticleListPage, paginate } from "@/components/articles/ArticleListPage";
import { FilterForm } from "@/components/search/FilterForm";

const category = getCategory("maintenance")!;

export const metadata: Metadata = buildMetadata({
  title: category.label,
  description: category.description,
  path: "/maintenance",
});

export default async function MaintenancePage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | undefined>>;
}) {
  const sp = await searchParams;
  const all = getArticlesByCategory("maintenance");
  const filtered = filterArticles(all, {
    subcategory: sp.subcategory,
    safetyLevel: sp.safetyLevel,
  });
  const { pageItems, totalPages, currentPage, totalCount } = paginate(
    filtered,
    Number(sp.page) || 1,
  );

  return (
    <ArticleListPage
      title={category.label}
      description={category.description}
      breadcrumbs={[{ label: category.label, href: "/maintenance" }]}
      articles={pageItems}
      totalCount={totalCount}
      currentPage={currentPage}
      totalPages={totalPages}
      basePath="/maintenance"
      searchParams={sp}
      filters={
        <FilterForm
          action="/maintenance"
          values={sp}
          fields={[
            {
              name: "subcategory",
              label: "Type",
              options: maintenanceTypes.map((t) => ({ value: t.slug, label: t.label })),
            },
            {
              name: "safetyLevel",
              label: "Safety level",
              options: [
                { value: "low", label: "Low" },
                { value: "medium", label: "Medium" },
                { value: "high", label: "High" },
              ],
            },
          ]}
        />
      }
    />
  );
}
