import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import readingTime from "reading-time";
import { articleFrontmatterSchema, type Article } from "./schema";
import { getArticleHref } from "./routing";

const CONTENT_DIR = path.join(process.cwd(), "content", "articles");

function listMdxFiles(dir: string): string[] {
  if (!fs.existsSync(dir)) return [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  const files: string[] = [];
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...listMdxFiles(fullPath));
    } else if (entry.isFile() && entry.name.endsWith(".mdx")) {
      files.push(fullPath);
    }
  }
  return files;
}

function loadArticle(filePath: string): Article {
  const raw = fs.readFileSync(filePath, "utf-8");
  const { data, content } = matter(raw);
  const sourcePath = path.relative(process.cwd(), filePath);

  const result = articleFrontmatterSchema.safeParse(data);
  if (!result.success) {
    const issues = result.error.issues
      .map((issue) => `  - ${issue.path.join(".")}: ${issue.message}`)
      .join("\n");
    throw new Error(`Invalid frontmatter in ${sourcePath}:\n${issues}`);
  }

  const frontmatter = result.data;
  const href = getArticleHref(frontmatter);

  const timeSourceText = [
    frontmatter.quickAnswer,
    ...frontmatter.symptoms,
    ...frontmatter.causes.map((c) => `${c.title} ${c.description}`),
    ...frontmatter.steps.map((s) => `${s.title} ${s.description}`),
    ...frontmatter.faqs.map((f) => `${f.q} ${f.a}`),
    content,
  ].join(" ");

  const { text: readingTimeLabel, words: wordCount } = readingTime(timeSourceText);

  return {
    frontmatter,
    content,
    sourcePath,
    readingTime: readingTimeLabel,
    wordCount,
    href,
  };
}

let cachedArticles: Article[] | null = null;

/** All articles, including drafts. Cached per server process / build. */
export function getAllArticlesRaw(): Article[] {
  if (cachedArticles) return cachedArticles;

  const files = listMdxFiles(CONTENT_DIR);
  const articles = files.map(loadArticle);

  const slugsSeen = new Map<string, string>();
  for (const article of articles) {
    const key = article.href;
    if (slugsSeen.has(key)) {
      throw new Error(
        `Duplicate article path "${key}" found in ${article.sourcePath} and ${slugsSeen.get(key)}`,
      );
    }
    slugsSeen.set(key, article.sourcePath);
  }

  articles.sort((a, b) =>
    a.frontmatter.publishedAt < b.frontmatter.publishedAt ? 1 : -1,
  );
  cachedArticles = articles;
  return articles;
}

/** Published (non-draft) articles only — use this everywhere pages render. */
export function getAllArticles(): Article[] {
  return getAllArticlesRaw().filter((a) => !a.frontmatter.draft);
}
