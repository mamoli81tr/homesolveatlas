import Link from "next/link";
import { Clock, ArrowRight } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { ArticleThumb } from "@/components/media/ArticleThumb";
import type { Article } from "@/lib/content/schema";
import { getCategory } from "@/config/taxonomy";

export function ArticleCard({ article }: { article: Article }) {
  const fm = article.frontmatter;
  const category = getCategory(fm.category);

  return (
    <Card as="article" className="flex h-full flex-col overflow-hidden transition-shadow hover:shadow-md">
      <Link href={article.href} tabIndex={-1} aria-hidden="true">
        <ArticleThumb
          category={fm.category}
          subcategory={fm.subcategory}
          className="aspect-[16/9] w-full"
          iconClassName="h-9 w-9"
        />
      </Link>
      <div className="flex flex-1 flex-col p-5">
        <div className="mb-2 flex flex-wrap items-center gap-2">
          {category && <Badge variant="blue">{category.shortLabel}</Badge>}
          {fm.brand && <Badge variant="neutral">{fm.brand}</Badge>}
          {fm.errorCode && <Badge variant="amber">Code {fm.errorCode}</Badge>}
        </div>
        <h3 className="text-ink-950 mb-2 text-base leading-snug font-semibold">
          <Link href={article.href} className="hover:text-blue-700">
            {fm.title}
          </Link>
        </h3>
        <p className="text-ink-500 mb-4 flex-1 text-sm leading-relaxed">{fm.description}</p>
        <div className="text-ink-500 flex items-center justify-between text-xs">
          <span className="flex items-center gap-1">
            <Clock className="h-3.5 w-3.5" aria-hidden="true" />
            {article.readingTime}
          </span>
          <Link
            href={article.href}
            className="flex items-center gap-1 font-medium text-blue-700 hover:underline"
          >
            Read guide
            <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </Card>
  );
}
