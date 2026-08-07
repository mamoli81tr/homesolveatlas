import type { Metadata } from "next";
import { siteConfig } from "@/config/site";

interface BuildMetadataInput {
  title: string;
  description: string;
  /** Site-relative path starting with "/". */
  path: string;
  noindex?: boolean;
  keywords?: string[];
  type?: "website" | "article";
  publishedAt?: string;
  updatedAt?: string;
  /** Short label shown on the generated OG image (e.g. "Error Codes", "Calculator"). */
  ogCategory?: string;
}

/**
 * Builds a Next.js `Metadata` object with canonical URL, Open Graph, and
 * Twitter Card set consistently. Use this for every page instead of writing
 * `export const metadata` by hand, so canonical/OG never drift.
 */
export function buildMetadata(input: BuildMetadataInput): Metadata {
  const url = `${siteConfig.url}${input.path}`;
  const titleFull =
    input.path === "/" ? input.title : `${input.title} | ${siteConfig.name}`;

  const ogImageParams = new URLSearchParams({ title: input.title });
  if (input.ogCategory) ogImageParams.set("category", input.ogCategory);
  const ogImage = {
    url: `${siteConfig.url}/og?${ogImageParams.toString()}`,
    width: 1200,
    height: 630,
    alt: input.title,
  };

  return {
    // `absolute` opts out of the root layout's `title.template`
    // ("%s | HomeSolveAtlas") — buildMetadata already appends the site name itself,
    // so without `absolute` the two would combine into a doubled suffix.
    title: { absolute: titleFull },
    description: input.description,
    keywords: input.keywords?.length ? input.keywords : undefined,
    alternates: {
      canonical: url,
    },
    robots: input.noindex
      ? { index: false, follow: false }
      : { index: true, follow: true },
    openGraph: {
      title: titleFull,
      description: input.description,
      url,
      siteName: siteConfig.name,
      locale: siteConfig.locale,
      type: input.type ?? "website",
      images: [ogImage],
      ...(input.type === "article" && {
        publishedTime: input.publishedAt,
        modifiedTime: input.updatedAt,
        authors: [siteConfig.defaultAuthor],
      }),
    },
    twitter: {
      card: "summary_large_image",
      title: titleFull,
      description: input.description,
      images: [ogImage.url],
    },
  };
}
