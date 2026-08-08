import { NextResponse, type NextRequest } from "next/server";
import { getIndexNowKey, matchIndexNowKeyFile } from "@/lib/seo/indexnow";

// lib/seo/indexnow.ts transitively imports the content loader (lib/content/
// loader.ts), which reads the filesystem with node:fs to build the
// sitemap-eligible URL set. That's fine here without any extra config:
// unlike the old middleware.ts convention (Edge runtime by default), Proxy
// always runs on the Node.js runtime, so no `export const runtime` is
// needed (Next.js rejects one — Proxy files can't override the runtime).

/**
 * Serves the IndexNow key verification file at /{INDEXNOW_KEY}.txt.
 *
 * A dynamic App Router segment (e.g. app/[key]/route.ts) can't be used for
 * this: since the key is only known at runtime via an env var, that segment
 * would match *every* unmatched single-segment path and take over the
 * site's 404 handling for typos and bad links. Proxy instead does one
 * cheap, exact pathname comparison and calls next() for everything else,
 * so normal routing (including app/not-found.tsx) is completely untouched.
 *
 * When INDEXNOW_KEY is unset, this route is not exposed at all — every
 * request just falls through to next().
 */
export function proxy(request: NextRequest) {
  const key = getIndexNowKey();
  const matched = matchIndexNowKeyFile(request.nextUrl.pathname, key);

  if (matched) {
    return new NextResponse(matched, {
      status: 200,
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Cache-Control": "public, max-age=3600",
      },
    });
  }

  return NextResponse.next();
}

export const config = {
  // Runs on every request except Next.js internals and common static
  // assets — the check inside proxy() itself is a single string
  // comparison, so the broad matcher has negligible cost. Excluding these
  // paths avoids running on hot asset requests for no reason.
  matcher: ["/((?!_next/static|_next/image|favicon.ico|icon.svg).*)"],
};
