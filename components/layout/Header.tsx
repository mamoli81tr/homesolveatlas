import Link from "next/link";
import { Logo } from "@/components/layout/Logo";
import { MobileMenu } from "@/components/layout/MobileMenu";
import { SearchBox } from "@/components/search/SearchBox";
import { mainNav } from "@/config/nav";

export function Header() {
  return (
    <header className="border-ink-100 sticky top-0 z-40 border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80">
      <div className="mx-auto flex max-w-6xl items-center gap-4 px-4 py-3 sm:px-6 lg:px-8">
        <Logo />

        <nav aria-label="Primary" className="hidden md:block">
          <ul className="flex items-center gap-1">
            {mainNav.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="text-ink-700 hover:bg-ink-100 hover:text-ink-950 rounded-lg px-3 py-2 text-sm font-medium"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="ml-auto hidden w-64 md:block lg:w-80">
          <SearchBox />
        </div>

        <MobileMenu />
      </div>
    </header>
  );
}
