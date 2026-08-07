import { siteConfig } from "@/config/site";
import type { Article } from "@/lib/content/schema";

/**
 * JSON-LD structured data builders. Every function returns a plain object
 * matching schema.org — render it with <JsonLd data={...} /> below.
 * No fabricated ratings, review counts, or testimonials are ever included.
 */

export function organizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: siteConfig.name,
    url: siteConfig.url,
    description: siteConfig.description,
  };
}

export function websiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: siteConfig.name,
    url: siteConfig.url,
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${siteConfig.url}/search?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };
}

export interface Crumb {
  label: string;
  href: string;
}

export function breadcrumbSchema(crumbs: Crumb[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: crumbs.map((crumb, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: crumb.label,
      item: `${siteConfig.url}${crumb.href}`,
    })),
  };
}

export function articleSchema(article: Article) {
  const fm = article.frontmatter;
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: fm.title,
    description: fm.description,
    datePublished: fm.publishedAt,
    dateModified: fm.updatedAt,
    author: {
      "@type": "Organization",
      name: fm.author,
    },
    publisher: {
      "@type": "Organization",
      name: siteConfig.publisher,
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${siteConfig.url}${article.href}`,
    },
  };
}

/** Only call this when the article actually has ordered `steps` — do not attach HowTo to prose-only pages. */
export function howToSchema(article: Article) {
  const fm = article.frontmatter;
  if (!fm.steps.length) return null;
  return {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: fm.title,
    description: fm.description,
    ...(fm.estimatedTime && { totalTime: fm.estimatedTime }),
    step: fm.steps.map((step, index) => ({
      "@type": "HowToStep",
      position: index + 1,
      name: step.title,
      text: step.description,
    })),
  };
}

export interface FaqEntry {
  q: string;
  a: string;
}

/** Only call this when the page has visible FAQ entries actually rendered on it. */
export function faqPageSchemaFromList(faqs: FaqEntry[]) {
  if (!faqs.length) return null;
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.a,
      },
    })),
  };
}

/** Only call this when the article has visible FAQ entries rendered on the page. */
export function faqPageSchema(article: Article) {
  return faqPageSchemaFromList(article.frontmatter.faqs);
}

export function softwareApplicationSchema(input: {
  name: string;
  description: string;
  path: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: input.name,
    description: input.description,
    url: `${siteConfig.url}${input.path}`,
    applicationCategory: "UtilitiesApplication",
    operatingSystem: "Any (runs in browser)",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
  };
}
