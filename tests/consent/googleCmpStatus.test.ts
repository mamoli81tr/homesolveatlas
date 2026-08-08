import { describe, it, expect } from "vitest";
import { shouldShowCustomBanner, type GoogleCmpStatus } from "@/lib/consent/googleCmpStatus";

describe("shouldShowCustomBanner", () => {
  it("never shows once a choice is already stored, regardless of CMP state", () => {
    const statuses: GoogleCmpStatus[] = ["not-configured", "pending", "active", "unavailable"];
    for (const cmpStatus of statuses) {
      for (const cmpConfigured of [true, false]) {
        expect(
          shouldShowCustomBanner({ hasStoredConsent: true, cmpConfigured, cmpStatus }),
        ).toBe(false);
      }
    }
  });

  it("shows when the CMP is not configured at all (today's exact behavior)", () => {
    expect(
      shouldShowCustomBanner({
        hasStoredConsent: false,
        cmpConfigured: false,
        cmpStatus: "not-configured",
      }),
    ).toBe(true);
  });

  it("stays hidden while the CMP is still resolving — avoids a flash-then-hide double banner", () => {
    expect(
      shouldShowCustomBanner({ hasStoredConsent: false, cmpConfigured: true, cmpStatus: "pending" }),
    ).toBe(false);
  });

  it("stays hidden once the CMP is active — never a duplicate/competing dialog", () => {
    expect(
      shouldShowCustomBanner({ hasStoredConsent: false, cmpConfigured: true, cmpStatus: "active" }),
    ).toBe(false);
  });

  it("falls back to showing when the CMP is configured but failed to load", () => {
    expect(
      shouldShowCustomBanner({
        hasStoredConsent: false,
        cmpConfigured: true,
        cmpStatus: "unavailable",
      }),
    ).toBe(true);
  });
});
