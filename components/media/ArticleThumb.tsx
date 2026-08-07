import { getArticleVisual } from "@/lib/media/visuals";
import type { CategorySlug } from "@/config/taxonomy";
import { cn } from "@/lib/utils/cn";

/**
 * Lightweight stand-in for a featured photo: an inline-SVG gradient tile
 * with the topic's icon. Zero image bytes, zero layout-shift risk (it's
 * pure CSS/SVG, sized by the aspect-ratio wrapper), and no copyright
 * concerns. If `content/articles/**` ever gets real photography, point
 * `featuredImage` at a file in `public/` and swap this for `next/image`.
 */
export function ArticleThumb({
  category,
  subcategory,
  className,
  iconClassName,
}: {
  category: CategorySlug;
  subcategory?: string;
  className?: string;
  iconClassName?: string;
}) {
  const { icon: Icon, gradient } = getArticleVisual({ category, subcategory });

  return (
    <div
      aria-hidden="true"
      className={cn("flex items-center justify-center", className)}
      style={{ background: `linear-gradient(135deg, ${gradient[0]}, ${gradient[1]})` }}
    >
      <Icon className={cn("text-white/90", iconClassName)} strokeWidth={1.5} />
    </div>
  );
}
