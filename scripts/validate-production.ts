/**
 * Production-output sanity check.
 *
 * Run with: npm run validate-production
 * (after `npm run build` — it scans the built `.next` output, not source.)
 *
 * Scans every prerendered HTML page plus the text feeds (robots.txt,
 * sitemap.xml, rss.xml) — i.e. exactly what a browser or search-engine
 * crawler actually receives — for strings that must never reach a real
 * visitor: localhost/127.0.0.1 URLs, example.com, and the project's old
 * placeholder brand name.
 *
 * Deliberately scoped to rendered HTML/XML/TXT output, NOT the JS bundles:
 * minified vendor code (Next.js/React/Zod internals) legitimately contains
 * incidental matches for these same substrings (doc comments, polyfills,
 * error-message templates) that are never shown to anyone — flagging those
 * would just be noise. Source-code TODO/FIXME comments are checked
 * separately by grepping `app/`, `components/`, `lib/`, `config/`, and
 * `content/` directly (see the repo-wide check this script also runs).
 */
import fs from "node:fs";
import path from "node:path";

const NEXT_DIR = path.join(process.cwd(), ".next");
const RENDERED_OUTPUT_EXTENSIONS = new Set([".html", ".xml", ".txt"]);
const SOURCE_DIRS = ["app", "components", "lib", "config", "content", "scripts"];
const SOURCE_EXTENSIONS = new Set([".ts", ".tsx", ".mdx", ".md"]);

const FORBIDDEN_IN_OUTPUT: { pattern: RegExp; label: string }[] = [
  { pattern: /localhost/gi, label: "localhost reference" },
  { pattern: /127\.0\.0\.1/g, label: "127.0.0.1 reference" },
  { pattern: /\bexample\.(com|org|net)\b/gi, label: "example.com placeholder domain" },
  { pattern: /fixnest/gi, label: "old brand name (FixNest)" },
];

function listFiles(dir: string, extensions: Set<string>, skipDirs: Set<string> = new Set()): string[] {
  if (!fs.existsSync(dir)) return [];
  const out: string[] = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (skipDirs.has(entry.name)) continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...listFiles(full, extensions, skipDirs));
    else if (extensions.has(path.extname(entry.name))) out.push(full);
  }
  return out;
}

function checkRenderedOutput(): number {
  const files = listFiles(NEXT_DIR, RENDERED_OUTPUT_EXTENSIONS, new Set(["cache"]));
  let issues = 0;

  for (const file of files) {
    const relFile = path.relative(process.cwd(), file);
    const content = fs.readFileSync(file, "utf-8");

    for (const { pattern, label } of FORBIDDEN_IN_OUTPUT) {
      const matches = content.match(pattern);
      if (matches) {
        issues += 1;
        console.error(`✖ ${relFile} — ${label} (${matches.length}x)`);
      }
    }
  }

  console.log(`Scanned ${files.length} rendered HTML/XML/TXT output file(s).`);
  return issues;
}

function checkSourceForTodos(): number {
  let issues = 0;
  const pattern = /\bTODO\b|\bFIXME\b/g;

  const selfPath = path.relative(process.cwd(), __filename);

  for (const dir of SOURCE_DIRS) {
    const files = listFiles(path.join(process.cwd(), dir), SOURCE_EXTENSIONS);
    for (const file of files) {
      const relFile = path.relative(process.cwd(), file);
      if (relFile === selfPath) continue; // this file legitimately mentions TODO/FIXME by name
      const content = fs.readFileSync(file, "utf-8");
      const matches = content.match(pattern);
      if (matches) {
        issues += 1;
        console.error(`✖ ${relFile} — unresolved TODO/FIXME (${matches.length}x)`);
      }
    }
  }

  return issues;
}

function main() {
  if (!fs.existsSync(NEXT_DIR)) {
    console.error(`No .next build output found. Run "npm run build" first, then re-run this check.`);
    process.exit(1);
  }

  const outputIssues = checkRenderedOutput();
  const todoIssues = checkSourceForTodos();
  const total = outputIssues + todoIssues;

  if (total > 0) {
    console.error(`\n✖ ${total} issue(s) found. Fix before deploying.`);
    process.exit(1);
  }

  console.log("✔ No forbidden strings found in production output, and no TODO/FIXME left in source.");
}

main();
