import Link from "next/link";
import {
  Clock,
  CalendarDays,
  CheckCircle2,
  XCircle,
  PhoneCall,
  AlertTriangle,
  ArrowRight,
  Calculator as CalculatorIcon,
} from "lucide-react";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { Callout } from "@/components/ui/Callout";
import { Container } from "@/components/ui/Container";
import { TableOfContents, type TocItem } from "@/components/articles/TableOfContents";
import { FAQAccordion } from "@/components/articles/FAQAccordion";
import { RelatedArticles } from "@/components/articles/RelatedArticles";
import { AuthorBio } from "@/components/articles/AuthorBio";
import { AdSlot } from "@/components/ads/AdSlot";
import { MobileStickyAd } from "@/components/ads/MobileStickyAd";
import { getArticleAdPlan } from "@/components/ads/adDensity";
import { shouldRenderAdPlaceholder } from "@/config/ads";
import { ArticleThumb } from "@/components/media/ArticleThumb";
import { JsonLd } from "@/components/seo/JsonLd";
import { ArticleBody } from "@/lib/content/mdx";
import {
  articleSchema,
  breadcrumbSchema,
  faqPageSchema,
  howToSchema,
  type Crumb,
} from "@/lib/seo/schema";
import { difficultyLabels, safetyLevelLabels } from "@/config/taxonomy";
import { getCalculator } from "@/config/calculators";
import { formatDate } from "@/lib/utils/date";
import type { Article } from "@/lib/content/schema";

export function ArticleLayout({
  article,
  breadcrumbs,
  related,
}: {
  article: Article;
  breadcrumbs: Crumb[];
  related: Article[];
}) {
  const fm = article.frontmatter;
  const adPlan = getArticleAdPlan(article.wordCount);
  // The hub the article "belongs to" is the second-to-last breadcrumb
  // (the last is the article itself) — e.g. Appliance Problems > Washing
  // Machines > this article, or Cleaning > this article for flat categories.
  const parentHub = breadcrumbs.length >= 2 ? breadcrumbs[breadcrumbs.length - 2] : undefined;
  const relatedCalculators = fm.relatedCalculators
    .map((slug) => getCalculator(slug))
    .filter((c): c is NonNullable<typeof c> => Boolean(c));

  const toc: TocItem[] = [
    fm.symptoms.length > 0 && { id: "symptoms", label: "Common Symptoms" },
    fm.causes.length > 0 && { id: "causes", label: "Likely Causes" },
    fm.safeChecks.length > 0 && { id: "safe-checks", label: "Safe Checks You Can Do" },
    fm.steps.length > 0 && { id: "steps", label: "Step-by-Step Solution" },
    fm.dontDo.length > 0 && { id: "dont-do", label: "What Not to Do" },
    fm.whenToCallPro.length > 0 && {
      id: "when-to-call-pro",
      label: "When to Call a Professional",
    },
    fm.faqs.length > 0 && { id: "faq", label: "Frequently Asked Questions" },
  ].filter(Boolean) as TocItem[];

  return (
    <>
      <JsonLd data={articleSchema(article)} />
      <JsonLd data={breadcrumbSchema([{ label: "Home", href: "/" }, ...breadcrumbs])} />
      <JsonLd data={howToSchema(article)} />
      <JsonLd data={faqPageSchema(article)} />

      <Container className="py-8">
        <Breadcrumbs items={breadcrumbs} />

        <ArticleThumb
          category={fm.category}
          subcategory={fm.subcategory}
          className="mt-4 h-40 w-full rounded-2xl sm:h-56"
          iconClassName="h-14 w-14 sm:h-16 sm:w-16"
        />

        <header className="mt-6 max-w-3xl">
          <div className="mb-3 flex flex-wrap items-center gap-2">
            {fm.brand && <Badge variant="blue">{fm.brand}</Badge>}
            {fm.errorCode && <Badge variant="amber">Error Code {fm.errorCode}</Badge>}
            {fm.difficulty && (
              <Badge variant="neutral">{difficultyLabels[fm.difficulty]}</Badge>
            )}
            {fm.safetyLevel && (
              <Badge
                variant={
                  fm.safetyLevel === "high"
                    ? "red"
                    : fm.safetyLevel === "medium"
                      ? "amber"
                      : "green"
                }
              >
                {safetyLevelLabels[fm.safetyLevel]}
              </Badge>
            )}
          </div>
          <h1 className="text-ink-950 text-3xl leading-tight font-extrabold sm:text-4xl">
            {fm.title}
          </h1>

          <div className="text-ink-500 mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm">
            <span className="flex items-center gap-1.5">
              <CalendarDays className="h-4 w-4" aria-hidden="true" />
              Updated {formatDate(fm.updatedAt)}
            </span>
            <span className="flex items-center gap-1.5">
              <Clock className="h-4 w-4" aria-hidden="true" />
              {article.readingTime}
            </span>
            {fm.estimatedTime && (
              <span className="flex items-center gap-1.5">
                Time needed: {fm.estimatedTime}
              </span>
            )}
          </div>

          {parentHub && (
            <Link
              href={parentHub.href}
              className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-blue-700 hover:underline"
            >
              See all {parentHub.label} guides
              <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
            </Link>
          )}
        </header>

        <div className="mt-8 grid gap-10 lg:grid-cols-[minmax(0,1fr)_300px]">
          <div className="min-w-0 space-y-10">
            <Card className="border-blue-100 bg-blue-50/60 p-5">
              <p className="text-ink-900 text-base leading-relaxed">
                <span className="font-semibold">Short answer: </span>
                {fm.quickAnswer}
              </p>
            </Card>

            <div className="lg:hidden">
              <TableOfContents items={toc} />
            </div>

            <AdSlot placement="in-article-top" />

            <ArticleBody source={article.content} />

            {fm.symptoms.length > 0 && (
              <section id="symptoms" aria-labelledby="symptoms-heading">
                <h2 id="symptoms-heading" className="text-ink-950 mb-3 text-xl font-bold">
                  Common Symptoms
                </h2>
                <ul className="space-y-2">
                  {fm.symptoms.map((symptom) => (
                    <li key={symptom} className="text-ink-700 flex items-start gap-2.5">
                      <AlertTriangle
                        className="mt-0.5 h-4 w-4 flex-none text-amber-500"
                        aria-hidden="true"
                      />
                      <span>{symptom}</span>
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {fm.causes.length > 0 && (
              <section id="causes" aria-labelledby="causes-heading">
                <h2 id="causes-heading" className="text-ink-950 mb-3 text-xl font-bold">
                  Likely Causes
                </h2>
                <div className="space-y-3">
                  {fm.causes.map((cause, index) => (
                    <Card key={cause.title} className="p-4">
                      <p className="text-ink-900 font-semibold">
                        {index + 1}. {cause.title}
                      </p>
                      <p className="text-ink-500 mt-1 text-sm leading-relaxed">
                        {cause.description}
                      </p>
                    </Card>
                  ))}
                </div>
              </section>
            )}

            {adPlan.mid35 && <AdSlot placement="in-article-mid-35" />}

            {fm.safeChecks.length > 0 && (
              <section id="safe-checks" aria-labelledby="safe-checks-heading">
                <h2
                  id="safe-checks-heading"
                  className="text-ink-950 mb-3 text-xl font-bold"
                >
                  Safe Checks You Can Do
                </h2>
                <ul className="space-y-2">
                  {fm.safeChecks.map((check) => (
                    <li key={check} className="text-ink-700 flex items-start gap-2.5">
                      <CheckCircle2
                        className="mt-0.5 h-4 w-4 flex-none text-emerald-600"
                        aria-hidden="true"
                      />
                      <span>{check}</span>
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {fm.steps.length > 0 && (
              <section id="steps" aria-labelledby="steps-heading">
                <h2 id="steps-heading" className="text-ink-950 mb-3 text-xl font-bold">
                  Step-by-Step Solution
                </h2>
                <ol className="space-y-3">
                  {fm.steps.map((step, index) => (
                    <li key={step.title} className="flex gap-3">
                      <span className="flex h-7 w-7 flex-none items-center justify-center rounded-full bg-blue-600 text-sm font-semibold text-white">
                        {index + 1}
                      </span>
                      <div>
                        <p className="text-ink-900 font-semibold">{step.title}</p>
                        <p className="text-ink-500 mt-0.5 text-sm leading-relaxed">
                          {step.description}
                        </p>
                      </div>
                    </li>
                  ))}
                </ol>
              </section>
            )}

            {fm.dontDo.length > 0 && (
              <section id="dont-do" aria-labelledby="dont-do-heading">
                <h2 id="dont-do-heading" className="text-ink-950 mb-3 text-xl font-bold">
                  What Not to Do
                </h2>
                <ul className="space-y-2">
                  {fm.dontDo.map((item) => (
                    <li key={item} className="text-ink-700 flex items-start gap-2.5">
                      <XCircle
                        className="mt-0.5 h-4 w-4 flex-none text-red-500"
                        aria-hidden="true"
                      />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {adPlan.mid70 && <AdSlot placement="in-article-mid-70" />}

            {fm.whenToCallPro.length > 0 && (
              <section id="when-to-call-pro" aria-labelledby="when-to-call-pro-heading">
                <h2
                  id="when-to-call-pro-heading"
                  className="text-ink-950 mb-3 text-xl font-bold"
                >
                  When to Call a Professional
                </h2>
                <Callout variant="warning">
                  <ul className="space-y-1.5">
                    {fm.whenToCallPro.map((item) => (
                      <li key={item} className="flex items-start gap-2.5">
                        <PhoneCall
                          className="mt-0.5 h-4 w-4 flex-none"
                          aria-hidden="true"
                        />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </Callout>
              </section>
            )}

            {fm.safetyWarning && (
              <Callout variant="danger" title="Safety warning">
                {fm.safetyWarning}
              </Callout>
            )}

            {fm.faqs.length > 0 && (
              <section id="faq" aria-labelledby="faq-heading">
                <h2 id="faq-heading" className="text-ink-950 mb-3 text-xl font-bold">
                  Frequently Asked Questions
                </h2>
                <FAQAccordion faqs={fm.faqs} />
              </section>
            )}

            <AuthorBio author={fm.author} updatedAt={formatDate(fm.updatedAt)} />

            {fm.sources.length > 0 && (
              <section aria-labelledby="sources-heading">
                <h2
                  id="sources-heading"
                  className="text-ink-500 mb-2 text-sm font-semibold tracking-wide uppercase"
                >
                  Sources &amp; Further Reading
                </h2>
                <ul className="text-ink-500 list-inside list-disc space-y-1 text-sm">
                  {fm.sources.map((source) => (
                    <li key={source}>{source}</li>
                  ))}
                </ul>
              </section>
            )}

            <AdSlot placement="article-end" />

            {relatedCalculators.length > 0 && (
              <section aria-labelledby="helpful-calculators-heading">
                <h2
                  id="helpful-calculators-heading"
                  className="text-ink-950 mb-3 text-xl font-bold"
                >
                  Helpful Calculators
                </h2>
                <div className="grid gap-3 sm:grid-cols-2">
                  {relatedCalculators.map((calc) => (
                    <Link
                      key={calc.slug}
                      href={`/calculators/${calc.slug}`}
                      className="border-ink-100 flex items-start gap-3 rounded-xl border bg-white p-4 hover:border-blue-200 hover:shadow-sm"
                    >
                      <CalculatorIcon
                        className="mt-0.5 h-5 w-5 flex-none text-blue-600"
                        aria-hidden="true"
                      />
                      <span>
                        <span className="text-ink-900 block text-sm font-semibold">
                          {calc.title}
                        </span>
                        <span className="text-ink-500 text-xs leading-relaxed">
                          {calc.description}
                        </span>
                      </span>
                    </Link>
                  ))}
                </div>
              </section>
            )}

            <RelatedArticles articles={related} />
          </div>

          <aside className="hidden space-y-6 lg:block">
            <div className="sticky top-24 space-y-6">
              <TableOfContents items={toc} />
              {adPlan.sidebar && <AdSlot placement="sidebar" />}
            </div>
          </aside>
        </div>
      </Container>

      {adPlan.mobileSticky && shouldRenderAdPlaceholder() && (
        <>
          <div className="h-14 md:hidden" aria-hidden="true" />
          <MobileStickyAd />
        </>
      )}
    </>
  );
}
