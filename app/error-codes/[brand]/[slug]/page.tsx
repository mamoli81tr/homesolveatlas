import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { buildMetadata } from "@/lib/seo/metadata";
import {
  getAllArticles,
  getArticleByHref,
  getRelatedArticles,
} from "@/lib/content/queries";
import { getBrand } from "@/config/taxonomy";
import { ArticleLayout } from "@/components/articles/ArticleLayout";

export function generateStaticParams() {
  return getAllArticles()
    .filter((a) => a.frontmatter.category === "error-codes")
    .map((a) => ({ brand: a.frontmatter.brand!, slug: a.frontmatter.slug }));
}

async function loadArticle(brand: string, slug: string) {
  return getArticleByHref(`/error-codes/${brand}/${slug}`);
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ brand: string; slug: string }>;
}): Promise<Metadata> {
  const { brand, slug } = await params;
  const article = await loadArticle(brand, slug);
  if (!article) return {};
  const fm = article.frontmatter;
  return buildMetadata({
    title: fm.title,
    description: fm.description,
    path: article.href,
    type: "article",
    publishedAt: fm.publishedAt,
    updatedAt: fm.updatedAt,
    keywords: fm.keywords,
    noindex: fm.draft,
    ogCategory: "Error Codes",
  });
}

export default async function ErrorCodeArticlePage({
  params,
}: {
  params: Promise<{ brand: string; slug: string }>;
}) {
  const { brand: brandSlug, slug } = await params;
  const article = await loadArticle(brandSlug, slug);
  if (!article || article.frontmatter.draft) notFound();

  const brand = getBrand(brandSlug);

  return (
    <ArticleLayout
      article={article}
      breadcrumbs={[
        { label: "Error Codes", href: "/error-codes" },
        { label: brand?.label ?? brandSlug, href: `/error-codes/${brandSlug}` },
        { label: article.frontmatter.title, href: article.href },
      ]}
      related={getRelatedArticles(article)}
    />
  );
}
