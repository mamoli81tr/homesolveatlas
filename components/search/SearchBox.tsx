"use client";

import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils/cn";

export function SearchBox({
  defaultValue = "",
  className,
  size = "md",
}: {
  defaultValue?: string;
  className?: string;
  size?: "md" | "lg";
}) {
  const router = useRouter();
  const [value, setValue] = useState(defaultValue);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const q = value.trim();
    router.push(q ? `/search?q=${encodeURIComponent(q)}` : "/search");
  }

  return (
    <form
      role="search"
      onSubmit={handleSubmit}
      className={cn("relative w-full", className)}
    >
      <label htmlFor="site-search" className="sr-only">
        Search articles and guides
      </label>
      <Search
        className="text-ink-500 pointer-events-none absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2"
        aria-hidden="true"
      />
      <input
        id="site-search"
        type="search"
        name="q"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Search error codes, symptoms, stains…"
        className={cn(
          "border-ink-300 text-ink-900 placeholder:text-ink-500 w-full rounded-xl border bg-white pr-4 pl-10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600",
          size === "lg" ? "py-3.5 text-base" : "py-2.5 text-sm",
        )}
      />
    </form>
  );
}
