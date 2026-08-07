export interface TocItem {
  id: string;
  label: string;
}

export function TableOfContents({ items }: { items: TocItem[] }) {
  if (!items.length) return null;
  return (
    <nav
      aria-label="Table of contents"
      className="border-ink-100 rounded-2xl border bg-white p-5"
    >
      <h2 className="text-ink-500 mb-3 text-sm font-semibold tracking-wide uppercase">
        On this page
      </h2>
      <ol className="space-y-2 text-sm">
        {items.map((item) => (
          <li key={item.id}>
            <a
              href={`#${item.id}`}
              className="text-blue-700 hover:underline hover:underline-offset-2"
            >
              {item.label}
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}
