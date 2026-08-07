import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils/cn";

export function Pagination({
  basePath,
  currentPage,
  totalPages,
  searchParams = {},
}: {
  basePath: string;
  currentPage: number;
  totalPages: number;
  searchParams?: Record<string, string | undefined>;
}) {
  if (totalPages <= 1) return null;

  function buildHref(page: number) {
    const params = new URLSearchParams();
    for (const [key, value] of Object.entries(searchParams)) {
      if (value) params.set(key, value);
    }
    if (page > 1) params.set("page", String(page));
    const qs = params.toString();
    return qs ? `${basePath}?${qs}` : basePath;
  }

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <nav aria-label="Pagination" className="mt-10 flex items-center justify-center gap-1">
      <PageLink
        href={buildHref(Math.max(currentPage - 1, 1))}
        disabled={currentPage === 1}
        aria-label="Previous page"
      >
        <ChevronLeft className="h-4 w-4" aria-hidden="true" />
      </PageLink>
      {pages.map((page) => (
        <PageLink key={page} href={buildHref(page)} active={page === currentPage}>
          {page}
        </PageLink>
      ))}
      <PageLink
        href={buildHref(Math.min(currentPage + 1, totalPages))}
        disabled={currentPage === totalPages}
        aria-label="Next page"
      >
        <ChevronRight className="h-4 w-4" aria-hidden="true" />
      </PageLink>
    </nav>
  );
}

function PageLink({
  href,
  active,
  disabled,
  children,
  ...props
}: {
  href: string;
  active?: boolean;
  disabled?: boolean;
  children: React.ReactNode;
} & React.AnchorHTMLAttributes<HTMLAnchorElement>) {
  if (disabled) {
    return (
      <span
        className="text-ink-300 flex h-9 w-9 items-center justify-center rounded-lg"
        aria-disabled="true"
      >
        {children}
      </span>
    );
  }
  return (
    <Link
      href={href}
      aria-current={active ? "page" : undefined}
      className={cn(
        "flex h-9 w-9 items-center justify-center rounded-lg text-sm font-medium",
        active ? "bg-blue-600 text-white" : "text-ink-700 hover:bg-ink-100",
      )}
      {...props}
    >
      {children}
    </Link>
  );
}
