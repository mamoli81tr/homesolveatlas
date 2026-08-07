import type { Metadata } from "next";
import Link from "next/link";
import { Users, ShieldCheck, BookOpen } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Card } from "@/components/ui/Card";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { buildMetadata } from "@/lib/seo/metadata";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = buildMetadata({
  title: "About",
  description: `About ${siteConfig.name} — practical, safety-first guides for everyday home problems.`,
  path: "/about",
});

export default function AboutPage() {
  return (
    <Container className="py-8">
      <Breadcrumbs items={[{ label: "About", href: "/about" }]} />

      <header className="mt-4 max-w-2xl">
        <h1 className="text-ink-950 text-3xl leading-tight font-extrabold sm:text-4xl">
          About {siteConfig.name}
        </h1>
        <p className="text-ink-500 mt-3 text-base leading-relaxed">
          {siteConfig.tagline}
        </p>
      </header>

      <div className="text-ink-700 mt-10 max-w-3xl space-y-6 text-base leading-relaxed">
        <p>
          {siteConfig.name} exists for one reason: most home problems are ordinary,
          repeatable, and answerable clearly — but the answers online are often buried
          under ads, vague advice, or content written for search engines instead of
          people. We write for the person standing in front of a beeping appliance or a
          stubborn stain, trying to figure out what to do next.
        </p>
        <p>
          We cover appliance error codes, common breakdowns, cleaning and stain removal,
          home maintenance warning signs, heating and cooling issues, and a set of
          practical calculators for everyday home projects. Every guide follows the same
          structure — symptoms, likely causes, safe checks, step-by-step fixes, what not
          to do, and when to call a professional — so you always know where you stand.
        </p>
      </div>

      <div className="mt-10 grid gap-4 sm:grid-cols-3">
        <Card className="p-5">
          <Users className="mb-3 h-6 w-6 text-blue-600" aria-hidden="true" />
          <h2 className="text-ink-950 mb-1 text-sm font-semibold">
            Written for real problems
          </h2>
          <p className="text-ink-500 text-sm">
            Every guide starts from an actual question, not a keyword list.
          </p>
        </Card>
        <Card className="p-5">
          <ShieldCheck className="mb-3 h-6 w-6 text-emerald-600" aria-hidden="true" />
          <h2 className="text-ink-950 mb-1 text-sm font-semibold">Safety comes first</h2>
          <p className="text-ink-500 text-sm">
            We&apos;re explicit about what&apos;s safe to check yourself and when to call
            a licensed pro.
          </p>
        </Card>
        <Card className="p-5">
          <BookOpen className="mb-3 h-6 w-6 text-blue-600" aria-hidden="true" />
          <h2 className="text-ink-950 mb-1 text-sm font-semibold">Kept up to date</h2>
          <p className="text-ink-500 text-sm">
            Guides show a last-updated date and are revisited as we learn more.
          </p>
        </Card>
      </div>

      <div className="text-ink-700 mt-10 max-w-3xl text-base leading-relaxed">
        <p>
          {siteConfig.name} is supported entirely by display advertising — we don&apos;t
          sell products, take affiliate commissions, or offer paid services. See our{" "}
          <Link href="/editorial-policy" className="text-blue-700 underline underline-offset-2 hover:text-blue-800">
            Editorial Policy
          </Link>{" "}
          for how content is prepared and corrected, or{" "}
          <Link href="/contact" className="text-blue-700 underline underline-offset-2 hover:text-blue-800">
            get in touch
          </Link>{" "}
          if something needs a second look.
        </p>
      </div>
    </Container>
  );
}
