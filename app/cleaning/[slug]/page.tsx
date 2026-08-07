import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { buildMetadata } from "@/lib/seo/metadata";
import {
  getAllArticles,
  getArticleByHref,
  getRelatedArticles,
} from "@/lib/content/queries";
import { ArticleLayout } from "@/components/articles/ArticleLayout";

export function generateStaticParams() {
  return getAllArticles()
    .filter((a) => a.frontmatter.category === "cleaning")
    .map((a) => ({ slug: a.frontmatter.slug }));
}

async function loadArticle(slug: string) {
  return getArticleByHref(`/cleaning/${slug}`);
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const article = await loadArticle(slug);
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
    ogCategory: "Cleaning & Stain Removal",
  });
}

export default async function CleaningArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = await loadArticle(slug);
  if (!article || article.frontmatter.draft) notFound();

  return (
    <ArticleLayout
      article={article}
      breadcrumbs={[
        { label: "Cleaning & Stain Removal", href: "/cleaning" },
        { label: article.frontmatter.title, href: article.href },
      ]}
      related={getRelatedArticles(article)}
    />
  );
}
