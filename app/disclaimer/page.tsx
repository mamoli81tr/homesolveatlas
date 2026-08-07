// NOTE: This Disclaimer is a structurally complete STARTING TEMPLATE, not
// legal advice. It must be reviewed by a qualified professional before this
// site goes live. See README.md → "Before you launch".
import type { Metadata } from "next";
import { LegalLayout } from "@/components/legal/LegalLayout";
import { Callout } from "@/components/ui/Callout";
import { buildMetadata } from "@/lib/seo/metadata";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = buildMetadata({
  title: "Disclaimer",
  description: `Important limitations on the guidance published on ${siteConfig.name}.`,
  path: "/disclaimer",
});

export default function DisclaimerPage() {
  return (
    <LegalLayout title="Disclaimer" path="/disclaimer" lastUpdated="August 7, 2026">
      <Callout variant="warning" title="Read before following any guide">
        Content on {siteConfig.name} is for general informational purposes only and is not
        a substitute for advice from a licensed electrician, plumber, gas engineer, or
        HVAC technician.
      </Callout>

      <h2 className="mt-8">General information, not professional advice</h2>
      <p>
        Our guides describe common causes and general troubleshooting steps for household
        problems. They are written to help you understand what might be happening and what
        safe, low-risk checks you can perform yourself. They are not a diagnosis of your
        specific situation, and following them does not guarantee a fix.
      </p>

      <h2>Appliance and error code information</h2>
      <p>
        Error code meanings and troubleshooting steps may vary by model, model year, and
        region. Always check your specific appliance&apos;s manual or manufacturer
        documentation before attempting any troubleshooting, and stop if a step
        doesn&apos;t match what you see on your unit.
      </p>

      <h2>Electrical, gas, and structural safety</h2>
      <p>
        We do not provide instructions for working on gas lines, electrical panels,
        structural elements, or other high-risk systems. Where a guide touches on these
        areas, it is limited to identifying warning signs and explaining when to contact a
        licensed professional — not how to perform the repair yourself.
      </p>

      <h2>No liability for outcomes</h2>
      <p>
        {siteConfig.name} and its authors are not liable for any damage, injury, or loss
        resulting from actions taken based on content published on this Site. You are
        responsible for evaluating whether a task is within your skill level and for
        following manufacturer instructions and local safety codes.
      </p>

      <h2>When in doubt, call a professional</h2>
      <p>
        If a problem involves gas, electrical wiring, structural components, or anything
        you&apos;re not fully confident diagnosing safely, stop and contact a licensed
        professional rather than continuing with DIY troubleshooting.
      </p>
    </LegalLayout>
  );
}
