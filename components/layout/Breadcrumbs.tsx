import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbSchema, type Crumb } from "@/lib/seo/schema";

export function Breadcrumbs({ items }: { items: Crumb[] }) {
  const allItems: Crumb[] = [{ label: "Home", href: "/" }, ...items];

  return (
    <nav aria-label="Breadcrumb" className="text-sm">
      <ol className="text-ink-500 flex flex-wrap items-center gap-1.5">
        {allItems.map((item, index) => {
          const isLast = index === allItems.length - 1;
          return (
            <li key={item.href} className="flex items-center gap-1.5">
              {index === 0 ? (
                <Link
                  href={item.href}
                  className="hover:text-ink-900 flex items-center gap-1"
                >
                  <Home className="h-3.5 w-3.5" aria-hidden="true" />
                  <span className="sr-only">Home</span>
                </Link>
              ) : isLast ? (
                <span aria-current="page" className="text-ink-900 font-medium">
                  {item.label}
                </span>
              ) : (
                <Link href={item.href} className="hover:text-ink-900">
                  {item.label}
                </Link>
              )}
              {!isLast && (
                <ChevronRight className="text-ink-300 h-3.5 w-3.5" aria-hidden="true" />
              )}
            </li>
          );
        })}
      </ol>
      <JsonLd data={breadcrumbSchema(allItems)} />
    </nav>
  );
}
