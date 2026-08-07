"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { mainNav } from "@/config/nav";
import { SearchBox } from "@/components/search/SearchBox";

export function MobileMenu() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <div className="md:hidden">
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-expanded={open}
        aria-controls="mobile-menu"
        aria-label="Open menu"
        className="text-ink-700 hover:bg-ink-100 flex h-10 w-10 items-center justify-center rounded-lg"
      >
        <Menu className="h-6 w-6" aria-hidden="true" />
      </button>

      {open && (
        <div
          id="mobile-menu"
          role="dialog"
          aria-modal="true"
          aria-label="Site menu"
          className="fixed inset-0 z-50 bg-white"
        >
          <div className="border-ink-100 flex items-center justify-between border-b px-4 py-3">
            <span className="text-ink-950 text-base font-bold">Menu</span>
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Close menu"
              className="text-ink-700 hover:bg-ink-100 flex h-10 w-10 items-center justify-center rounded-lg"
            >
              <X className="h-6 w-6" aria-hidden="true" />
            </button>
          </div>
          <div className="p-4">
            <SearchBox className="mb-4" />
            <nav aria-label="Mobile">
              <ul className="divide-ink-100 flex flex-col divide-y">
                {mainNav.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      onClick={() => setOpen(false)}
                      className="text-ink-900 block py-3 text-base font-medium"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
                <li>
                  <Link
                    href="/about"
                    onClick={() => setOpen(false)}
                    className="text-ink-900 block py-3 text-base font-medium"
                  >
                    About
                  </Link>
                </li>
                <li>
                  <Link
                    href="/contact"
                    onClick={() => setOpen(false)}
                    className="text-ink-900 block py-3 text-base font-medium"
                  >
                    Contact
                  </Link>
                </li>
              </ul>
            </nav>
          </div>
        </div>
      )}
    </div>
  );
}
