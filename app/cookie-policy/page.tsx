// NOTE: This Cookie Policy is a structurally complete STARTING TEMPLATE, not
// legal advice. It must be reviewed by a qualified professional — and kept
// in sync with whatever analytics/ad providers are actually enabled in
// config/ads.ts and .env.local — before this site goes live. See
// README.md → "Before you launch".
import type { Metadata } from "next";
import { LegalLayout } from "@/components/legal/LegalLayout";
import { buildMetadata } from "@/lib/seo/metadata";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = buildMetadata({
  title: "Cookie Policy",
  description: `How ${siteConfig.name} uses cookies, and how to manage your preferences.`,
  path: "/cookie-policy",
});

export default function CookiePolicyPage() {
  return (
    <LegalLayout title="Cookie Policy" path="/cookie-policy" lastUpdated="August 7, 2026">
      <p>
        This Cookie Policy explains how {siteConfig.name} uses cookies and similar
        technologies, and how you can control them.
      </p>

      <h2>What are cookies?</h2>
      <p>
        Cookies are small text files stored on your device that let a website remember
        information about your visit, such as preferences or, with consent, behavior
        across visits.
      </p>

      <h2>Cookie categories we use</h2>
      <table>
        <thead>
          <tr>
            <th>Category</th>
            <th>Purpose</th>
            <th>Can be disabled?</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Necessary</td>
            <td>
              Required for core site functionality, such as remembering your cookie
              preferences.
            </td>
            <td>No — always active</td>
          </tr>
          <tr>
            <td>Analytics</td>
            <td>
              Helps us understand which pages are useful, using aggregated, anonymized
              usage data.
            </td>
            <td>Yes</td>
          </tr>
          <tr>
            <td>Advertising</td>
            <td>
              Allows relevant, non-intrusive display ads to be served by our ad network
              partners.
            </td>
            <td>Yes</td>
          </tr>
        </tbody>
      </table>

      <h2>Managing your preferences</h2>
      <p>
        You can change your cookie preferences at any time by clearing your browser&apos;s
        local storage for this site, which will show the cookie banner again on your next
        visit. Most browsers also let you block or delete cookies directly in their
        settings.
      </p>

      <h2>Analytics and advertising are consent-gated</h2>
      <p>
        Analytics and advertising scripts on this Site are not loaded until you actively
        accept the corresponding cookie category. Rejecting non-essential cookies means
        only strictly necessary cookies are used.
      </p>

      <h2>Changes to this policy</h2>
      <p>
        We may update this Cookie Policy as our use of cookies changes. Check the
        &ldquo;Last updated&rdquo; date above.
      </p>

      <h2>Contact us</h2>
      <p>
        Questions about this policy can be sent via our{" "}
        <a href="/contact">Contact page</a>.
      </p>
    </LegalLayout>
  );
}
