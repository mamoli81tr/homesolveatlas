import Link from "next/link";
import type { Metadata } from "next";
import { Calculator, ArrowRight } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Card } from "@/components/ui/Card";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { AdSlot } from "@/components/ads/AdSlot";
import { buildMetadata } from "@/lib/seo/metadata";
import { calculators } from "@/config/calculators";

export const metadata: Metadata = buildMetadata({
  title: "Home Calculators",
  description:
    "Free browser-based calculators for paint, flooring, tiling, concrete, electricity cost, and AC sizing — no sign-up, nothing sent to a server.",
  path: "/calculators",
});

export default function CalculatorsPage() {
  return (
    <Container className="py-8">
      <Breadcrumbs items={[{ label: "Calculators", href: "/calculators" }]} />

      <header className="mt-4 max-w-2xl">
        <span className="mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-emerald-500 text-white">
          <Calculator className="h-5 w-5" aria-hidden="true" />
        </span>
        <h1 className="text-ink-950 text-3xl leading-tight font-extrabold sm:text-4xl">
          Home Calculators
        </h1>
        <p className="text-ink-500 mt-3 text-base leading-relaxed">
          Plan your next project with free calculators that run entirely in your browser.
          Nothing you type is ever sent to a server.
        </p>
      </header>

      <AdSlot placement="header-banner" className="my-8" />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {calculators.map((calc) => (
          <Card key={calc.slug} className="flex flex-col p-5">
            <h2 className="text-ink-950 mb-1 text-base font-semibold">
              <Link href={`/calculators/${calc.slug}`} className="hover:text-blue-700">
                {calc.title}
              </Link>
            </h2>
            <p className="text-ink-500 mb-4 flex-1 text-sm leading-relaxed">
              {calc.description}
            </p>
            <Link
              href={`/calculators/${calc.slug}`}
              className="flex items-center gap-1 text-sm font-medium text-blue-700 hover:underline"
            >
              Open calculator
              <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
            </Link>
          </Card>
        ))}
      </div>
    </Container>
  );
}
