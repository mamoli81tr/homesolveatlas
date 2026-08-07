import Link from "next/link";
import type { Metadata } from "next";
import { WashingMachine, ArrowRight } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Card } from "@/components/ui/Card";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { AdSlot } from "@/components/ads/AdSlot";
import { buildMetadata } from "@/lib/seo/metadata";
import { getCategory, applianceTypes } from "@/config/taxonomy";
import { getArticlesBySubcategory } from "@/lib/content/queries";

const category = getCategory("appliances")!;

export const metadata: Metadata = buildMetadata({
  title: category.label,
  description: category.description,
  path: "/appliances",
});

export default function AppliancesPage() {
  return (
    <Container className="py-8">
      <Breadcrumbs items={[{ label: category.label, href: "/appliances" }]} />

      <header className="mt-4 max-w-2xl">
        <span className="mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-emerald-500 text-white">
          <WashingMachine className="h-5 w-5" aria-hidden="true" />
        </span>
        <h1 className="text-ink-950 text-3xl leading-tight font-extrabold sm:text-4xl">
          {category.label}
        </h1>
        <p className="text-ink-500 mt-3 text-base leading-relaxed">
          {category.description}
        </p>
      </header>

      <AdSlot placement="header-banner" className="my-8" />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {applianceTypes.map((type) => {
          const count = getArticlesBySubcategory("appliances", type.slug).length;
          return (
            <Card key={type.slug} className="p-5">
              <h2 className="text-ink-950 mb-1 text-base font-semibold">
                <Link href={`/appliances/${type.slug}`} className="hover:text-blue-700">
                  {type.label}
                </Link>
              </h2>
              <p className="text-ink-500 mb-3 text-sm leading-relaxed">
                {type.description}
              </p>
              <div className="text-ink-500 flex items-center justify-between text-xs">
                <span>
                  {count} {count === 1 ? "guide" : "guides"}
                </span>
                <Link
                  href={`/appliances/${type.slug}`}
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
