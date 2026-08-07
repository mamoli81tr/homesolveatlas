import { Container } from "@/components/ui/Container";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";

export function LegalLayout({
  title,
  path,
  lastUpdated,
  children,
}: {
  title: string;
  path: string;
  lastUpdated: string;
  children: React.ReactNode;
}) {
  return (
    <Container className="py-8">
      <Breadcrumbs items={[{ label: title, href: path }]} />
      <header className="mt-4 max-w-3xl">
        <h1 className="text-ink-950 text-3xl leading-tight font-extrabold sm:text-4xl">
          {title}
        </h1>
        <p className="text-ink-500 mt-2 text-sm">Last updated: {lastUpdated}</p>
      </header>
      <div className="article-prose mt-8 max-w-3xl">{children}</div>
    </Container>
  );
}
