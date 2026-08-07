"use client";

import { cn } from "@/lib/utils/cn";

export function NumberField({
  id,
  label,
  value,
  onChange,
  suffix,
  min,
  max,
  step = "any",
  error,
  hint,
}: {
  id: string;
  label: string;
  value: number | string;
  onChange: (value: string) => void;
  suffix?: string;
  min?: number;
  max?: number;
  step?: number | "any";
  error?: string;
  hint?: string;
}) {
  return (
    <div>
      <label htmlFor={id} className="text-ink-700 mb-1.5 block text-sm font-medium">
        {label}
      </label>
      <div className="relative">
        <input
          id={id}
          type="number"
          inputMode="decimal"
          value={value}
          min={min}
          max={max}
          step={step}
          onChange={(e) => onChange(e.target.value)}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? `${id}-error` : hint ? `${id}-hint` : undefined}
          className={cn(
            "text-ink-900 w-full rounded-xl border bg-white px-3.5 py-2.5 text-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600",
            error ? "border-red-400" : "border-ink-300",
            suffix && "pr-14",
          )}
        />
        {suffix && (
          <span className="text-ink-500 pointer-events-none absolute top-1/2 right-3.5 -translate-y-1/2 text-xs">
            {suffix}
          </span>
        )}
      </div>
      {error ? (
        <p id={`${id}-error`} role="alert" className="mt-1 text-xs text-red-600">
          {error}
        </p>
      ) : hint ? (
        <p id={`${id}-hint`} className="text-ink-500 mt-1 text-xs">
          {hint}
        </p>
      ) : null}
    </div>
  );
}

export function SelectField({
  id,
  label,
  value,
  onChange,
  options,
  hint,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string }[];
  hint?: string;
}) {
  return (
    <div>
      <label htmlFor={id} className="text-ink-700 mb-1.5 block text-sm font-medium">
        {label}
      </label>
      <select
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        aria-describedby={hint ? `${id}-hint` : undefined}
        className="border-ink-300 text-ink-900 w-full rounded-xl border bg-white px-3.5 py-2.5 text-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {hint && (
        <p id={`${id}-hint`} className="text-ink-500 mt-1 text-xs">
          {hint}
        </p>
      )}
    </div>
  );
}

export function UnitToggle({
  value,
  onChange,
}: {
  value: "imperial" | "metric";
  onChange: (value: "imperial" | "metric") => void;
}) {
  return (
    <div
      role="radiogroup"
      aria-label="Unit system"
      className="border-ink-300 inline-flex rounded-xl border bg-white p-1"
    >
      {(["imperial", "metric"] as const).map((option) => (
        <button
          key={option}
          type="button"
          role="radio"
          aria-checked={value === option}
          onClick={() => onChange(option)}
          className={cn(
            "rounded-lg px-3.5 py-1.5 text-sm font-medium transition-colors",
            value === option ? "bg-blue-600 text-white" : "text-ink-700 hover:bg-ink-100",
          )}
        >
          {option === "imperial" ? "Imperial (ft, in)" : "Metric (m, cm)"}
        </button>
      ))}
    </div>
  );
}

export function ResultStat({
  label,
  value,
  emphasis,
}: {
  label: string;
  value: string;
  emphasis?: boolean;
}) {
  return (
    <div
      className={cn(
        "rounded-xl p-4",
        emphasis ? "bg-blue-600 text-white" : "bg-ink-50 text-ink-900",
      )}
    >
      <p
        className={cn(
          "text-xs font-medium tracking-wide uppercase",
          emphasis ? "text-white/95" : "text-ink-500",
        )}
      >
        {label}
      </p>
      <p
        className={cn(
          "mt-1 text-2xl font-bold",
          emphasis ? "text-white" : "text-ink-950",
        )}
      >
        {value}
      </p>
    </div>
  );
}
