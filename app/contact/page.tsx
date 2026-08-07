import type { Metadata } from "next";
import { Mail } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Card } from "@/components/ui/Card";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { ContactForm } from "@/components/ContactForm";
import { buildMetadata } from "@/lib/seo/metadata";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = buildMetadata({
  title: "Contact",
  description: `Get in touch with the ${siteConfig.name} editorial team — corrections, questions, and feedback welcome.`,
  path: "/contact",
});

export default function ContactPage() {
  return (
    <Container className="py-8">
      <Breadcrumbs items={[{ label: "Contact", href: "/contact" }]} />

      <header className="mt-4 max-w-2xl">
        <h1 className="text-ink-950 text-3xl leading-tight font-extrabold sm:text-4xl">
          Contact
        </h1>
        <p className="text-ink-500 mt-3 text-base leading-relaxed">
          Found something inaccurate, unclear, or out of date? Or just want to say hello?
          We read every message.
        </p>
      </header>

      <div className="mt-8 grid gap-6 lg:grid-cols-[minmax(0,1fr)_280px]">
        <Card className="p-6">
          <ContactForm />
        </Card>

        {siteConfig.contactEmail && (
          <Card className="flex items-start gap-3 p-6">
            <Mail className="mt-0.5 h-5 w-5 flex-none text-blue-600" aria-hidden="true" />
            <div className="text-sm">
              <p className="text-ink-900 font-semibold">Prefer email directly?</p>
              <p className="text-ink-500 mt-1">
                Reach us at{" "}
                <a
                  href={`mailto:${siteConfig.contactEmail}`}
                  className="text-blue-700 underline underline-offset-2 hover:text-blue-800"
                >
                  {siteConfig.contactEmail}
                </a>
                . We aim to reply within a few business days.
              </p>
            </div>
          </Card>
        )}
      </div>
    </Container>
  );
}
