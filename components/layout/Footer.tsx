import Link from "next/link";
import { Compass } from "lucide-react";
import { siteConfig } from "@/config/site";
import { footerCategoryLinks, footerCompanyLinks, footerLegalLinks } from "@/config/nav";
import { rooms } from "@/config/taxonomy";
import { Container } from "@/components/ui/Container";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-ink-100 mt-20 border-t bg-white">
      <Container className="py-12">
        <div className="grid grid-cols-2 gap-8 sm:grid-cols-4">
          <div className="col-span-2 sm:col-span-1">
            <div className="mb-3 flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-blue-600 to-emerald-500 text-white">
                <Compass className="h-4 w-4" aria-hidden="true" />
              </span>
              <span className="text-ink-950 text-base font-bold">{siteConfig.name}</span>
            </div>
            <p className="text-ink-500 text-sm leading-relaxed">{siteConfig.tagline}</p>
          </div>

          <FooterColumn title="Categories" links={footerCategoryLinks} />
          <FooterColumn
            title="Browse by Room"
            links={rooms
              .slice(0, 6)
              .map((r) => ({ label: r.label, href: `/rooms/${r.slug}` }))}
          />
          <FooterColumn
            title="Company"
            links={[...footerCompanyLinks, ...footerLegalLinks]}
          />
        </div>

        <div className="border-ink-100 text-ink-500 mt-10 flex flex-col gap-3 border-t pt-6 text-xs sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {year} {siteConfig.name}. All rights reserved.
          </p>
          <p className="max-w-2xl">
            {siteConfig.name} provides general information only and is not a substitute
            for advice from a licensed electrician, plumber, gas engineer, or HVAC
            technician. See our{" "}
            <Link
              href="/disclaimer"
              className="hover:text-ink-700 underline underline-offset-2"
            >
              Disclaimer
            </Link>
            .
          </p>
        </div>
      </Container>
    </footer>
  );
}

function FooterColumn({
  title,
  links,
}: {
  title: string;
  links: { label: string; href: string }[];
}) {
  return (
    <div>
      <h2 className="text-ink-950 mb-3 text-sm font-semibold">{title}</h2>
      <ul className="space-y-2">
        {links.map((link) => (
          <li key={link.href}>
            <Link href={link.href} className="text-ink-500 hover:text-ink-900 text-sm">
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
