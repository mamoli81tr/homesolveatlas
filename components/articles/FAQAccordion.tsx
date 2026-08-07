/** Accessible accordion built on native <details>/<summary> — works with zero JavaScript. */
export function FAQAccordion({ faqs }: { faqs: { q: string; a: string }[] }) {
  if (!faqs.length) return null;
  return (
    <div className="divide-ink-100 border-ink-100 divide-y rounded-2xl border bg-white">
      {faqs.map((faq) => (
        <details key={faq.q} className="group open:bg-ink-50/50 p-5">
          <summary className="text-ink-900 flex cursor-pointer list-none items-center justify-between gap-4 font-semibold marker:content-none">
            {faq.q}
            <span
              aria-hidden="true"
              className="text-ink-500 flex-none text-lg transition-transform group-open:rotate-45"
            >
              +
            </span>
          </summary>
          <p className="text-ink-700 mt-3 text-sm leading-relaxed">{faq.a}</p>
        </details>
      ))}
    </div>
  );
}
