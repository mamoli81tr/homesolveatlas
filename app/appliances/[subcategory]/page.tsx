import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { buildMetadata } from "@/lib/seo/metadata";
import { applianceTypes, getSubcategory, brands } from "@/config/taxonomy";
import { getArticlesBySubcategory, filterArticles, isHubIndexable } from "@/lib/content/queries";
import { ArticleListPage, paginate } from "@/components/articles/ArticleListPage";
import { FilterForm } from "@/components/search/FilterForm";

export function generateStaticParams() {
  return applianceTypes.map((type) => ({ subcategory: type.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ subcategory: string }>;
}): Promise<Metadata> {
  const { subcategory } = await params;
  const type = getSubcategory("appliances", subcategory);
  if (!type) return {};
  const count = getArticlesBySubcategory("appliances", subcategory).length;
  return buildMetadata({
    title: `${type.label} Problems`,
    description: type.description,
    path: `/appliances/${subcategory}`,
    noindex: !isHubIndexable(count),
  });
}

export default async function ApplianceSubcategoryPage({
  params,
  searchParams,
}: {
  params: Promise<{ subcategory: string }>;
  searchParams: Promise<Record<string, string | undefined>>;
}) {
  const { subcategory } = await params;
  const type = getSubcategory("appliances", subcategory);
  if (!type) notFound();

  const sp = await searchParams;
  const all = getArticlesBySubcategory("appliances", subcategory);
  const filtered = filterArticles(all, { brand: sp.brand, difficulty: sp.difficulty });
  const { pageItems, totalPages, currentPage, totalCount } = paginate(
    filtered,
    Number(sp.page) || 1,
  );

  const availableBrands = Array.from(
    new Set(all.map((a) => a.frontmatter.brand).filter(Boolean)),
  ) as string[];

  return (
    <ArticleListPage
      title={`${type.label} Problems`}
      description={type.description}
      breadcrumbs={[
        { label: "Appliance Problems", href: "/appliances" },
        { label: type.label, href: `/appliances/${subcategory}` },
      ]}
      articles={pageItems}
      totalCount={totalCount}
      currentPage={currentPage}
      totalPages={totalPages}
      basePath={`/appliances/${subcategory}`}
      searchParams={sp}
      emptyMessage={`We don't have any ${type.label.toLowerCase()} guides yet — check back soon, or browse another appliance category.`}
      filters={
        availableBrands.length > 0 ? (
          <FilterForm
            action={`/appliances/${subcategory}`}
            values={sp}
            fields={[
              {
                name: "brand",
                label: "Brand",
                options: brands
                  .filter((b) => availableBrands.includes(b.slug))
                  .map((b) => ({ value: b.slug, label: b.label })),
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
        ) : undefined
      }
    />
  );
}
