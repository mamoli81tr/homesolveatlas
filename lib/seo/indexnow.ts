import { getPublicUrlPaths, getPublicUrlPathSet } from "./publicUrls";

/**
 * IndexNow support (https://www.indexnow.org/documentation).
 *
 * Notifies IndexNow-compatible search engines (Bing, and others that share
 * the same index) that a URL was added, changed, or removed, instead of
 * waiting for the next crawl. This is entirely server-side/CLI tooling —
 * nothing here runs in the browser, and INDEXNOW_KEY is a plain (not
 * NEXT_PUBLIC_) environment variable so it's never bundled client-side.
 *
 * IndexNow is supplemental discovery, not the source of truth — sitemap.xml
 * (app/sitemap.ts) remains the complete, authoritative URL list. See
 * lib/seo/publicUrls.ts for the shared "is this URL actually public" check
 * used below.
 */

export const INDEXNOW_ENDPOINT = "https://api.indexnow.org/indexnow";

// Hardcoded rather than derived from config/site.ts's env-resolved
// siteConfig.domain: IndexNow submissions must only ever reference the real
// production host, even if this code is somehow run with
// NEXT_PUBLIC_SITE_URL pointed elsewhere (a preview deploy, a local .env).
// Matches the PRODUCTION_URL constant in config/site.ts.
export const INDEXNOW_HOST = "homesolveatlas.com";

export type IndexNowEvent = "update" | "delete";

/** Reads INDEXNOW_KEY from the environment. Never expose this as NEXT_PUBLIC_*. */
export function getIndexNowKey(): string | undefined {
  const key = process.env.INDEXNOW_KEY?.trim();
  return key ? key : undefined;
}

export function isIndexNowConfigured(): boolean {
  return Boolean(getIndexNowKey());
}

export function getIndexNowKeyLocation(key: string): string {
  return `https://${INDEXNOW_HOST}/${key}.txt`;
}

/**
 * Pure helper behind the /{INDEXNOW_KEY}.txt verification route
 * (see proxy.ts). Returns the response body when `pathname` is exactly
 * the configured key's file, otherwise null (route not exposed/not matched).
 * Kept as a pure function so it's unit-testable without a real request.
 */
export function matchIndexNowKeyFile(pathname: string, key: string | undefined): string | null {
  if (!key) return null;
  return pathname === `/${key}.txt` ? key : null;
}

export interface UrlValidationResult {
  ok: boolean;
  /** Normalized https://homesolveatlas.com URL, present when ok is true. */
  url?: string;
  reason?: string;
}

/**
 * Validates a URL for IndexNow submission.
 *
 * - Must be a well-formed absolute URL.
 * - Must be https:// on the real production host (rejects localhost,
 *   Vercel preview URLs, and any external domain).
 * - Rejects the internal /search route (disallowed in robots.txt).
 * - For "update" events, the path must be part of the site's current
 *   sitemap-eligible URL set — this rejects draft content, taxonomy hubs
 *   below the indexing threshold, and plain typos.
 * - "delete" events skip that sitemap-membership check, since a URL being
 *   removed has by definition already left the sitemap — it still must be
 *   a valid, same-host, non-/search URL.
 */
export function validateIndexNowUrl(
  rawUrl: string,
  event: IndexNowEvent = "update",
): UrlValidationResult {
  const trimmed = rawUrl.trim();
  if (!trimmed) {
    return { ok: false, reason: "Empty URL" };
  }

  let parsed: URL;
  try {
    parsed = new URL(trimmed);
  } catch {
    return { ok: false, reason: `Not a valid absolute URL: "${trimmed}"` };
  }

  if (parsed.protocol !== "https:") {
    return {
      ok: false,
      reason: `Must use https:// — got "${parsed.protocol}//" for "${trimmed}"`,
    };
  }

  if (parsed.hostname !== INDEXNOW_HOST) {
    return {
      ok: false,
      reason: `Host must be ${INDEXNOW_HOST} — got "${parsed.hostname}" (localhost, Vercel preview URLs, and other domains are rejected)`,
    };
  }

  const path = parsed.pathname.replace(/\/+$/, "") || "/";

  if (path === "/search" || path.startsWith("/search/")) {
    return { ok: false, reason: `"${path}" is the internal search route — excluded from IndexNow` };
  }

  if (event === "update" && !getPublicUrlPathSet().has(path)) {
    return {
      ok: false,
      reason: `"${path}" is not in the current sitemap-eligible URL set (draft content, a noindexed hub, or an unknown page) — submit with event "delete" if this URL was intentionally removed`,
    };
  }

  return { ok: true, url: `https://${INDEXNOW_HOST}${path}` };
}

export function dedupeUrls(urls: string[]): string[] {
  return Array.from(new Set(urls));
}

/**
 * Every currently sitemap-eligible URL on the site, as absolute
 * https://homesolveatlas.com URLs, deduplicated. Backs the CLI's `--all`
 * one-time full-site submission mode.
 *
 * Deliberately built from `getPublicUrlPaths()` — the exact same function
 * app/sitemap.ts's own filters are mirrored from (see lib/seo/publicUrls.ts)
 * — rather than a second hand-maintained URL list, so `--all` and the
 * sitemap can't drift apart. Every entry here also passes
 * `validateIndexNowUrl()` by construction (same-host, not /search, and — by
 * definition — already in the sitemap-eligible set).
 */
export function getAllSitemapEligibleUrls(): string[] {
  return dedupeUrls(getPublicUrlPaths().map((path) => `https://${INDEXNOW_HOST}${path}`));
}

export interface IndexNowPayload {
  host: string;
  key: string;
  keyLocation: string;
  urlList: string[];
}

export function buildIndexNowPayload(urls: string[], key: string): IndexNowPayload {
  return {
    host: INDEXNOW_HOST,
    key,
    keyLocation: getIndexNowKeyLocation(key),
    urlList: dedupeUrls(urls),
  };
}

export interface SubmitIndexNowOptions {
  event?: IndexNowEvent;
  /** Injectable for tests — defaults to the global fetch. Never called in tests. */
  fetchImpl?: typeof fetch;
}

export interface SubmitIndexNowResult {
  /** Normalized URLs that passed validation and were included in the request. */
  submitted: string[];
  /** Raw input URLs that failed validation, with the reason why. */
  rejected: Array<{ url: string; reason: string }>;
  /** Present once a request was actually sent. */
  response?: { status: number; ok: boolean };
  /** Set when nothing was sent at all (missing key, network failure, all URLs rejected pre-flight isn't an error — see `rejected`). */
  error?: string;
}

/**
 * Validates, dedupes, and submits URLs to IndexNow in a single bulk request.
 * Does not throw — callers (the CLI script, future automation) should check
 * `error` / `response.ok` rather than wrapping this in try/catch for control
 * flow. Never claims a URL was "indexed" — only that submission was sent.
 */
export async function submitToIndexNow(
  rawUrls: string[],
  options: SubmitIndexNowOptions = {},
): Promise<SubmitIndexNowResult> {
  const key = getIndexNowKey();
  const rejected: Array<{ url: string; reason: string }> = [];

  if (!key) {
    return { submitted: [], rejected, error: "INDEXNOW_KEY is not set in the environment" };
  }

  const event = options.event ?? "update";
  const valid: string[] = [];

  for (const raw of dedupeUrls(rawUrls)) {
    const result = validateIndexNowUrl(raw, event);
    if (result.ok && result.url) {
      valid.push(result.url);
    } else {
      rejected.push({ url: raw, reason: result.reason ?? "Invalid URL" });
    }
  }

  const submitted = dedupeUrls(valid);
  if (submitted.length === 0) {
    return { submitted: [], rejected };
  }

  const payload = buildIndexNowPayload(submitted, key);
  const doFetch = options.fetchImpl ?? fetch;

  try {
    const res = await doFetch(INDEXNOW_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json; charset=utf-8" },
      body: JSON.stringify(payload),
    });
    return { submitted, rejected, response: { status: res.status, ok: res.ok } };
  } catch (err) {
    return {
      submitted: [],
      rejected,
      error: err instanceof Error ? `Network error: ${err.message}` : "Unknown network error",
    };
  }
}

// Avoids resubmitting the same URL+event on every deploy (or every --all
// run) when nothing about it actually changed. Not a correctness mechanism
// — a real change is never permanently blocked, just deferred to the next
// run past the cooldown, or immediately with --force.
export const INDEXNOW_COOLDOWN_MS = 24 * 60 * 60 * 1000;

/** The local submission-state key for a given event + URL — "event:url". */
export function indexNowStateKey(event: IndexNowEvent, url: string): string {
  return `${event}:${url}`;
}

export interface CooldownFilterResult {
  /** URLs to actually submit now. */
  toSubmit: string[];
  /** URLs skipped because they were already submitted (same event) within the cooldown window. */
  skipped: string[];
}

/**
 * Splits URLs into ones that should be (re)submitted vs. ones to skip
 * because they were already successfully submitted, for the same event,
 * within the cooldown window.
 *
 * `state` is a plain "event:url" -> ISO-timestamp map — exactly the shape
 * scripts/indexnow.ts persists to .indexnow-submissions.json — passed in
 * (rather than read from disk here) so this stays a pure, unit-testable
 * function with no filesystem access.
 */
export function filterByCooldown(
  urls: string[],
  event: IndexNowEvent,
  state: Record<string, string>,
  options: { force?: boolean; now?: number; cooldownMs?: number } = {},
): CooldownFilterResult {
  const force = options.force ?? false;
  const now = options.now ?? Date.now();
  const cooldownMs = options.cooldownMs ?? INDEXNOW_COOLDOWN_MS;

  const toSubmit: string[] = [];
  const skipped: string[] = [];

  for (const url of urls) {
    const last = state[indexNowStateKey(event, url)];
    if (!force && last && now - new Date(last).getTime() < cooldownMs) {
      skipped.push(url);
    } else {
      toSubmit.push(url);
    }
  }

  return { toSubmit, skipped };
}

// IndexNow's documented maximum URLs per bulk submission request. Chunking
// at this size means --all (or any other future bulk source) never sends
// one HTTP request per URL, and stays correct even if the site's URL count
// eventually grows past a single request's limit — at today's scale
// (~100-200 URLs) every run is still a single batch.
export const INDEXNOW_BATCH_SIZE = 10_000;

/** Splits `items` into chunks of at most `size`, preserving order. */
export function chunkUrls<T>(items: T[], size: number = INDEXNOW_BATCH_SIZE): T[][] {
  if (size <= 0) throw new Error("chunkUrls: size must be positive");
  const chunks: T[][] = [];
  for (let i = 0; i < items.length; i += size) {
    chunks.push(items.slice(i, i + size));
  }
  return chunks;
}
