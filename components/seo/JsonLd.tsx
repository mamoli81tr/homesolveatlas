/**
 * Renders a JSON-LD <script> tag. Safe by construction: the payload is a
 * JSON.stringify()'d object passed as the script's text child (not raw HTML
 * injected via dangerouslySetInnerHTML), so there is no markup-injection
 * surface here.
 */
export function JsonLd({ data }: { data: object | null }) {
  if (!data) return null;
  return <script type="application/ld+json">{JSON.stringify(data)}</script>;
}
