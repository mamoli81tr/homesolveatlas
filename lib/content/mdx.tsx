import { MDXRemote } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";
import rehypeSlug from "rehype-slug";

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
