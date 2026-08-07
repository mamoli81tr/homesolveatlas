"use client";

import { useState } from "react";
import Link from "next/link";
import { Cookie } from "lucide-react";
import { setStoredConsent } from "@/lib/consent/storage";
import { useConsent } from "@/lib/consent/useConsent";
import type { ConsentState } from "@/lib/consent/types";
import { Button } from "@/components/ui/Button";

export function CookieConsent() {
  const consent = useConsent();
  const [customizing, setCustomizing] = useState(false);
  const [analytics, setAnalytics] = useState(false);
  const [advertising, setAdvertising] = useState(false);

  function persist(state: Omit<ConsentState, "necessary">) {
    setStoredConsent(state);
  }

  if (consent !== null) return null;

  return (
    <div
      role="dialog"
      aria-modal="false"
      aria-label="Cookie consent"
      className="border-ink-200 fixed inset-x-0 bottom-0 z-50 border-t bg-white p-4 shadow-[0_-4px_16px_rgba(16,24,40,0.08)] sm:p-6"
    >
      <div className="mx-auto flex max-w-6xl flex-col gap-4">
        <div className="flex items-start gap-3">
          <Cookie className="mt-0.5 h-5 w-5 flex-none text-blue-600" aria-hidden="true" />
          <p className="text-ink-700 text-sm leading-relaxed">
            We use cookies to run this site (necessary), understand how it&apos;s used
            (analytics), and show relevant ads (advertising). Choose what you&apos;re
            comfortable with — necessary cookies are always on. See our{" "}
            <Link
              href="/cookie-policy"
              className="hover:text-ink-900 underline underline-offset-2"
            >
              Cookie Policy
            </Link>
            .
          </p>
        </div>

        {customizing && (
          <div className="bg-ink-50 grid gap-3 rounded-xl p-4 sm:grid-cols-3">
            <ConsentToggle
              label="Necessary"
              description="Required for the site to function."
              checked
              disabled
            />
            <ConsentToggle
              label="Analytics"
              description="Helps us understand which pages are useful."
              checked={analytics}
              onChange={setAnalytics}
            />
            <ConsentToggle
              label="Advertising"
              description="Allows relevant, non-intrusive display ads."
              checked={advertising}
              onChange={setAdvertising}
            />
          </div>
        )}

        <div className="flex flex-wrap items-center gap-3">
          <Button onClick={() => persist({ analytics: true, advertising: true })}>
            Accept all
          </Button>
          <Button
            variant="secondary"
            onClick={() => persist({ analytics: false, advertising: false })}
          >
            Reject non-essential
          </Button>
          {customizing ? (
            <Button
              variant="secondary"
              onClick={() => persist({ analytics, advertising })}
            >
              Save preferences
            </Button>
          ) : (
            <Button variant="ghost" onClick={() => setCustomizing(true)}>
              Customize
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

function ConsentToggle({
  label,
  description,
  checked,
  onChange,
  disabled,
}: {
  label: string;
  description: string;
  checked: boolean;
  onChange?: (value: boolean) => void;
  disabled?: boolean;
}) {
  const id = `consent-${label.toLowerCase()}`;
  return (
    <div className="flex items-start gap-2.5 rounded-lg bg-white p-3">
      <input
        id={id}
        type="checkbox"
        checked={checked}
        disabled={disabled}
        onChange={(e) => onChange?.(e.target.checked)}
        className="border-ink-300 mt-0.5 h-4 w-4 rounded text-blue-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
      />
      <label htmlFor={id} className="text-xs">
        <span className="text-ink-900 block font-semibold">{label}</span>
        <span className="text-ink-500">{description}</span>
      </label>
    </div>
  );
}
