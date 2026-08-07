import Link from "next/link";
import type { Metadata } from "next";
import {
  WashingMachine,
  AlertOctagon,
  Sparkles,
  Wrench,
  Thermometer,
  Calculator,
  ArrowRight,
  ChefHat,
  Bath,
  BedDouble,
  Sofa,
  Shirt,
  Warehouse,
  Car,
  Trees,
} from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Card } from "@/components/ui/Card";
import { SearchBox } from "@/components/search/SearchBox";
import { ArticleCard } from "@/components/articles/ArticleCard";
import { ArticleThumb } from "@/components/media/ArticleThumb";
import { AdSlot } from "@/components/ads/AdSlot";
import { buildMetadata } from "@/lib/seo/metadata";
import { siteConfig } from "@/config/site";
import { categories, rooms, brands, applianceTypes } from "@/config/taxonomy";
import { calculators } from "@/config/calculators";
import {
  getFeaturedArticles,
  getLatestArticles,
  getArticleByHref,
  getArticlesBySubcategory,
} from "@/lib/content/queries";

export const metadata: Metadata = buildMetadata({
  title: `${siteConfig.name} — ${siteConfig.tagline}`,
  description: siteConfig.description,
  path: "/",
});

const categoryIcons = {
  appliances: WashingMachine,
  "error-codes": AlertOctagon,
  cleaning: Sparkles,
  maintenance: Wrench,
  "heating-cooling": Thermometer,
} as const;

const roomIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  kitchen: ChefHat,
  bathroom: Bath,
  bedroom: BedDouble,
  "living-room": Sofa,
  "laundry-room": Shirt,
  basement: Warehouse,
  garage: Car,
  garden: Trees,
};

const seasonalHrefs = [
  "/maintenance/how-to-prepare-your-home-for-winter",
  "/maintenance/why-is-my-bedroom-so-humid",
  "/heating-cooling/what-size-air-conditioner-do-i-need",
];

export default function HomePage() {
  const featured = getFeaturedArticles(6);
  const latest = getLatestArticles(6);
  const seasonal = seasonalHrefs.map((href) => getArticleByHref(href)).filter(Boolean);
  const popularCalculators = calculators.slice(0, 4);
  const applianceCounts = applianceTypes.map((type) => ({
    type,
    count: getArticlesBySubcategory("appliances", type.slug).length,
  }));

  return (
    <>
      {/* Hero — states what the site does and gets visitors searching immediately */}
      <section className="border-ink-100 border-b bg-gradient-to-b from-blue-50/60 to-white">
        <Container className="py-14 sm:py-20">
          <div className="mx-auto max-w-2xl text-center">
            <h1 className="text-ink-950 text-4xl leading-tight font-extrabold sm:text-5xl">
              Practical solutions for{" "}
              <span className="bg-gradient-to-r from-blue-600 to-emerald-500 bg-clip-text text-transparent">
                everyday home problems
              </span>
              .
            </h1>
            <p className="text-ink-500 mx-auto mt-4 max-w-xl text-lg leading-relaxed">
              Look up an appliance error code, fix a stubborn stain, or figure out
              what&apos;s wrong with your washer, fridge, or AC — clear, safety-first
              guides you can actually follow.
            </p>
            <div className="mx-auto mt-8 max-w-xl">
              <SearchBox size="lg" />
            </div>
          </div>
        </Container>
      </section>

      <Container className="py-14">
        {/* Popular categories — orients a first-time visitor to what's here */}
        <section aria-labelledby="categories-heading" className="mb-16">
          <h2 id="categories-heading" className="text-ink-950 mb-6 text-2xl font-bold">
            Popular problem categories
          </h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {categories.map((category) => {
              const Icon = categoryIcons[category.slug];
              return (
                <Card key={category.slug} className="p-5">
                  <span className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-emerald-500 text-white">
                    <Icon className="h-5 w-5" aria-hidden="true" />
                  </span>
                  <h3 className="text-ink-950 mb-1 text-sm font-semibold">
                    <Link href={category.href} className="hover:text-blue-700">
                      {category.label}
                    </Link>
                  </h3>
                  <p className="text-ink-500 text-xs leading-relaxed">
                    {category.description}
                  </p>
                </Card>
              );
            })}
          </div>
        </section>

        {/* Most common home problems */}
        {featured.length > 0 && (
          <section aria-labelledby="featured-heading" className="mb-16">
            <div className="mb-6 flex items-center justify-between">
              <h2 id="featured-heading" className="text-ink-950 text-2xl font-bold">
                Most common home problems
              </h2>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {featured.map((article) => (
                <ArticleCard key={article.href} article={article} />
              ))}
            </div>
          </section>
        )}

        <AdSlot placement="header-banner" className="mb-16" />

        {/* Browse by appliance — the most common entry point for a broken-appliance search */}
        <section aria-labelledby="appliance-heading" className="mb-16">
          <div className="mb-6 flex items-center justify-between">
            <h2 id="appliance-heading" className="text-ink-950 text-2xl font-bold">
              Browse by appliance
            </h2>
            <Link
              href="/appliances"
              className="flex items-center gap-1 text-sm font-medium text-blue-700 hover:underline"
            >
              View all
              <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
            {applianceCounts.map(({ type, count }) => (
              <Link
                key={type.slug}
                href={`/appliances/${type.slug}`}
                className="border-ink-100 flex flex-col items-center gap-2 rounded-2xl border bg-white p-4 text-center transition-shadow hover:shadow-md"
              >
                <ArticleThumb
                  category="appliances"
                  subcategory={type.slug}
                  className="h-14 w-14 rounded-xl"
                  iconClassName="h-6 w-6"
                />
                <span className="text-ink-950 text-sm font-semibold">{type.label}</span>
                <span className="text-ink-500 text-xs">
                  {count} {count === 1 ? "guide" : "guides"}
                </span>
              </Link>
            ))}
          </div>
        </section>

        {/* Useful home calculators */}
        <section aria-labelledby="calculators-heading" className="mb-16">
          <div className="mb-6 flex items-center justify-between">
            <h2 id="calculators-heading" className="text-ink-950 text-2xl font-bold">
              Useful home calculators
            </h2>
            <Link
              href="/calculators"
              className="flex items-center gap-1 text-sm font-medium text-blue-700 hover:underline"
            >
              View all
              <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
            </Link>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {popularCalculators.map((calc) => (
              <Card key={calc.slug} className="p-5">
                <span className="bg-ink-100 text-ink-700 mb-3 flex h-10 w-10 items-center justify-center rounded-xl">
                  <Calculator className="h-5 w-5" aria-hidden="true" />
                </span>
                <h3 className="text-ink-950 mb-1 text-sm font-semibold">
                  <Link
                    href={`/calculators/${calc.slug}`}
                    className="hover:text-blue-700"
                  >
                    {calc.shortTitle}
                  </Link>
                </h3>
                <p className="text-ink-500 text-xs leading-relaxed">{calc.description}</p>
              </Card>
            ))}
          </div>
        </section>

        {/* Recently updated guides */}
        {latest.length > 0 && (
          <section aria-labelledby="latest-heading" className="mb-16">
            <h2 id="latest-heading" className="text-ink-950 mb-6 text-2xl font-bold">
              Recently updated guides
            </h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {latest.map((article) => (
                <ArticleCard key={article.href} article={article} />
              ))}
            </div>
          </section>
        )}

        {/* Browse by room */}
        <section
          id="browse-by-room"
          aria-labelledby="rooms-heading"
          className="mb-16 scroll-mt-24"
        >
          <h2 id="rooms-heading" className="text-ink-950 mb-6 text-2xl font-bold">
            Browse by room
          </h2>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            {rooms.map((room) => {
              const Icon = roomIcons[room.slug] ?? Wrench;
              return (
                <Link
                  key={room.slug}
                  href={`/rooms/${room.slug}`}
                  className="border-ink-100 flex flex-col items-center gap-2 rounded-2xl border bg-white p-5 text-center transition-shadow hover:shadow-md"
                >
                  <span className="bg-ink-100 text-ink-700 flex h-11 w-11 items-center justify-center rounded-xl">
                    <Icon className="h-5 w-5" aria-hidden="true" />
                  </span>
                  <span className="text-ink-950 text-sm font-semibold">{room.label}</span>
                </Link>
              );
            })}
          </div>
        </section>

        {/* Seasonal */}
        {seasonal.length > 0 && (
          <section aria-labelledby="seasonal-heading" className="mb-16">
            <h2 id="seasonal-heading" className="text-ink-950 mb-6 text-2xl font-bold">
              Seasonal home problems
            </h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {seasonal.map(
                (article) =>
                  article && <ArticleCard key={article.href} article={article} />,
              )}
            </div>
          </section>
        )}

        {/* Appliance brands */}
        <section aria-labelledby="brands-heading">
          <h2 id="brands-heading" className="text-ink-950 mb-6 text-2xl font-bold">
            Error codes by brand
          </h2>
          <div className="flex flex-wrap gap-2">
            {brands.map((brand) => (
              <Link
                key={brand.slug}
                href={`/error-codes/${brand.slug}`}
                className="border-ink-300 text-ink-700 rounded-full border bg-white px-4 py-2 text-sm font-medium hover:border-blue-300 hover:text-blue-700"
              >
                {brand.label}
              </Link>
            ))}
          </div>
        </section>
      </Container>
    </>
  );
}
