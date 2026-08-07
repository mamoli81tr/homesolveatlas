import Link from "next/link";
import { Calculator, Ruler } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Card } from "@/components/ui/Card";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { AdSlot } from "@/components/ads/AdSlot";
import { FAQAccordion } from "@/components/articles/FAQAccordion";
import { JsonLd } from "@/components/seo/JsonLd";
import { softwareApplicationSchema, faqPageSchemaFromList } from "@/lib/seo/schema";

export interface CalculatorExample {
  label: string;
  result: string;
}

export interface CalculatorFaq {
  q: string;
  a: string;
}

export function CalculatorShell({
  title,
  description,
  path,
  howItWorks,
  unitInfo,
  examples = [],
  faqs = [],
  relatedGuides,
  children,
}: {
  title: string;
  description: string;
  path: string;
  howItWorks: string;
  /** One or two sentences on the units accepted/returned (imperial vs metric). */
  unitInfo?: string;
  /** A couple of worked "if you enter X, you get Y" examples — helps both users and SEO. */
  examples?: CalculatorExample[];
  faqs?: CalculatorFaq[];
  relatedGuides: { label: string; href: string }[];
  children: React.ReactNode;
}) {
  return (
    <>
      <JsonLd data={softwareApplicationSchema({ name: title, description, path })} />
      <JsonLd data={faqPageSchemaFromList(faqs)} />
      <Container className="py-8">
        <Breadcrumbs
          items={[
            { label: "Calculators", href: "/calculators" },
            { label: title, href: path },
          ]}
        />

        <header className="mt-4 max-w-2xl">
          <span className="mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-emerald-500 text-white">
            <Calculator className="h-5 w-5" aria-hidden="true" />
          </span>
          <h1 className="text-ink-950 text-3xl leading-tight font-extrabold sm:text-4xl">
            {title}
          </h1>
          <p className="text-ink-500 mt-3 text-base leading-relaxed">{description}</p>
        </header>

        {/* The tool itself, right up top — no scrolling past marketing copy to use it. */}
        <div className="mt-6">{children}</div>

        <AdSlot placement="in-article-top" className="my-8" />

        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_280px]">
          <div className="space-y-8">
            <Card className="p-6">
              <h2 className="text-ink-950 mb-2 text-lg font-bold">
                How this calculator works
              </h2>
              <p className="text-ink-700 text-sm leading-relaxed">{howItWorks}</p>
              {unitInfo && (
                <p className="text-ink-700 mt-3 flex items-start gap-2 text-sm leading-relaxed">
                  <Ruler className="mt-0.5 h-4 w-4 flex-none text-blue-600" aria-hidden="true" />
                  <span>{unitInfo}</span>
                </p>
              )}
              <p className="text-ink-500 mt-3 text-xs">
                All calculations run in your browser only — nothing you type is sent to a
                server. Results are estimates for planning purposes; always round up and buy
                a small surplus for cuts, waste, and future repairs.
              </p>
            </Card>

            {examples.length > 0 && (
              <Card className="p-6">
                <h2 className="text-ink-950 mb-3 text-lg font-bold">Example calculations</h2>
                <ul className="divide-ink-100 divide-y">
                  {examples.map((example) => (
                    <li key={example.label} className="py-3 first:pt-0 last:pb-0">
                      <p className="text-ink-900 text-sm font-semibold">{example.label}</p>
                      <p className="text-ink-500 mt-0.5 text-sm">{example.result}</p>
                    </li>
                  ))}
                </ul>
              </Card>
            )}

            {faqs.length > 0 && (
              <div>
                <h2 className="text-ink-950 mb-3 text-lg font-bold">
                  Frequently asked questions
                </h2>
                <FAQAccordion faqs={faqs} />
              </div>
            )}
          </div>

          {relatedGuides.length > 0 && (
            <aside>
              <Card className="p-6">
                <h2 className="text-ink-500 mb-3 text-sm font-semibold tracking-wide uppercase">
                  Related guides
                </h2>
                <ul className="space-y-2 text-sm">
                  {relatedGuides.map((guide) => (
                    <li key={guide.href}>
                      <Link href={guide.href} className="text-blue-700 underline underline-offset-2 hover:text-blue-800">
                        {guide.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </Card>
            </aside>
          )}
        </div>

        <AdSlot placement="article-end" className="mt-8" />
      </Container>
    </>
  );
}
