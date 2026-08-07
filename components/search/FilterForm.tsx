import { Filter } from "lucide-react";

export interface FilterField {
  name: string;
  label: string;
  options: { value: string; label: string }[];
}

/**
 * Server-rendered GET filter form — works with zero client JavaScript.
 * Selecting an option and pressing "Apply filters" reloads the page with
 * the chosen query params, which the hub page reads via `searchParams`.
 */
export function FilterForm({
  action,
  fields,
  values,
}: {
  action: string;
  fields: FilterField[];
  values: Record<string, string | undefined>;
}) {
  return (
    <form
      method="get"
      action={action}
      className="border-ink-100 mb-6 flex flex-wrap items-end gap-3 rounded-2xl border bg-white p-4"
    >
      <span className="text-ink-700 flex items-center gap-1.5 text-sm font-medium">
        <Filter className="h-4 w-4" aria-hidden="true" />
        Filter
      </span>
      {fields.map((field) => (
        <div key={field.name} className="min-w-[160px]">
          <label
            htmlFor={`filter-${field.name}`}
            className="text-ink-500 mb-1 block text-xs font-medium"
          >
            {field.label}
          </label>
          <select
            id={`filter-${field.name}`}
            name={field.name}
            defaultValue={values[field.name] ?? ""}
            className="border-ink-300 text-ink-900 w-full rounded-lg border bg-white px-3 py-2 text-sm"
          >
            <option value="">All</option>
            {field.options.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
      ))}
      <button
        type="submit"
        className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
      >
        Apply filters
      </button>
    </form>
  );
}
