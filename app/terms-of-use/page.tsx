// NOTE: This Terms of Use page is a structurally complete STARTING TEMPLATE,
// not legal advice. It must be reviewed by a qualified professional before
// this site goes live. See README.md → "Before you launch".
import type { Metadata } from "next";
import { LegalLayout } from "@/components/legal/LegalLayout";
import { buildMetadata } from "@/lib/seo/metadata";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = buildMetadata({
  title: "Terms of Use",
  description: `The terms that govern your use of ${siteConfig.name}.`,
  path: "/terms-of-use",
});

export default function TermsOfUsePage() {
  return (
    <LegalLayout title="Terms of Use" path="/terms-of-use" lastUpdated="August 7, 2026">
      <p>
        By accessing or using {siteConfig.url} (the &ldquo;Site&rdquo;), you agree to
        these Terms of Use. If you do not agree, please do not use the Site.
      </p>

      <h2>Use of the Site</h2>
      <p>
        The Site provides general informational guides about home appliances, cleaning,
        home maintenance, and related calculators. You may browse and use the Site for
        personal, non-commercial purposes.
      </p>

      <h2>No professional advice</h2>
      <p>
        Content on this Site is provided for general informational purposes only and does
        not constitute professional advice — including but not limited to electrical,
        plumbing, gas, HVAC, structural, or legal advice. See our{" "}
        <a href="/disclaimer">Disclaimer</a> for details. Always consult a licensed
        professional for matters involving safety, code compliance, or significant cost.
      </p>

      <h2>Intellectual property</h2>
      <p>
        Unless otherwise noted, the text, design, and layout of this Site are owned by{" "}
        {siteConfig.name}. You may share links to our content, but may not republish,
        scrape, or redistribute substantial portions of our content without permission.
      </p>

      <h2>User-submitted content</h2>
      <p>
        If you contact us through the Site, you agree not to submit content that is
        unlawful, abusive, or infringes on the rights of others. We may use feedback you
        provide to improve the Site.
      </p>

      <h2>Advertising</h2>
      <p>
        This Site is supported by display advertising, which may be served by third-party
        ad networks. We do not endorse the products or services advertised, and are not
        responsible for the content of third-party advertisements.
      </p>

      <h2>Third-party links</h2>
      <p>
        The Site may link to third-party websites, including manufacturer resources. We
        are not responsible for the content, accuracy, or practices of third-party sites.
      </p>

      <h2>Disclaimer of warranties</h2>
      <p>
        The Site is provided &ldquo;as is&rdquo; without warranties of any kind, express
        or implied. We do not guarantee that content is complete, accurate, or current for
        your specific appliance model or situation.
      </p>

      <h2>Limitation of liability</h2>
      <p>
        To the fullest extent permitted by law, {siteConfig.name} is not liable for any
        damages arising from your use of, or inability to use, the Site or reliance on its
        content.
      </p>

      <h2>Changes to these terms</h2>
      <p>
        We may update these Terms from time to time. Continued use of the Site after
        changes constitutes acceptance of the revised Terms.
      </p>

      <h2>Contact us</h2>
      <p>
        Questions about these Terms can be sent via our{" "}
        <a href="/contact">Contact page</a>.
      </p>
    </LegalLayout>
  );
}
