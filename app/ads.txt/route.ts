/**
 * /ads.txt — IAB "Authorized Digital Sellers" file.
 *
 * Intentionally ships empty (comment-only) until a real ad network account
 * exists — no fabricated publisher IDs. Lines starting with "#" are ignored
 * by ads.txt parsers, so this is valid, inert output, not a fake entry.
 *
 * To activate once you have a real AdSense (or other network) account:
 *   Set ADS_TXT_ENTRIES in your environment to the exact line(s) your ad
 *   network gives you, e.g.:
 *     ADS_TXT_ENTRIES=google.com, pub-0000000000000000, DIRECT, f08c47fec0942fa0
 *   Multiple entries can be newline-separated in the same variable.
 *   This route picks it up automatically — no code change needed.
 */
export function GET() {
  const configured = process.env.ADS_TXT_ENTRIES?.trim();

  const body = configured
    ? configured
    : [
        "# ads.txt — no advertising network configured yet.",
        "# Once this site has a real AdSense (or other network) publisher ID,",
        "# set ADS_TXT_ENTRIES in the environment — see app/ads.txt/route.ts.",
      ].join("\n");

  return new Response(body + "\n", {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
