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
    .filter((a) => a.frontmatter.category === "maintenance")
    .map((a) => ({ slug: a.frontmatter.slug }));
}

async function loadArticle(slug: string) {
  return getArticleByHref(`/maintenance/${slug}`);
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
    ogCategory: "Home Maintenance",
  });
}

export default async function MaintenanceArticlePage({
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
        { label: "Home Maintenance", href: "/maintenance" },
        { label: article.frontmatter.title, href: article.href },
      ]}
      related={getRelatedArticles(article)}
    />
  );
}
