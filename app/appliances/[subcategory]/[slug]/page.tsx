import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { buildMetadata } from "@/lib/seo/metadata";
import {
  getAllArticles,
  getArticleByHref,
  getRelatedArticles,
} from "@/lib/content/queries";
import { getSubcategory } from "@/config/taxonomy";
import { ArticleLayout } from "@/components/articles/ArticleLayout";

export function generateStaticParams() {
  return getAllArticles()
    .filter((a) => a.frontmatter.category === "appliances")
    .map((a) => ({ subcategory: a.frontmatter.subcategory!, slug: a.frontmatter.slug }));
}

async function loadArticle(subcategory: string, slug: string) {
  return getArticleByHref(`/appliances/${subcategory}/${slug}`);
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ subcategory: string; slug: string }>;
}): Promise<Metadata> {
  const { subcategory, slug } = await params;
  const article = await loadArticle(subcategory, slug);
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
    ogCategory: "Appliance Problems",
  });
}

export default async function ApplianceArticlePage({
  params,
}: {
  params: Promise<{ subcategory: string; slug: string }>;
}) {
  const { subcategory, slug } = await params;
  const article = await loadArticle(subcategory, slug);
  if (!article || article.frontmatter.draft) notFound();

  const type = getSubcategory("appliances", subcategory);

  return (
    <ArticleLayout
      article={article}
      breadcrumbs={[
        { label: "Appliance Problems", href: "/appliances" },
        { label: type?.label ?? subcategory, href: `/appliances/${subcategory}` },
        { label: article.frontmatter.title, href: article.href },
      ]}
      related={getRelatedArticles(article)}
    />
  );
}
