import type { Metadata } from "next";
import { LegalLayout } from "@/components/legal/LegalLayout";
import { buildMetadata } from "@/lib/seo/metadata";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = buildMetadata({
  title: "Editorial Policy",
  description: `How ${siteConfig.name} researches, writes, and corrects its guides.`,
  path: "/editorial-policy",
});

export default function EditorialPolicyPage() {
  return (
    <LegalLayout
      title="Editorial Policy"
      path="/editorial-policy"
      lastUpdated="August 7, 2026"
    >
      <h2>Who writes our content</h2>
      <p>
        Articles on {siteConfig.name} are prepared by the {siteConfig.defaultAuthor}, a
        team focused on practical, safety-conscious home guidance. We do not publish
        content under fabricated personal bylines, invented credentials, or claims of
        hands-on product testing we haven&apos;t performed.
      </p>

      <h2>How guides are structured</h2>
      <p>
        Every troubleshooting guide follows the same format: a direct short answer, common
        symptoms, likely causes, safe checks, step-by-step guidance, what not to do, and
        when to call a licensed professional. This structure exists so you can quickly
        find the specific section you need, rather than reading a full narrative to find
        one answer.
      </p>

      <h2>How we check information</h2>
      <p>
        Where a guide references model-specific details — such as an appliance error code
        — we note explicitly that meanings can vary by brand, model, and region, and we
        point readers to their appliance&apos;s manual as the authoritative source. We
        avoid stating exact figures or manufacturer-specific claims we can&apos;t
        reasonably verify apply broadly.
      </p>

      <h2>Safety-first approach</h2>
      <p>
        We deliberately avoid giving instructions for electrical, gas, or structural work
        beyond identifying warning signs and safe checks. Where a task carries real risk,
        our guides direct readers to a licensed professional instead of walking through
        the repair itself. This is a deliberate editorial boundary, not an oversight.
      </p>

      <h2>Updates and corrections</h2>
      <p>
        Guides show a &ldquo;last updated&rdquo; date. When we learn that a guide contains
        an error, an outdated step, or a broken link, we correct it directly rather than
        leaving outdated information live. If you spot something that needs a second look,
        please use our <a href="/contact">Contact page</a> — we read every message.
      </p>

      <h2>Advertising and editorial independence</h2>
      <p>
        {siteConfig.name} is funded entirely by display advertising. Advertisers have no
        input into which topics we cover or what our guides say. We do not accept payment
        for favorable coverage, and we do not sell products, take affiliate commissions,
        or offer paid placements of any kind.
      </p>

      <h2>No fabricated signals</h2>
      <p>
        We do not publish fake reviews, invented user testimonials, fabricated view
        counts, or exaggerated claims of expertise. What you read is what our editorial
        team has prepared and stands behind.
      </p>
    </LegalLayout>
  );
}
