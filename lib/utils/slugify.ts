/**
 * Converts a title into a clean, URL-safe, kebab-case slug. Used when
 * drafting new content — see README.md → "How to add a new article".
 */

// Combining Diacritical Marks block (U+0300-U+036F), built from char codes
// rather than a literal in source so the file stays plain ASCII and diff-safe.
const COMBINING_DIACRITICS = new RegExp(
  "[" + String.fromCharCode(0x0300) + "-" + String.fromCharCode(0x036f) + "]",
  "g",
);

export function slugify(input: string): string {
  return input
    .normalize("NFKD")
    .replace(COMBINING_DIACRITICS, "") // strip accents
    .toLowerCase()
    .replace(/'/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .replace(/-{2,}/g, "-");
}
