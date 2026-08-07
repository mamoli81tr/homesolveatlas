import { siteConfig } from "@/config/site";
import { getAllArticles } from "@/lib/content/queries";

function escapeXml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export function GET() {
  const articles = getAllArticles().slice(0, 50);

  const items = articles
    .map((article) => {
      const fm = article.frontmatter;
      const url = `${siteConfig.url}${article.href}`;
      const pubDate = new Date(`${fm.publishedAt}T00:00:00Z`).toUTCString();
      return `
    <item>
      <title>${escapeXml(fm.title)}</title>
      <link>${url}</link>
      <guid>${url}</guid>
      <description>${escapeXml(fm.description)}</description>
      <pubDate>${pubDate}</pubDate>
    </item>`;
    })
    .join("");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(siteConfig.name)}</title>
    <link>${siteConfig.url}</link>
    <description>${escapeXml(siteConfig.description)}</description>
    <language>${siteConfig.language}</language>
    <atom:link href="${siteConfig.url}/rss.xml" rel="self" type="application/rss+xml" />${items}
  </channel>
</rss>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=3600",
    },
  });
}
