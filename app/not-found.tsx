import Link from "next/link";
import { SearchX } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { ButtonLink } from "@/components/ui/Button";
import { SearchBox } from "@/components/search/SearchBox";
import { categories } from "@/config/taxonomy";

export default function NotFound() {
  return (
    <Container className="flex min-h-[60vh] flex-col items-center justify-center py-16 text-center">
      <span className="bg-ink-100 text-ink-500 mb-4 flex h-14 w-14 items-center justify-center rounded-2xl">
        <SearchX className="h-7 w-7" aria-hidden="true" />
      </span>
      <h1 className="text-ink-950 text-3xl font-extrabold">Page not found</h1>
      <p className="text-ink-500 mt-3 max-w-md text-base leading-relaxed">
        The page you&apos;re looking for doesn&apos;t exist or may have moved. Try
        searching, or head back to the homepage.
      </p>

      <div className="mt-6 w-full max-w-md">
        <SearchBox size="lg" />
      </div>

      <div className="mt-6 flex flex-wrap justify-center gap-2">
        {categories.map((c) => (
          <Link
            key={c.slug}
            href={c.href}
            className="border-ink-300 text-ink-700 hover:bg-ink-100 rounded-full border px-3.5 py-1.5 text-sm font-medium"
          >
            {c.shortLabel}
          </Link>
        ))}
      </div>

      <ButtonLink href="/" variant="primary" className="mt-8">
        Back to homepage
      </ButtonLink>
    </Container>
  );
}
