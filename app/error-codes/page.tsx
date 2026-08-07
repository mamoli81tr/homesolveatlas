import Link from "next/link";
import type { Metadata } from "next";
import { AlertOctagon, ArrowRight } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Card } from "@/components/ui/Card";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { AdSlot } from "@/components/ads/AdSlot";
import { buildMetadata } from "@/lib/seo/metadata";
import { getCategory, brands } from "@/config/taxonomy";
import { getArticlesByCategoryAndBrand } from "@/lib/content/queries";

const category = getCategory("error-codes")!;

export const metadata: Metadata = buildMetadata({
  title: category.label,
  description: category.description,
  path: "/error-codes",
});

export default function ErrorCodesPage() {
  return (
    <Container className="py-8">
      <Breadcrumbs items={[{ label: category.label, href: "/error-codes" }]} />

      <header className="mt-4 max-w-2xl">
        <span className="mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-emerald-500 text-white">
          <AlertOctagon className="h-5 w-5" aria-hidden="true" />
        </span>
        <h1 className="text-ink-950 text-3xl leading-tight font-extrabold sm:text-4xl">
          {category.label}
        </h1>
        <p className="text-ink-500 mt-3 text-base leading-relaxed">
          {category.description}
        </p>
      </header>

      <AdSlot placement="header-banner" className="my-8" />

      <h2 className="text-ink-500 mb-4 text-sm font-semibold tracking-wide uppercase">
        Browse by brand
      </h2>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {brands.map((brand) => {
          const count = getArticlesByCategoryAndBrand("error-codes", brand.slug).length;
          return (
            <Card key={brand.slug} className="p-5">
              <h3 className="text-ink-950 mb-1 text-base font-semibold">
                <Link href={`/error-codes/${brand.slug}`} className="hover:text-blue-700">
                  {brand.label}
                </Link>
              </h3>
              <div className="text-ink-500 mt-3 flex items-center justify-between text-xs">
                <span>
                  {count} {count === 1 ? "guide" : "guides"}
                </span>
                <Link
                  href={`/error-codes/${brand.slug}`}
                  className="flex items-center gap-1 font-medium text-blue-700 hover:underline"
                >
                  Browse
                  <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                </Link>
              </div>
            </Card>
          );
        })}
      </div>
    </Container>
  );
}
