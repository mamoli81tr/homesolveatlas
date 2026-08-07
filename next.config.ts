import type { NextConfig } from "next";

// Security headers applied to every response.
//
// NOTE on 'unsafe-inline': this is NOT a "just make it work" shortcut — it's
// scoped narrowly to what the app actually emits inline today:
//   - script-src: the JSON-LD <script type="application/ld+json"> blocks
//     rendered by components/seo/JsonLd.tsx on nearly every page, and (once
//     configured) next/script's inline GA bootstrap snippet in
//     components/layout/Analytics.tsx. Both are same-origin, non-executable
//     data or first-party init code, not third-party script injection.
//   - style-src: Tailwind's inline `style={{...}}` usage (AdSlot reserved
//     dimensions, the generated ArticleThumb gradients).
// Removing it would require a per-request nonce threaded through every
// layout — a real architecture change, intentionally out of scope here.
//
// EXTEND THIS when you enable real ad/analytics scripts (see config/ads.ts
// and .env.example) — nothing below is pre-opened for them:
//   Google Analytics (GA4):
//     script-src: + https://www.googletagmanager.com
//     connect-src: + https://www.google-analytics.com https://*.google-analytics.com
//   Google AdSense:
//     script-src: + https://pagead2.googlesyndication.com https://googleads.g.doubleclick.net
//     frame-src:  + https://googleads.g.doubleclick.net https://tpc.googlesyndication.com https://www.google.com
//     connect-src: + https://pagead2.googlesyndication.com
const contentSecurityPolicy = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline'",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: https:",
  "font-src 'self' data:",
  "connect-src 'self'",
  "frame-src 'self'",
  "base-uri 'self'",
  "form-action 'self'",
  "object-src 'none'",
].join("; ");

const securityHeaders = [
  { key: "X-Frame-Options", value: "DENY" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
  { key: "Content-Security-Policy", value: contentSecurityPolicy },
];

const nextConfig: NextConfig = {
  reactStrictMode: true,
  async headers() {
    return [
      {
        source: "/:path*",
        headers: securityHeaders,
      },
    ];
  },
  async redirects() {
    return [
      // Canonical host: www.homesolveatlas.com -> homesolveatlas.com,
      // preserving path and query string, 301 (permanent). Only matches
      // when the request's Host header is exactly the www subdomain, so
      // normal apex requests pass through untouched and this can't loop.
      //
      // This is an application-level safety net — Vercel's own domain
      // settings can (and should) do the same redirect at the edge before
      // it ever reaches this code; see README.md → "Connecting the domain"
      // for the exact dashboard steps. Having both is intentional
      // belt-and-suspenders, not redundant misconfiguration.
      {
        source: "/:path*",
        has: [{ type: "host", value: "www.homesolveatlas.com" }],
        destination: "https://homesolveatlas.com/:path*",
        permanent: true,
      },
      // Add permanent (301) redirects here whenever a published URL is
      // renamed or a piece of content is merged into another page, e.g.:
      // { source: "/old-path", destination: "/new-path", permanent: true }
    ];
  },
};

export default nextConfig;
