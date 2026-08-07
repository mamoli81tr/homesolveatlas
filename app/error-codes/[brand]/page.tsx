import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { buildMetadata } from "@/lib/seo/metadata";
import { brands, getBrand } from "@/config/taxonomy";
import {
  getArticlesByCategoryAndBrand,
  filterArticles,
  isHubIndexable,
} from "@/lib/content/queries";
import { ArticleListPage, paginate } from "@/components/articles/ArticleListPage";
import { FilterForm } from "@/components/search/FilterForm";

export function generateStaticParams() {
  return brands.map((brand) => ({ brand: brand.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ brand: string }>;
}): Promise<Metadata> {
  const { brand: brandSlug } = await params;
  const brand = getBrand(brandSlug);
  if (!brand) return {};
  const count = getArticlesByCategoryAndBrand("error-codes", brandSlug).length;
  return buildMetadata({
    title: `${brand.label} Error Codes`,
    description: `Look up what ${brand.label} appliance error codes mean and what to check before calling for service.`,
    path: `/error-codes/${brandSlug}`,
    noindex: !isHubIndexable(count),
  });
}

export default async function ErrorCodeBrandPage({
  params,
  searchParams,
}: {
  params: Promise<{ brand: string }>;
  searchParams: Promise<Record<string, string | undefined>>;
}) {
  const { brand: brandSlug } = await params;
  const brand = getBrand(brandSlug);
  if (!brand) notFound();

  const sp = await searchParams;
  const all = getArticlesByCategoryAndBrand("error-codes", brandSlug);
  const filtered = filterArticles(all, { appliance: sp.appliance });
  const { pageItems, totalPages, currentPage, totalCount } = paginate(
    filtered,
    Number(sp.page) || 1,
  );

  const availableAppliances = Array.from(
    new Set(all.map((a) => a.frontmatter.appliance).filter(Boolean)),
  ) as string[];

  return (
    <ArticleListPage
      title={`${brand.label} Error Codes`}
      description={`Look up what ${brand.label} appliance error codes mean and what to safely check before calling for service.`}
      breadcrumbs={[
        { label: "Error Codes", href: "/error-codes" },
        { label: brand.label, href: `/error-codes/${brandSlug}` },
      ]}
      articles={pageItems}
      totalCount={totalCount}
      currentPage={currentPage}
      totalPages={totalPages}
      basePath={`/error-codes/${brandSlug}`}
      searchParams={sp}
      emptyMessage={`We don't have any ${brand.label} error code guides yet — check back soon, or browse another brand.`}
      filters={
        availableAppliances.length > 0 ? (
          <FilterForm
            action={`/error-codes/${brandSlug}`}
            values={sp}
            fields={[
              {
                name: "appliance",
                label: "Appliance",
                options: availableAppliances.map((appliance) => ({
                  value: appliance,
                  label: appliance,
                })),
              },
            ]}
          />
        ) : undefined
      }
    />
  );
}
