# HomeSolveAtlas

**Practical solutions for everyday home problems.**

Production: **https://homesolveatlas.com**

HomeSolveAtlas is a content site that helps people troubleshoot household appliances, remove stains,
fix moisture/mold problems, and plan home projects with free calculators. It's built with
Next.js (App Router), TypeScript, and Tailwind CSS, with content stored as MDX files — no
database required. The only revenue model is display advertising; there is no e-commerce,
affiliate linking, or paid membership anywhere in the codebase.

> ⚠️ **Legal pages are starting templates, not legal advice.** `/privacy-policy`,
> `/terms-of-use`, `/cookie-policy`, and `/disclaimer` are structurally complete but must be
> reviewed (and likely adapted for your jurisdiction) by a qualified professional before this
> site goes live. See the "Before you launch" checklist at the bottom of this file.

---

## Tech stack

| Layer | Choice |
|---|---|
| Framework | Next.js 16 (App Router, Server Components, ISR-ready) |
| Language | TypeScript (strict mode) |
| Styling | Tailwind CSS v4 |
| Content | MDX files in `content/`, parsed with `gray-matter`, rendered with `next-mdx-remote/rsc` |
| Validation | Zod (content frontmatter + calculator inputs) |
| Icons | lucide-react |
| Tests | Vitest |
| Lint/Format | ESLint (flat config) + Prettier |

No database, no CMS, no server-side state beyond what's in the filesystem. Pages are statically
generated at build time wherever possible.

---

## Getting started

```bash
npm install
npm run dev
```

Visit `http://localhost:3000`. The site works out of the box with zero environment variables —
copy `.env.example` to `.env.local` and fill in values only when you're ready to wire up
Search Console, Analytics, or AdSense (see below).

### Other scripts

```bash
npm run build             # production build
npm run start              # serve the production build
npm run lint                # ESLint
npm run typecheck          # tsc --noEmit
npm run format               # Prettier --write
npm run test                  # run the Vitest suite once
npm run test:watch          # Vitest in watch mode
npm run validate-content  # check every content file for structural problems
npm run validate-production  # scan the built output for stray localhost/TODO strings
npm run indexnow -- <url...>  # manually submit URL(s) to IndexNow — see "INDEXNOW / BING" below
npm run indexnow:changed      # submit only content changed since the last commit
```

---

## Project structure

```
app/                    Routes (App Router) — pages, layouts, sitemap.ts, robots.ts, rss.xml
proxy.ts                Serves the IndexNow key file at /{INDEXNOW_KEY}.txt — see "INDEXNOW / BING"
components/
  ads/                    AdSlot (placeholder ad component), MobileStickyAd
  articles/               ArticleLayout, ArticleCard, TOC, FAQ accordion, related guides
  calculators/            8 calculators + shared form fields, CalculatorShell, URL-state hook
  layout/                 Header, Footer, MobileMenu, Breadcrumbs, CookieConsent, Analytics
  search/                 SearchBox, FilterForm
  ui/                     Button, Card, Badge, Callout, Container (design-system primitives)
  seo/                    JsonLd renderer
  legal/                  LegalLayout wrapper for policy pages
content/
  articles/               All MDX articles, organized in folders by category (routing is
                           computed from frontmatter, not folder location — see below)
lib/
  content/                Content loading, Zod schema, queries (filter/search/related), MDX render
  calculators/            Pure calculation functions + Zod schemas, one file per calculator
  seo/                    Metadata builder, JSON-LD schema builders, IndexNow (indexnow.ts, publicUrls.ts)
  consent/                Cookie-consent store (useSyncExternalStore-based)
  utils/                  cn(), slugify(), date formatting
config/
  site.ts                 Site name, tagline, URL, contact email — see "Rebranding" below
  nav.ts                    Header/footer navigation structure
  taxonomy.ts             Categories, subcategories, brands, rooms
  calculators.ts          Calculator registry (title/description/slug)
  ads.ts                    Ad network configuration — see "Adding real ad code" below
scripts/
  validate-content.ts    Content QA script (see below)
  validate-production.ts Scans built .next output for stray localhost/example.com/old-brand
                          strings and source for TODO/FIXME — a pre-deploy gate
  indexnow.ts             IndexNow submission CLI — see "INDEXNOW / BING" below
tests/                    Vitest tests, mirrors lib/ structure
```

---

## Content system

### How articles are stored

Every article is a single `.mdx` file under `content/articles/<category>/*.mdx`. The folder
you put a file in is just for your own organization — **the file's frontmatter determines its
real URL**, computed by `lib/content/routing.ts`:

| `category` | URL pattern |
|---|---|
| `appliances` | `/appliances/{subcategory}/{slug}` |
| `error-codes` | `/error-codes/{brand}/{slug}` |
| `cleaning` | `/cleaning/{slug}` |
| `maintenance` | `/maintenance/{slug}` |
| `heating-cooling` | `/heating-cooling/{slug}` |

### How to add a new article

1. Copy an existing `.mdx` file in `content/articles/` that's in the same category as a
   starting point (its frontmatter shape is the contract).
2. Fill in every frontmatter field — `title`, `slug`, `description`, `category`, the
   category-specific field (`subcategory`, `brand`, or neither), `publishedAt`/`updatedAt`
   (`YYYY-MM-DD`), and the structured content sections: `quickAnswer`, `symptoms`, `causes`,
   `safeChecks`, `steps`, `dontDo`, `whenToCallPro`, `faqs`, `safetyWarning`.
   - `slugify()` in `lib/utils/slugify.ts` can generate a clean slug from your title if you're
     scripting article creation.
   - `relatedArticles` takes **full site paths** (e.g.
     `"/appliances/dishwashers/water-at-the-bottom"`), not bare slugs — this is what lets
     `getRelatedArticles()` resolve them precisely across categories. You don't have to fill
     this in by hand: leave it empty and the algorithmic fallback (same brand → same appliance
     → same subcategory → shared room → same category) fills related guides automatically.
3. Anything you type below the frontmatter fence is optional freeform MDX — useful for an
   extra intro paragraph or a link to a related calculator (see
   `content/articles/maintenance/how-much-paint-do-i-need-for-a-room.mdx` for an example).
4. Run `npm run validate-content` — it checks for missing/malformed frontmatter, duplicate
   URLs/titles/descriptions, bad dates, invalid category/subcategory/brand/room values, missing
   safety warnings on high-risk articles, broken `relatedArticles` and broken in-body links,
   **orphan articles** (nothing else links to it — see below), and thin content, with a
   file-level report.
5. That's it — `generateStaticParams()` in the matching `app/**/[slug]/page.tsx` picks up new
   files automatically on the next build. No route file, no manual registration.

**Avoid orphan pages.** `validate-content` flags any article that has zero inbound links from
*other* articles (via `relatedArticles` or a plain link in the MDX body) — hub/category pages
always list every article automatically, so this isn't about pages being unreachable, it's
about weak topic-cluster linking. When you add an article, add a link to it in at least one existing sibling's `relatedArticles`
(same appliance/brand/topic) — `getRelatedArticles()` also fills remaining related-guide slots
automatically by scoring shared brand/appliance/subcategory/room, so one or two good explicit
links plus that fallback usually clears the check.

Set `draft: true` on any article to keep working on it without it appearing anywhere on the
live site (it's excluded from listings, sitemap, and is `noindex` if visited directly).

### How to add a new category

Top-level categories (`Appliance Problems`, `Error Codes`, etc.) are intentionally not
plug-and-play — each one has a dedicated route tree in `app/` because URL structure differs
per category (see the table above). To add one:

1. Add it to `categories` in `config/taxonomy.ts`.
2. Create `app/<category>/page.tsx` (hub) and `app/<category>/[slug]/page.tsx` (article),
   modeled on `app/cleaning/` (flat URLs) or `app/appliances/` (nested under a subcategory).
3. Add the category to `getArticleHref()` in `lib/content/routing.ts`.
4. Add it to `app/sitemap.ts` and the header/footer nav in `config/nav.ts`.

### How to add a new subcategory (e.g. a new appliance type)

Add an entry to the relevant array in `config/taxonomy.ts` (`applianceTypes`,
`cleaningTypes`, `maintenanceTypes`, or `heatingCoolingTypes`). Hub pages, filters, and
breadcrumbs pick it up automatically — no route changes needed.

### How to add a new brand

Add an entry to the `brands` array in `config/taxonomy.ts`. The `/error-codes/{brand}` hub
page, filters, and homepage brand list all pick it up automatically via
`generateStaticParams()`. A brand with zero articles still gets a page (with a friendly empty
state) but is automatically `noindex`ed until it has content.

### How to add a new calculator

1. Add a pure calculation module in `lib/calculators/your-calculator.ts` — export a Zod input
   schema, a `calculate()` function, and a formula-explanation string. Keep it framework-free
   so it's easy to unit test (see `tests/calculators/` for the pattern).
2. Build a small client component in `components/calculators/YourCalculator.tsx` using the
   shared `NumberField`/`SelectField`/`UnitToggle`/`ResultStat` primitives in
   `components/calculators/fields.tsx` and the `useCalculatorUrlState` hook (persists inputs to
   the URL query string so results are shareable).
3. Add a page at `app/calculators/your-calculator/page.tsx` using `<CalculatorShell>`, following
   any existing calculator page as a template.
4. Register it in `config/calculators.ts` so it appears on `/calculators` and the homepage.
5. Add unit tests for the calculation module.

---

## Ads

### Current state

Every ad position on the site renders `<AdSlot placement="..." />`
(`components/ads/AdSlot.tsx`) — a placeholder box with a **fixed, reserved size** (no CLS),
lazy-loaded via `IntersectionObserver`, and gated behind the visitor's cookie consent choice.
**No ad network script is loaded anywhere right now.** Placements already wired into the
layout: header banner, in-article top/35%/70%/end, desktop sidebar, and mobile sticky footer
(on article pages).

**Ad density scales with content length**, via `getArticleAdPlan()` in
`components/ads/adDensity.ts`: articles under ~350 words show only the top + end ad; ~350–700
words adds the 35%-mark ad, sidebar, and mobile-sticky; 700+ words gets the full set including
the 70%-mark ad. A short troubleshooting note never gets buried in as many ads as a long guide.

### How to add real ad code (e.g. Google AdSense)

1. Set `NEXT_PUBLIC_ADSENSE_CLIENT_ID` in `.env.local`.
2. In `config/ads.ts`, set `enabled: true` and fill in each placement's real `slotId` from your
   AdSense dashboard.
3. In `components/ads/AdSlot.tsx`, replace the empty placeholder `<div>` in the `showRealAd`
   branch with your ad network's real markup (e.g. the AdSense `<ins class="adsbygoogle">` tag
   + its loader script).
4. Extend the Content-Security-Policy in `next.config.ts` (`script-src`, `frame-src`,
   `connect-src`) to allow your ad network's domains — the current CSP is intentionally strict
   and will block an unlisted ad script.

Ads only render for real once `adsConfig.enabled` is `true` **and** the visitor has accepted
the "Advertising" cookie category — this is enforced in `AdSlot.tsx`, not just documented.

---

## Rebranding

### How to change the site name and URL

Everything reads from `config/site.ts` — edit `name`, `tagline`, `description`, and
`contactEmail` there. The site's absolute URL comes from the `NEXT_PUBLIC_SITE_URL` environment
variable (see `.env.example`); set it in `.env.local` (or your host's env settings) before
deploying — it drives canonical URLs, Open Graph tags, the sitemap, and the RSS feed.

### How to change the logo

The current "logo" is a text wordmark + gradient icon square, defined in
`components/layout/Logo.tsx` (header) and `components/layout/Footer.tsx` (footer). To use an
image instead, drop the file in `public/` and replace the `<span>` icon block in both files with
a `next/image` `<Image>` component.

---

## SEO infrastructure

- **Metadata**: every page builds its `<title>`/description/canonical/OG/Twitter tags via
  `lib/seo/metadata.ts` — never hand-write `export const metadata` from scratch.
- **Structured data**: `lib/seo/schema.ts` builds Organization, WebSite+SearchAction,
  BreadcrumbList, Article, HowTo (only when an article has real `steps`), FAQPage (only when it
  has real `faqs`), and WebApplication (calculators) JSON-LD. Rendered via
  `components/seo/JsonLd.tsx`.
- **Sitemap**: `app/sitemap.ts` — a single sitemap covering the whole site (fine at this content
  volume; switch to `generateSitemaps()` for a sitemap index if the catalog grows large). Hub
  URLs below the indexability threshold (see below) are excluded from the sitemap entirely, not
  just `noindex`ed — submitting a noindexed URL in a sitemap is a contradictory signal.
- **Robots**: `app/robots.ts` — disallows `/search`, points to the sitemap.
- **RSS**: `app/rss.xml/route.ts` — latest 50 articles.
- **OG images**: `app/og/route.tsx` generates a branded Open Graph image on the fly
  (`next/og`'s `ImageResponse`) from a page's title + category, so every article, calculator,
  and hub gets a real social-share image with zero uploaded assets. `lib/seo/metadata.ts` wires
  it into every page's `openGraph.images`/`twitter.images` automatically.
- **Draft/noindex**: any article with `draft: true` is `noindex`ed and excluded from listings.
  Taxonomy hub pages (appliance subcategory, error-code brand, room) use a content threshold
  instead of just "zero articles": `HUB_INDEX_THRESHOLD` (currently 2) in
  `lib/content/queries.ts` — a hub needs at least that many articles before it's indexable and
  included in the sitemap. One article isn't enough to justify a dedicated landing page distinct
  from the article itself; below the threshold the hub still renders normally (with a friendly
  empty/thin state) so no link is ever broken, it's just kept out of search results until there's
  enough content to earn a ranking page.

### Google Search Console

1. Get the HTML-tag verification value from Search Console (just the `content="..."` token).
2. Set `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION` in `.env.local` — `app/layout.tsx` picks it up
   automatically via the `verification.google` metadata field.

### Google Analytics

1. Set `NEXT_PUBLIC_GA_MEASUREMENT_ID` in `.env.local`.
2. Nothing else to do — `components/layout/Analytics.tsx` is already mounted in the root layout
   and only loads the GA script once the visitor accepts the "Analytics" cookie category.

---

## INDEXNOW / BING

[IndexNow](https://www.indexnow.org/) lets the site push a URL directly to participating search
engines (Bing, and others sharing the same index) the moment it's published, updated, or removed,
instead of waiting for the next crawl. It's entirely server-side/CLI tooling — nothing here runs
in the browser, and it's **supplemental**: `sitemap.xml` (`app/sitemap.ts`) stays the complete,
authoritative list of the site's URLs. IndexNow submission does not guarantee or speed up
indexing; it only asks a search engine to take another look sooner.

### 1. Create an IndexNow key

Search engines don't issue this — you generate it yourself. Any random string works; a 32-char
hex string or UUID is the usual convention. One easy way:

```bash
node -e "console.log(require('crypto').randomUUID().replace(/-/g, ''))"
```

### 2. Add `INDEXNOW_KEY` in Vercel

Add it as an environment variable in the Vercel project (Settings → Environment Variables) —
**Production** (and Preview, if you also want preview deploys to serve the key file). It's a
plain server-side variable, deliberately **not** prefixed `NEXT_PUBLIC_`, so it's never bundled
into client JavaScript or visible to the browser. Also add it to `.env.local` for local testing —
see `.env.example`.

Everything IndexNow-related no-ops safely while `INDEXNOW_KEY` is unset: the verification route
isn't exposed, and `scripts/indexnow.ts` exits with a clear error instead of doing anything.

### 3. Verify the key URL

Once deployed with `INDEXNOW_KEY` set, the key is served as plain text at:

```
https://homesolveatlas.com/{INDEXNOW_KEY}.txt
```

e.g. if `INDEXNOW_KEY=abc123`, check `https://homesolveatlas.com/abc123.txt` returns `200` with
a body of exactly `abc123`. This is implemented in `proxy.ts` (Next.js's `middleware.ts`
convention, renamed in Next 16 — a single exact-pathname check; see the comment there for why
this needed Proxy rather than an App Router route)
using the pure, unit-tested `matchIndexNowKeyFile()` helper in `lib/seo/indexnow.ts`.

### 4. Manually submit a URL

```bash
npm run indexnow -- https://homesolveatlas.com/appliances/washing-machines/hums-but-wont-drain
```

Accepts multiple URLs at once. URLs must be `https://homesolveatlas.com/...` (localhost, Vercel
preview URLs, and other domains are rejected) and must already be part of the site's current
sitemap-eligible URL set — this rejects draft articles, taxonomy hubs below the indexing
threshold, and plain typos. If a page was intentionally removed and is no longer in the sitemap,
submit its removal instead, which skips that sitemap-membership check:

```bash
npm run indexnow -- --delete https://homesolveatlas.com/appliances/dryers/old-removed-page
```

The script prints exactly which URLs it's about to submit, then reports whether IndexNow
*accepted the submission* — it never claims a URL was indexed, only that the request was sent.
To avoid spamming the API, a URL that was already submitted (successfully) in the last 24 hours
is skipped on the next run unless you pass `--force`. This is tracked in a local,
`.gitignore`d `.indexnow-submissions.json` — safe to delete any time, it's a cooldown cache, not
a source of truth.

### 5. Submit newly changed content

Rather than resubmitting the entire sitemap on every deploy (which IndexNow explicitly asks
integrators not to do), submit only what actually changed:

```bash
npm run indexnow:changed
# equivalent to: npm run indexnow -- --changed

# or diff against a specific point instead of the previous commit:
npm run indexnow -- --changed --since=<git-ref>
```

This runs `git diff` over `content/articles/` between the given ref (default `HEAD~1`) and the
working tree, maps each changed `.mdx` file to its canonical public URL via the same
`getArticleHref()` the site itself uses, and:

- submits added/modified articles (and their published, sitemap-eligible taxonomy hub, e.g. the
  `/appliances/dishwashers` hub when a dishwasher article changes — its listing changed too) as
  `"update"` events,
- submits deleted articles (read from git history via `git show <ref>:<path>` so the URL can
  still be computed after the file is gone) as `"delete"` events.

Wire this into CI/CD (e.g. a Vercel deploy hook or GitHub Action step running
`npm run indexnow:changed` after a successful deploy) if you want it fully automatic — it wasn't
added as a Vercel build-time step here, since build environments don't reliably have the
previous deployment's git ref available and a bad build shouldn't block or spam a submission.

### 6. One-time full-site submission

For an initial bulk notification (e.g. right after this feature goes live, so IndexNow-aware
engines learn about everything that's already published, not just what changes from here on):

```bash
npm run indexnow -- --all
npm run indexnow -- --all --force   # bypass the 24h cooldown too
```

`--all` collects every currently sitemap-eligible URL via
`getAllSitemapEligibleUrls()` in `lib/seo/indexnow.ts` — built directly from the same
`getPublicUrlPaths()` function `app/sitemap.ts`'s own filters mirror (see
`lib/seo/publicUrls.ts`), so this can never drift into a second, hand-maintained URL list. It
prints how many eligible URLs it found, then runs through the same validation, deduplication,
24-hour cooldown, and batching as every other submission mode — `--all` on its own **does not**
bypass the cooldown; add `--force` explicitly if you want that. URLs are sent in
IndexNow-compatible batches (max 10,000 per request — the whole site fits in one request today).
Don't run this on every deploy; use `npm run indexnow:changed` for that instead.

### 7. Check submissions in Bing Webmaster Tools

1. Add `https://homesolveatlas.com` as a property in
   [Bing Webmaster Tools](https://www.bing.com/webmasters).
2. Verify ownership — Bing's XML/meta-tag method reuses the same
   `NEXT_PUBLIC_BING_SITE_VERIFICATION` variable already wired into `app/layout.tsx`'s
   `verification.other["msvalidate.01"]` metadata field (set it, redeploy, done — no code change
   needed). This is independent of IndexNow and doesn't touch Google Search Console's own
   verification.
3. Bing Webmaster Tools → **IndexNow** in the sidebar shows recently submitted URLs and their
   crawl status once Bing has processed them (not instant).

### Reference

- `lib/seo/indexnow.ts` — key handling, URL validation, payload building, submission.
- `lib/seo/publicUrls.ts` — the shared "is this URL actually public" check (mirrors
  `app/sitemap.ts`'s own filters).
- `scripts/indexnow.ts` — the CLI.
- `proxy.ts` — the `/{key}.txt` verification route.
- `tests/seo/indexnow.test.ts`, `tests/seo/publicUrls.test.ts` — no test ever makes a real
  network request; `submitToIndexNow()` takes an injectable `fetchImpl` for exactly this reason.

---

## Cookie consent

`components/layout/CookieConsent.tsx` shows a banner (Accept all / Reject non-essential /
Customize) until the visitor makes a choice, storing the decision in `localStorage`. The
decision is exposed reactively to the rest of the app via `useConsent()`
(`lib/consent/useConsent.ts`, backed by `useSyncExternalStore` so it updates instantly across
components without prop-drilling). Both `AdSlot` and `Analytics` check this before loading
anything.

---

## Contact form

`components/ContactForm.tsx` has no backend — it builds a pre-filled `mailto:` link and opens
the visitor's own email client, which works with zero server infrastructure. It includes a
hidden honeypot field as basic spam-protection scaffolding.

### How to connect it to a real email service instead

Replace the `mailto:` logic in `handleSubmit` with a `fetch()` call to a new API route (e.g.
`app/api/contact/route.ts`) that forwards to a provider like Resend, Postmark, or a serverless
form backend — keep the honeypot check server-side too once you do this, not just client-side.

Until `NEXT_PUBLIC_CONTACT_EMAIL` is set, the form and the "prefer email directly?" card on
`/contact` both show an honest "not yet available" state instead of a fake or non-functional
mailto: link — no address is invented anywhere in the codebase.

---

## ads.txt

`app/ads.txt/route.ts` serves `/ads.txt`. It ships as a comment-only (inert, valid) file until
a real ad network account exists — set `ADS_TXT_ENTRIES` in the environment to the exact line(s)
your network gives you (e.g. AdSense's `google.com, pub-XXXXXXXXXXXXXXXX, DIRECT, f08c47fec0942fa0`)
and the route picks it up automatically, no code change needed.

---

## Testing

```bash
npm run test
```

Covers: unit conversions, all calculator formulas with real numeric assertions, slug
generation, metadata generation, content filtering, search relevance ranking, and related-article
selection (both the explicit-links and signal-based-scoring paths). All tests run against the
real content in `content/articles/`, so they double as a light integration check.

---

## Deploying

The app is a standard Next.js app — deploy it anywhere Next.js runs (Vercel, Netlify, a Node
server, Docker). No database or external services are required for the site to function.
`NEXT_PUBLIC_SITE_URL` is optional but recommended: if it's unset, a production build
(`NODE_ENV=production`) safely falls back to `https://homesolveatlas.com` on its own (see
`config/site.ts`) rather than ever shipping a `localhost` URL in metadata.

```bash
npm run build
npm run start
```

After building, `npm run validate-production` scans the actual rendered HTML/XML/TXT output
(not source) for stray `localhost`, `example.com`, or old-brand-name strings, and greps the
source tree for leftover `TODO`/`FIXME` — run it as a pre-deploy gate.

**Canonical host & www redirect**: `homesolveatlas.com` (no www) is canonical.
`next.config.ts` includes an application-level 301 redirect from
`www.homesolveatlas.com/*` to `homesolveatlas.com/*` (preserving path + query) as a safety net;
Vercel's own domain settings should also be configured to do this at the edge — see "NEXT: PUT
HOMESOLVEATLAS.COM LIVE" delivered alongside this README for the exact dashboard steps.

---

## Before you launch

- [ ] Have a qualified professional review `/privacy-policy`, `/terms-of-use`,
      `/cookie-policy`, and `/disclaimer` — they're structurally complete starting templates,
      not legal advice, and haven't been customized for any specific jurisdiction.
- [ ] Set `NEXT_PUBLIC_SITE_URL=https://homesolveatlas.com` in Vercel's project environment
      variables (recommended even though a production build falls back to it automatically).
- [ ] Set `NEXT_PUBLIC_CONTACT_EMAIL` once a real, monitored inbox exists — until then the
      Contact page and legal pages correctly show a "not yet available" state, not a fake address.
- [ ] Decide on real ad code (see "Ads" above) — the site ships with placeholders only, disabled.
- [ ] Set `ADS_TXT_ENTRIES` once you have a real ad network account (see "ads.txt" above).
- [ ] Set `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION` once you've added the property in Search Console.
- [ ] Set `NEXT_PUBLIC_GA_MEASUREMENT_ID` once you have a GA4 property (loads only after
      consent — see "Cookie consent" above).
- [ ] Fill in `siteConfig.social` links in `config/site.ts` if you have social accounts, or
      leave them blank (they're simply omitted, not shown broken).
- [ ] Consider replacing the `mailto:`-based contact form with a real backend (see "Contact
      form" above) if you expect meaningful volume.
- [ ] Run `npm run validate-content`, `npm run test`, `npm run lint`, `npm run typecheck`,
      `npm run build`, and `npm run validate-production` one more time before deploying.

---

## Known gaps / honest limitations

- **Content volume**: 50 articles ship across 5 categories. All 9 appliance subcategories, all
  8 rooms, and 6 of 10 error-code brands clear the indexability threshold. The remaining 4
  brands (Frigidaire, Electrolux, KitchenAid, Hotpoint) have working, correctly `noindex`ed hub
  pages ready to receive content — left unwritten rather than padded with thin, repetitive
  filler, per the "quality over quantity" requirement. See a session's final report for the
  highest-priority next clusters.
- **Featured images**: every article/hub/calculator gets a generated visual — an inline-SVG
  gradient tile with a topic icon (`components/media/ArticleThumb.tsx`,
  `lib/media/visuals.ts`) used as the card thumbnail and article banner, plus a dynamically
  generated Open Graph share image (`app/og/route.tsx`). No uploaded photography is used
  anywhere. The `featuredImage` frontmatter field still exists for a real photo to override
  this later; no article currently sets it.
- **Lighthouse (mobile, production build)**, homepage/article/error-code/category pages all
  score Performance 97–98, Accessibility 100, Best Practices 96–100, SEO 100. The Paint
  Calculator scores Performance 98, Accessibility 100, Best Practices 96, SEO 100. `/search`
  scores SEO 66 **by design** — it's intentionally `noindex`ed (a query-driven internal search
  page shouldn't be a search-landing page itself), and Lighthouse's SEO category penalizes any
  noindexed page heavily regardless of every other signal being clean; don't "fix" this by
  removing the noindex.
- **`next-mdx-remote`, Next.js 16, and Tailwind v4 are very recent releases.** They were chosen
  because they were the current stable versions at the time of writing; keep an eye on their
  changelogs when upgrading dependencies.
