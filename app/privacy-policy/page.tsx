// NOTE: This Privacy Policy is a structurally complete STARTING TEMPLATE,
// not legal advice. It must be reviewed (and likely customized for your
// jurisdiction — GDPR, CCPA, etc.) by a qualified professional before this
// site goes live. See README.md → "Before you launch".
import type { Metadata } from "next";
import { LegalLayout } from "@/components/legal/LegalLayout";
import { buildMetadata } from "@/lib/seo/metadata";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = buildMetadata({
  title: "Privacy Policy",
  description: `How ${siteConfig.name} collects, uses, and protects information.`,
  path: "/privacy-policy",
});

export default function PrivacyPolicyPage() {
  return (
    <LegalLayout
      title="Privacy Policy"
      path="/privacy-policy"
      lastUpdated="August 7, 2026"
    >
      <p>
        This Privacy Policy explains what information {siteConfig.name} (&ldquo;we&rdquo;,
        &ldquo;us&rdquo;) collects when you visit {siteConfig.url}, and how it is used.
        This policy is a general starting template and has not been customized for any
        specific jurisdiction&apos;s data protection law — the site owner should have it
        reviewed before launch.
      </p>

      <h2>Information we collect</h2>
      <p>
        We do not require an account, and we do not sell products or services on this
        site. We may collect:
      </p>
      <ul>
        <li>
          <strong>Usage data</strong>, such as pages visited, referring pages, device and
          browser type, and approximate location, collected via analytics tools once you
          consent to analytics cookies.
        </li>
        <li>
          <strong>Contact information</strong> you voluntarily provide, such as your name
          and email address, if you use the contact form.
        </li>
        <li>
          <strong>Cookie preferences</strong>, stored locally in your browser (see our{" "}
          <a href="/cookie-policy">Cookie Policy</a>).
        </li>
      </ul>

      <h2>How we use information</h2>
      <ul>
        <li>
          To operate, maintain, and improve the site&apos;s content and functionality.
        </li>
        <li>
          To understand which content is useful, via aggregated, consent-gated analytics.
        </li>
        <li>To respond to messages sent through the contact form.</li>
        <li>
          To serve advertising through third-party ad networks, once you consent to
          advertising cookies.
        </li>
      </ul>

      <h2>Advertising and analytics</h2>
      <p>
        If enabled, we use third-party advertising and analytics providers (see our{" "}
        <a href="/cookie-policy">Cookie Policy</a> for current providers). These providers
        may use cookies or similar technologies to serve relevant ads and measure site
        usage. We do not control these providers&apos; own data practices — review their
        respective privacy policies for details.
      </p>

      <h2>Data sharing</h2>
      <p>
        We do not sell personal information. We may share limited data with service
        providers (such as hosting, analytics, and advertising partners) strictly to
        operate the site, and only as permitted by your cookie preferences.
      </p>

      <h2>Your choices</h2>
      <ul>
        <li>
          Manage cookie categories at any time via the cookie banner or your browser
          settings.
        </li>
        <li>
          Contact us to request information about data we may hold related to a message
          you sent us.
        </li>
        <li>
          Use browser privacy features (such as Do Not Track or ad blockers) — we do not
          currently respond differently to Do Not Track signals.
        </li>
      </ul>

      <h2>Children&apos;s privacy</h2>
      <p>
        This site is not directed at children under 13, and we do not knowingly collect
        personal information from children.
      </p>

      <h2>Changes to this policy</h2>
      <p>
        We may update this policy from time to time. The &ldquo;Last updated&rdquo; date
        at the top reflects the most recent revision.
      </p>

      <h2>Contact us</h2>
      <p>
        Questions about this policy can be sent via our{" "}
        <a href="/contact">Contact page</a>
        {siteConfig.contactEmail ? <> or to {siteConfig.contactEmail}</> : null}.
      </p>
    </LegalLayout>
  );
}
