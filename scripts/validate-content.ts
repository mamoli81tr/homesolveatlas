/**
 * Content validation script.
 *
 * Run with: npm run validate-content
 *
 * Checks every .mdx file under content/articles for:
 *  - missing/invalid required frontmatter fields (via the same Zod schema
 *    the site itself uses to render pages)
 *  - duplicate computed URLs / canonical targets (slug collisions)
 *  - duplicate slugs across categories, titles, and meta descriptions
 *  - invalid publishedAt/updatedAt dates (not real calendar dates, or
 *    updatedAt before publishedAt)
 *  - invalid category/subcategory/brand/room values not defined in
 *    config/taxonomy.ts
 *  - missing safety warnings on high-safety-risk articles
 *  - broken relatedArticles entries
 *  - broken internal links inside the MDX body content
 *  - orphan articles (nothing else on the site links to them)
 *  - articles that are too thin to be useful (very low total word count)
 *  - articles with no structured troubleshooting content at all
 *
 * Exits with a non-zero status if any error-level issue is found, so it can
 * be wired into CI. Warnings are reported but don't fail the run.
 */
import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { articleFrontmatterSchema, type ArticleFrontmatter } from "../lib/content/schema";
import { getArticleHref } from "../lib/content/routing";
import { categories, allSubcategories, brands, rooms } from "../config/taxonomy";
import { calculators } from "../config/calculators";

const CONTENT_DIR = path.join(process.cwd(), "content", "articles");
const MIN_WORD_COUNT = 120;

interface Issue {
  file: string;
  level: "error" | "warning";
  message: string;
}

interface ParsedArticle {
  file: string;
  href: string;
  fm: ArticleFrontmatter;
  body: string;
}

function listMdxFiles(dir: string): string[] {
  if (!fs.existsSync(dir)) return [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  const files: string[] = [];
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) files.push(...listMdxFiles(fullPath));
    else if (entry.isFile() && entry.name.endsWith(".mdx")) files.push(fullPath);
  }
  return files;
}

function wordCount(text: string): number {
  return text.trim().split(/\s+/).filter(Boolean).length;
}

function isValidDate(value: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const date = new Date(`${value}T00:00:00Z`);
  return !Number.isNaN(date.getTime()) && date.toISOString().startsWith(value);
}

function normalize(text: string): string {
  return text.trim().toLowerCase().replace(/\s+/g, " ");
}

/** Every internal path the site actually serves — used to catch broken body links. */
function buildKnownPaths(articleHrefs: string[]): Set<string> {
  const known = new Set<string>([
    "/",
    "/about",
    "/contact",
    "/privacy-policy",
    "/terms-of-use",
    "/cookie-policy",
    "/disclaimer",
    "/editorial-policy",
    "/search",
    "/calculators",
  ]);
  for (const c of categories) known.add(c.href);
  for (const s of allSubcategories.filter((s) => s.category === "appliances")) {
    known.add(`/appliances/${s.slug}`);
  }
  for (const b of brands) known.add(`/error-codes/${b.slug}`);
  for (const r of rooms) known.add(`/rooms/${r.slug}`);
  for (const c of calculators) known.add(`/calculators/${c.slug}`);
  for (const href of articleHrefs) known.add(href);
  return known;
}

/** Extracts `/site-relative` link targets from markdown/MDX body link syntax. */
function extractInternalLinks(body: string): string[] {
  const links: string[] = [];
  const pattern = /\]\(([^)\s]+)(?:\s+"[^"]*")?\)/g;
  let match: RegExpExecArray | null;
  while ((match = pattern.exec(body))) {
    const target = match[1];
    if (target && target.startsWith("/")) {
      const clean = target.split("#")[0]?.split("?")[0];
      if (clean) links.push(clean);
    }
  }
  return links;
}

function main() {
  const files = listMdxFiles(CONTENT_DIR);
  const issues: Issue[] = [];
  const hrefBySlugKey = new Map<string, string>();
  const rawSlugSeen = new Map<string, string[]>();
  const titleSeen = new Map<string, string[]>();
  const descriptionSeen = new Map<string, string[]>();
  const parsed: ParsedArticle[] = [];

  const knownCategorySlugs = new Set(categories.map((c) => c.slug));
  const knownBrandSlugs = new Set(brands.map((b) => b.slug));
  const knownRoomSlugs = new Set(rooms.map((r) => r.slug));
  const subcategoriesByCategory = new Map<string, Set<string>>();
  for (const s of allSubcategories) {
    if (!subcategoriesByCategory.has(s.category)) subcategoriesByCategory.set(s.category, new Set());
    subcategoriesByCategory.get(s.category)!.add(s.slug);
  }

  if (files.length === 0) {
    console.error(`No content files found under ${CONTENT_DIR}`);
    process.exit(1);
  }

  for (const filePath of files) {
    const relFile = path.relative(process.cwd(), filePath);
    const raw = fs.readFileSync(filePath, "utf-8");
    const { data, content } = matter(raw);

    const result = articleFrontmatterSchema.safeParse(data);
    if (!result.success) {
      for (const issue of result.error.issues) {
        issues.push({
          file: relFile,
          level: "error",
          message: `${issue.path.join(".") || "(root)"}: ${issue.message}`,
        });
      }
      continue; // can't do further checks without valid frontmatter
    }

    const fm = result.data;

    // Duplicate computed href / canonical target
    let href: string;
    try {
      href = getArticleHref(fm);
    } catch (err) {
      issues.push({ file: relFile, level: "error", message: (err as Error).message });
      continue;
    }
    if (hrefBySlugKey.has(href)) {
      issues.push({
        file: relFile,
        level: "error",
        message: `Duplicate URL/canonical target "${href}" also produced by ${hrefBySlugKey.get(href)}`,
      });
    } else {
      hrefBySlugKey.set(href, relFile);
    }

    // Duplicate raw slug field (even across categories, since it's a smell even when not a hard collision)
    const slugKey = fm.slug.toLowerCase();
    rawSlugSeen.set(slugKey, [...(rawSlugSeen.get(slugKey) ?? []), relFile]);

    // Duplicate title / description
    titleSeen.set(normalize(fm.title), [...(titleSeen.get(normalize(fm.title)) ?? []), relFile]);
    descriptionSeen.set(normalize(fm.description), [
      ...(descriptionSeen.get(normalize(fm.description)) ?? []),
      relFile,
    ]);

    // Date validity
    if (!isValidDate(fm.publishedAt)) {
      issues.push({
        file: relFile,
        level: "error",
        message: `publishedAt "${fm.publishedAt}" is not a real calendar date`,
      });
    }
    if (!isValidDate(fm.updatedAt)) {
      issues.push({
        file: relFile,
        level: "error",
        message: `updatedAt "${fm.updatedAt}" is not a real calendar date`,
      });
    }
    if (
      isValidDate(fm.publishedAt) &&
      isValidDate(fm.updatedAt) &&
      fm.updatedAt < fm.publishedAt
    ) {
      issues.push({
        file: relFile,
        level: "error",
        message: `updatedAt (${fm.updatedAt}) is before publishedAt (${fm.publishedAt})`,
      });
    }

    // Taxonomy cross-checks — catches typos that the Zod schema (which only
    // knows `category` as a strict enum) can't, since subcategory/brand/room
    // are free-text strings validated against config/taxonomy.ts instead.
    if (!knownCategorySlugs.has(fm.category)) {
      issues.push({ file: relFile, level: "error", message: `Unknown category "${fm.category}"` });
    }
    if (fm.subcategory) {
      const validForCategory = subcategoriesByCategory.get(fm.category);
      if (!validForCategory?.has(fm.subcategory)) {
        issues.push({
          file: relFile,
          level: "error",
          message: `subcategory "${fm.subcategory}" is not defined in config/taxonomy.ts for category "${fm.category}"`,
        });
      }
    }
    if (fm.brand && !knownBrandSlugs.has(fm.brand)) {
      issues.push({
        file: relFile,
        level: "error",
        message: `brand "${fm.brand}" is not defined in config/taxonomy.ts`,
      });
    }
    for (const room of fm.room) {
      if (!knownRoomSlugs.has(room)) {
        issues.push({
          file: relFile,
          level: "error",
          message: `room "${room}" is not defined in config/taxonomy.ts`,
        });
      }
    }

    // Category-specific required fields (routing depends on these)
    if (fm.category === "appliances" && !fm.subcategory) {
      issues.push({ file: relFile, level: "error", message: `category "appliances" requires a subcategory` });
    }
    if (fm.category === "error-codes" && !fm.brand) {
      issues.push({ file: relFile, level: "error", message: `category "error-codes" requires a brand` });
    }

    // Safety warning required on high-risk articles
    if (fm.safetyLevel === "high" && !fm.safetyWarning?.trim()) {
      issues.push({
        file: relFile,
        level: "error",
        message: `safetyLevel is "high" but safetyWarning is empty — high-risk articles must include one`,
      });
    }

    // Structured content completeness
    if (fm.symptoms.length === 0 && fm.causes.length === 0 && fm.steps.length === 0) {
      issues.push({
        file: relFile,
        level: "error",
        message: `no symptoms, causes, or steps — article has no structured troubleshooting content beyond the quick answer`,
      });
    }

    // Thin content check
    const totalWords =
      wordCount(fm.quickAnswer) +
      wordCount(fm.symptoms.join(" ")) +
      wordCount(fm.causes.map((c) => `${c.title} ${c.description}`).join(" ")) +
      wordCount(fm.steps.map((s) => `${s.title} ${s.description}`).join(" ")) +
      wordCount(fm.faqs.map((f) => `${f.q} ${f.a}`).join(" ")) +
      wordCount(content);
    if (totalWords < MIN_WORD_COUNT) {
      issues.push({
        file: relFile,
        level: "warning",
        message: `Only ~${totalWords} words of substantive content (minimum recommended: ${MIN_WORD_COUNT})`,
      });
    }

    parsed.push({ file: relFile, href, fm, body: content });
  }

  // Duplicate slug / title / description (cross-file)
  for (const [slug, fileList] of rawSlugSeen) {
    if (fileList.length > 1) {
      issues.push({
        file: fileList[0]!,
        level: "warning",
        message: `slug "${slug}" is reused by: ${fileList.join(", ")} — consider making each slug unique even across categories`,
      });
    }
  }
  for (const [title, fileList] of titleSeen) {
    if (fileList.length > 1) {
      issues.push({
        file: fileList[0]!,
        level: "error",
        message: `duplicate title "${title}" also used by: ${fileList.slice(1).join(", ")}`,
      });
    }
  }
  for (const [, fileList] of descriptionSeen) {
    if (fileList.length > 1) {
      issues.push({
        file: fileList[0]!,
        level: "error",
        message: `duplicate meta description also used by: ${fileList.slice(1).join(", ")}`,
      });
    }
  }

  // Broken relatedArticles links + inbound-link graph for orphan detection
  const allHrefs = new Set(parsed.map((a) => a.href));
  const inboundLinks = new Map<string, Set<string>>();
  function addInbound(from: string, to: string) {
    if (!inboundLinks.has(to)) inboundLinks.set(to, new Set());
    inboundLinks.get(to)!.add(from);
  }

  for (const article of parsed) {
    for (const related of article.fm.relatedArticles) {
      if (!allHrefs.has(related)) {
        issues.push({
          file: article.file,
          level: "error",
          message: `relatedArticles entry "${related}" does not match any article's computed URL`,
        });
      } else {
        addInbound(article.href, related);
      }
    }
  }

  // Broken internal links inside MDX body content
  const knownPaths = buildKnownPaths(Array.from(allHrefs));
  for (const article of parsed) {
    for (const link of extractInternalLinks(article.body)) {
      if (!knownPaths.has(link)) {
        issues.push({
          file: article.file,
          level: "error",
          message: `body content links to "${link}", which doesn't match any known site route`,
        });
      } else if (allHrefs.has(link)) {
        addInbound(article.href, link);
      }
    }
  }

  // Orphan detection — articles with zero inbound links from other articles.
  // Hub/category pages always list every article automatically, so this
  // isn't about pages being unreachable — it's about weak topic-cluster
  // linking between articles, which is worth flagging and fixing.
  for (const article of parsed) {
    const inbound = inboundLinks.get(article.href);
    if (!inbound || inbound.size === 0) {
      issues.push({
        file: article.file,
        level: "warning",
        message: `orphan: no other article links to "${article.href}" via relatedArticles or body content — it's only discoverable through hub/category listings`,
      });
    }
  }

  const errors = issues.filter((i) => i.level === "error");
  const warnings = issues.filter((i) => i.level === "warning");

  console.log(`Checked ${files.length} content file(s).\n`);

  if (warnings.length) {
    console.log(`⚠ ${warnings.length} warning(s):`);
    for (const w of warnings) console.log(`  ${w.file} — ${w.message}`);
    console.log("");
  }

  if (errors.length) {
    console.error(`✖ ${errors.length} error(s):`);
    for (const e of errors) console.error(`  ${e.file} — ${e.message}`);
    process.exit(1);
  }

  console.log("✔ No content errors found.");
}

main();
