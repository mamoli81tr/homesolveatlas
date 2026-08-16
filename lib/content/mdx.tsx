import { MDXRemote } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";
import rehypeSlug from "rehype-slug";
import { Callout } from "@/components/ui/Callout";

// Makes `<Callout variant="danger" title="...">...</Callout>` available
// directly inside an article's freeform MDX body — e.g. for a "stop and
// call a professional" safety box or a "before you buy a part" note — so
// diagnostic prose can reuse the site's one existing callout component
// instead of every article hand-rolling its own styled div. Only standard
// HTML tags (p, table, ul, h2/h3, etc.) are otherwise used in article
// bodies; they render via MDX's built-in intrinsic-element handling and
// pick up their look from the `.article-prose` CSS below, no mapping
// needed.
const mdxComponents = { Callout };

/**
 * Renders the optional freeform MDX body that follows an article's
 * structured frontmatter sections. Compiled server-side via next-mdx-remote
 * into React elements (no dangerouslySetInnerHTML, no client-side MDX
 * compiler shipped to the browser).
 */
export function ArticleBody({ source }: { source: string }) {
  if (!source.trim()) return null;
  return (
    <div className="article-prose">
      <MDXRemote
        source={source}
        components={mdxComponents}
        options={{
          mdxOptions: {
            remarkPlugins: [remarkGfm],
            rehypePlugins: [rehypeSlug],
          },
        }}
      />
    </div>
  );
}
