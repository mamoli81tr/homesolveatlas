/**
 * IndexNow submission CLI.
 *
 * Usage:
 *   npm run indexnow -- <url> [<url> ...]         Submit one or more explicit URLs
 *   npm run indexnow -- --delete <url> [<url>...] Submit as a removal event
 *   npm run indexnow -- --changed                 Submit URLs derived from article
 *                                                  content changed since HEAD~1
 *   npm run indexnow -- --changed --since=<ref>   Use a different base git ref
 *   npm run indexnow -- --force                   Bypass the local resubmission cooldown
 *   npm run indexnow:changed                      Shortcut for `--changed`
 *
 * Requires INDEXNOW_KEY to be set in the environment (see .env.example).
 * Never makes a real network request during tests — only invoked here, via
 * `npm run indexnow*`. See README.md → "INDEXNOW / BING" for full docs.
 */
import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";
import matter from "gray-matter";
import { articleFrontmatterSchema } from "../lib/content/schema";
import { getArticleHref } from "../lib/content/routing";
import { allSubcategories, brands } from "../config/taxonomy";
import { getPublicUrlPathSet } from "../lib/seo/publicUrls";
import {
  submitToIndexNow,
  getIndexNowKey,
  INDEXNOW_HOST,
  INDEXNOW_ENDPOINT,
  type IndexNowEvent,
} from "../lib/seo/indexnow";

const STATE_FILE = path.join(process.cwd(), ".indexnow-submissions.json");
// Avoids resubmitting the same URL+event on every deploy when nothing about
// it actually changed. Not a correctness mechanism (a real change is never
// blocked from being submitted eventually — the next run past the cooldown
// picks it up) — just spam avoidance, and safe to delete this file any time.
const COOLDOWN_MS = 24 * 60 * 60 * 1000;
const CONTENT_DIR = path.join("content", "articles");

type SubmissionState = Record<string, string>; // "event:url" -> ISO timestamp

function loadState(): SubmissionState {
  try {
    return JSON.parse(fs.readFileSync(STATE_FILE, "utf-8"));
  } catch {
    return {};
  }
}

function saveState(state: SubmissionState) {
  fs.writeFileSync(STATE_FILE, `${JSON.stringify(state, null, 2)}\n`, "utf-8");
}

function stateKey(event: IndexNowEvent, url: string): string {
  return `${event}:${url}`;
}

interface CliArgs {
  urls: string[];
  changed: boolean;
  since: string;
  force: boolean;
  event: IndexNowEvent;
}

function printHelp() {
  console.log(`
IndexNow submission CLI

  npm run indexnow -- <url> [<url> ...]         Submit one or more explicit URLs
  npm run indexnow -- --delete <url> [<url>...] Submit as a removal event
  npm run indexnow -- --changed                 Submit URLs derived from article
                                                 content changed since HEAD~1
  npm run indexnow -- --changed --since=<ref>   Use a different base git ref
  npm run indexnow -- --force                   Bypass the local resubmission cooldown

  npm run indexnow:changed                      Shortcut for --changed

URLs must be on https://${INDEXNOW_HOST} and (for regular submissions) must
already be part of the site's sitemap-eligible URL set.
`);
}

function parseArgs(argv: string[]): CliArgs {
  const urls: string[] = [];
  let changed = false;
  let since = "HEAD~1";
  let force = false;
  let event: IndexNowEvent = "update";

  for (const arg of argv) {
    if (arg === "--changed") changed = true;
    else if (arg.startsWith("--since=")) since = arg.slice("--since=".length);
    else if (arg === "--force") force = true;
    else if (arg === "--delete") event = "delete";
    else if (arg === "--help" || arg === "-h") {
      printHelp();
      process.exit(0);
    } else if (arg.startsWith("--")) {
      console.error(`Unknown flag: ${arg}`);
      printHelp();
      process.exit(1);
    } else {
      urls.push(arg);
    }
  }

  return { urls, changed, since, force, event };
}

/** Parses frontmatter from raw MDX text and returns its computed href, or null if invalid. */
function hrefFromMdxSource(raw: string): string | null {
  try {
    const { data } = matter(raw);
    const result = articleFrontmatterSchema.safeParse(data);
    if (!result.success || result.data.draft) return null;
    return getArticleHref(result.data);
  } catch {
    return null;
  }
}

/** The taxonomy hub page an article href belongs to, if any (and if it's a real, known hub). */
function hubHrefFor(href: string): string | null {
  const applianceMatch = href.match(/^\/appliances\/([^/]+)\//);
  if (applianceMatch) {
    const subcategory = applianceMatch[1];
    const known = allSubcategories.some(
      (s) => s.category === "appliances" && s.slug === subcategory,
    );
    return known ? `/appliances/${subcategory}` : null;
  }
  const errorCodeMatch = href.match(/^\/error-codes\/([^/]+)\//);
  if (errorCodeMatch) {
    const brand = errorCodeMatch[1];
    const known = brands.some((b) => b.slug === brand);
    return known ? `/error-codes/${brand}` : null;
  }
  return null;
}

interface ChangedContentUrls {
  updates: string[];
  deletes: string[];
}

/**
 * Diffs `content/articles` between `since` and the working tree/HEAD and
 * maps changed .mdx files to their canonical public URLs:
 *   - added/modified files -> "update" URLs (only if still sitemap-eligible —
 *     e.g. not draft, not below a hub's index threshold)
 *   - deleted files -> "delete" URLs, resolved by reading the file's last
 *     known content straight from git history via `git show <ref>:<path>`
 * Also includes each affected article's taxonomy hub page as an "update",
 * since that hub's listing content changed too — but only when the hub is
 * itself currently sitemap-eligible.
 */
function getChangedContentUrls(since: string): ChangedContentUrls {
  let diffOutput: string;
  try {
    diffOutput = execFileSync(
      "git",
      ["diff", "--name-status", "--no-renames", since, "--", CONTENT_DIR],
      { encoding: "utf-8", cwd: process.cwd() },
    );
  } catch (err) {
    console.error(`✖ Could not run "git diff" against "${since}": ${(err as Error).message}`);
    console.error(`  Make sure "${since}" is a valid git ref reachable from HEAD.`);
    process.exit(1);
  }

  const updates = new Set<string>();
  const deletes = new Set<string>();
  const publicPaths = getPublicUrlPathSet();
  const toUrl = (p: string) => `https://${INDEXNOW_HOST}${p}`;

  const addUpdate = (href: string) => {
    if (!publicPaths.has(href)) return;
    updates.add(toUrl(href));
    const hub = hubHrefFor(href);
    if (hub && publicPaths.has(hub)) updates.add(toUrl(hub));
  };

  const lines = diffOutput
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);

  for (const line of lines) {
    const [status, filePath] = line.split("\t");
    if (!status || !filePath || !filePath.endsWith(".mdx")) continue;

    if (status === "D") {
      let raw: string;
      try {
        raw = execFileSync("git", ["show", `${since}:${filePath}`], { encoding: "utf-8" });
      } catch {
        console.warn(`  (skipping ${filePath} — could not read its content as of "${since}")`);
        continue;
      }
      const href = hrefFromMdxSource(raw);
      if (href) deletes.add(toUrl(href));
      continue;
    }

    // Added (A) or modified (M) — read the current on-disk version.
    const fullPath = path.join(process.cwd(), filePath);
    if (!fs.existsSync(fullPath)) continue;
    const raw = fs.readFileSync(fullPath, "utf-8");
    const href = hrefFromMdxSource(raw);
    if (href) addUpdate(href);
  }

  return { updates: Array.from(updates), deletes: Array.from(deletes) };
}

async function runSubmission(urls: string[], event: IndexNowEvent, force: boolean) {
  if (urls.length === 0) return;

  const state = loadState();
  const now = Date.now();
  const toSubmit: string[] = [];
  const skipped: string[] = [];

  for (const url of urls) {
    const last = state[stateKey(event, url)];
    if (!force && last && now - new Date(last).getTime() < COOLDOWN_MS) {
      skipped.push(url);
    } else {
      toSubmit.push(url);
    }
  }

  if (skipped.length) {
    console.log(
      `Skipping ${skipped.length} URL(s) already submitted (${event}) within the last 24h — use --force to resubmit:`,
    );
    for (const u of skipped) console.log(`  - ${u}`);
  }

  if (toSubmit.length === 0) {
    console.log("Nothing new to submit.\n");
    return;
  }

  console.log(`\nSubmitting ${toSubmit.length} URL(s) as "${event}" to ${INDEXNOW_ENDPOINT}:`);
  for (const u of toSubmit) console.log(`  - ${u}`);

  const result = await submitToIndexNow(toSubmit, { event });

  if (result.rejected.length) {
    console.log(`\n${result.rejected.length} URL(s) rejected before submission:`);
    for (const r of result.rejected) console.log(`  - ${r.url} — ${r.reason}`);
  }

  if (result.error) {
    console.error(`\n✖ ${result.error}`);
    process.exitCode = 1;
    return;
  }

  if (!result.response) {
    console.log("\nNothing was sent (every URL was rejected before submission).");
    return;
  }

  if (result.response.ok) {
    console.log(
      `\n✔ Submission accepted by IndexNow (HTTP ${result.response.status}). This confirms the request was received — it does not guarantee or measure indexing.`,
    );
    const timestamp = new Date().toISOString();
    for (const u of result.submitted) state[stateKey(event, u)] = timestamp;
    saveState(state);
  } else {
    console.error(
      `\n✖ IndexNow responded with HTTP ${result.response.status} — submission was not accepted.`,
    );
    process.exitCode = 1;
  }
}

async function main() {
  const { urls, changed, since, force, event } = parseArgs(process.argv.slice(2));

  if (!getIndexNowKey()) {
    console.error(
      "✖ INDEXNOW_KEY is not set. Add it to .env.local (dev) or your hosting platform's environment variables (production), then re-run.",
    );
    console.error('  See README.md → "INDEXNOW / BING" for how to generate a key.');
    process.exit(1);
  }

  if (changed) {
    console.log(`Looking for article content changed since "${since}"...`);
    const { updates, deletes } = getChangedContentUrls(since);
    if (!updates.length && !deletes.length) {
      console.log("No changed, sitemap-eligible article content found.");
      return;
    }
    await runSubmission(updates, "update", force);
    await runSubmission(deletes, "delete", force);
    return;
  }

  if (urls.length === 0) {
    printHelp();
    process.exit(1);
  }

  await runSubmission(urls, event, force);
}

main().catch((err) => {
  console.error("✖ Unexpected error:", err instanceof Error ? err.message : err);
  process.exit(1);
});
