import Link from "next/link";
import { Compass } from "lucide-react";
import { siteConfig } from "@/config/site";

export function Logo() {
  return (
    <Link
      href="/"
      className="flex shrink-0 items-center gap-2"
      aria-label={`${siteConfig.name} home`}
    >
      <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-emerald-500 text-white">
        <Compass className="h-5 w-5" aria-hidden="true" />
      </span>
      <span className="text-ink-950 text-lg font-bold tracking-tight">
        {siteConfig.name}
      </span>
    </Link>
  );
}
