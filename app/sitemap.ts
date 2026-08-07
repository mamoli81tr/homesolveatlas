import type { MetadataRoute } from "next";
import { siteConfig } from "@/config/site";
import { categories, allSubcategories, brands, rooms } from "@/config/taxonomy";
import { calculators } from "@/config/calculators";
import {
  getAllArticles,
  getArticlesBySubcategory,
  getArticlesByCategoryAndBrand,
  getArticlesByRoom,
  isHubIndexable,
} from "@/lib/content/queries";

/**
 * Single sitemap covering the whole site. At this content volume (well
 * under a thousand URLs) one sitemap is the right choice — Next.js
 * supports splitting into a sitemap index via `generateSitemaps()` if the
 * catalog grows large enough to need it later.
 *
 * Taxonomy hub URLs (appliance subcategory / brand / room) are only listed
 * here once they clear `isHubIndexable()` — the same threshold each hub
 * page uses to decide its own `noindex` status, in
 * `lib/content/queries.ts`. Submitting a noindexed URL in the sitemap sends
 * search engines a contradictory signal, so the two must stay in sync.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const staticPages: MetadataRoute.Sitemap = [
    { url: `${siteConfig.url}/`, changeFrequency: "weekly", priority: 1 },
    { url: `${siteConfig.url}/about`, changeFrequency: "yearly", priority: 0.3 },
    { url: `${siteConfig.url}/contact`, changeFrequency: "yearly", priority: 0.3 },
    {
      url: `${siteConfig.url}/editorial-policy`,
      changeFrequency: "yearly",
      priority: 0.2,
    },
    { url: `${siteConfig.url}/privacy-policy`, changeFrequency: "yearly", priority: 0.1 },
    { url: `${siteConfig.url}/terms-of-use`, changeFrequency: "yearly", priority: 0.1 },
    { url: `${siteConfig.url}/cookie-policy`, changeFrequency: "yearly", priority: 0.1 },
    { url: `${siteConfig.url}/disclaimer`, changeFrequency: "yearly", priority: 0.1 },
    { url: `${siteConfig.url}/calculators`, changeFrequency: "monthly", priority: 0.8 },
  ];

  const categoryPages: MetadataRoute.Sitemap = categories.map((c) => ({
    url: `${siteConfig.url}${c.href}`,
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  const subcategoryPages: MetadataRoute.Sitemap = allSubcategories
    .filter((s) => s.category === "appliances")
    .filter((s) => isHubIndexable(getArticlesBySubcategory("appliances", s.slug).length))
    .map((s) => ({
      url: `${siteConfig.url}/appliances/${s.slug}`,
      changeFrequency: "weekly",
      priority: 0.6,
    }));

  const brandPages: MetadataRoute.Sitemap = brands
    .filter((b) => isHubIndexable(getArticlesByCategoryAndBrand("error-codes", b.slug).length))
    .map((b) => ({
      url: `${siteConfig.url}/error-codes/${b.slug}`,
      changeFrequency: "weekly",
      priority: 0.6,
    }));

  const roomPages: MetadataRoute.Sitemap = rooms
    .filter((r) => isHubIndexable(getArticlesByRoom(r.slug).length))
    .map((r) => ({
      url: `${siteConfig.url}/rooms/${r.slug}`,
      changeFrequency: "monthly",
      priority: 0.5,
    }));

  const calculatorPages: MetadataRoute.Sitemap = calculators.map((c) => ({
    url: `${siteConfig.url}/calculators/${c.slug}`,
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  const articlePages: MetadataRoute.Sitemap = getAllArticles().map((article) => ({
    url: `${siteConfig.url}${article.href}`,
    lastModified: article.frontmatter.updatedAt,
    changeFrequency: "monthly",
    priority: article.frontmatter.featured ? 0.9 : 0.7,
  }));

  return [
    ...staticPages,
    ...categoryPages,
    ...subcategoryPages,
    ...brandPages,
    ...roomPages,
    ...calculatorPages,
    ...articlePages,
  ];
}
