import { z } from "zod";

/**
 * Zod schema for article frontmatter. Every `.mdx` file in `content/`
 * is validated against this at build/request time — invalid frontmatter
 * throws immediately with a clear message instead of silently rendering
 * a broken page. See scripts/validate-content.ts for the batch checker.
 */

export const categorySlugSchema = z.enum([
  "appliances",
  "error-codes",
  "cleaning",
  "maintenance",
  "heating-cooling",
]);

const causeSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
});

const stepSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
});

const faqSchema = z.object({
  q: z.string().min(1),
  a: z.string().min(1),
});

export const articleFrontmatterSchema = z.object({
  title: z.string().min(8, "title must be at least 8 characters"),
  slug: z
    .string()
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "slug must be lowercase kebab-case"),
  description: z.string().min(30).max(200),
  category: categorySlugSchema,
  subcategory: z.string().optional(),
  appliance: z.string().optional(),
  brand: z.string().optional(),
  errorCode: z.string().optional(),
  room: z.array(z.string()).optional().default([]),
  difficulty: z.enum(["easy", "moderate", "advanced"]).optional(),
  estimatedTime: z.string().optional(),
  safetyLevel: z.enum(["low", "medium", "high"]).optional(),
  author: z.string().default("Home Solutions Editorial Team"),
  publishedAt: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "publishedAt must be YYYY-MM-DD"),
  updatedAt: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "updatedAt must be YYYY-MM-DD"),
  featuredImage: z.string().optional(),
  keywords: z.array(z.string()).optional().default([]),
  relatedArticles: z.array(z.string()).optional().default([]),
  /** Calculator slugs (e.g. "paint-calculator") this article should link to as a helpful tool. */
  relatedCalculators: z.array(z.string()).optional().default([]),
  featured: z.boolean().optional().default(false),
  draft: z.boolean().optional().default(false),

  // Structured template sections (see components/articles/ArticleLayout.tsx)
  quickAnswer: z.string().min(20),
  symptoms: z.array(z.string()).optional().default([]),
  causes: z.array(causeSchema).optional().default([]),
  safeChecks: z.array(z.string()).optional().default([]),
  steps: z.array(stepSchema).optional().default([]),
  dontDo: z.array(z.string()).optional().default([]),
  whenToCallPro: z.array(z.string()).optional().default([]),
  faqs: z.array(faqSchema).optional().default([]),
  sources: z.array(z.string()).optional().default([]),
  safetyWarning: z.string().optional(),
});

export type ArticleFrontmatter = z.infer<typeof articleFrontmatterSchema>;
export type CategorySlug = z.infer<typeof categorySlugSchema>;

export interface Article {
  frontmatter: ArticleFrontmatter;
  /** Raw MDX body (everything after the frontmatter fence). */
  content: string;
  /** Path to the source file, relative to content/, for error messages. */
  sourcePath: string;
  /** Computed reading time label, e.g. "4 min read". */
  readingTime: string;
  /** Total words across structured sections + body, used for reading time AND ad-density decisions. */
  wordCount: number;
  /** Computed canonical site path, e.g. /appliances/washing-machines/not-draining */
  href: string;
}
