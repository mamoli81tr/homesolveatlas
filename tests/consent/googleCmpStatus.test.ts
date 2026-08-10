import { describe, it, expect } from "vitest";
import {
  shouldShowCustomBanner,
  resolveGoogleCmpMessageState,
  type GoogleCmpStatus,
} from "@/lib/consent/googleCmpStatus";

describe("resolveGoogleCmpMessageState", () => {
  it("is 'pending' until either signal fires", () => {
    expect(
      resolveGoogleCmpMessageState({ tcfUiShown: false, consentDataReady: false }),
    ).toBe("pending");
  });

  it("REGRESSION: CMP loaded successfully but no consent message displayed -> 'no-message-applicable', not blank/pending", () => {
    // This is exactly the reported cross-browser bug: Chrome/Opera (and any
    // visitor outside the EEA/UK/CH) load Google's CMP fine and it resolves
    // (CONSENT_DATA_READY fires), but it never shows a UI (TCF's
    // "cmpuishown" never fires) because no regulatory message applies to
    // them. The old code treated "resolved" alone as "CMP is handling
    // this," incorrectly suppressing the custom banner and leaving the
    // visitor with no consent UI at all.
    expect(
      resolveGoogleCmpMessageState({ tcfUiShown: false, consentDataReady: true }),
    ).toBe("no-message-applicable");
  });

  it("resolves to 'showing-message' once TCF reports the CMP UI is shown", () => {
    expect(
      resolveGoogleCmpMessageState({ tcfUiShown: true, consentDataReady: false }),
    ).toBe("showing-message");
  });

  it("'showing-message' wins even if consentDataReady also became true", () => {
    expect(
      resolveGoogleCmpMessageState({ tcfUiShown: true, consentDataReady: true }),
    ).toBe("showing-message");
  });

  it("is order-independent — either signal firing first still resolves correctly", () => {
    // consentDataReady first, then tcfUiShown later (self-heals upward)
    let state = resolveGoogleCmpMessageState({ tcfUiShown: false, consentDataReady: true });
    expect(state).toBe("no-message-applicable");
    state = resolveGoogleCmpMessageState({ tcfUiShown: true, consentDataReady: true });
    expect(state).toBe("showing-message");
  });
});

describe("shouldShowCustomBanner", () => {
  it("never shows once a choice is already stored, regardless of CMP state (Case D)", () => {
    const statuses: GoogleCmpStatus[] = [
      "not-configured",
      "pending",
      "showing-message",
      "no-message-applicable",
      "unavailable",
    ];
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

  it("stays hidden while the CMP is still pending — avoids a flash-then-hide double banner", () => {
    expect(
      shouldShowCustomBanner({ hasStoredConsent: false, cmpConfigured: true, cmpStatus: "pending" }),
    ).toBe(false);
  });

  it("Case A: hides ours while the CMP is actively showing its own message", () => {
    expect(
      shouldShowCustomBanner({
        hasStoredConsent: false,
        cmpConfigured: true,
        cmpStatus: "showing-message",
      }),
    ).toBe(false);
  });

  it("REGRESSION / Case B: shows ours when the CMP resolved but no message applies to this visitor", () => {
    // The exact bug: previously a resolved-but-silent CMP (Chrome/Opera
    // outside the EEA/UK/CH, e.g. Turkey) suppressed the banner, leaving
    // visitors with zero consent UI. It must now show the fallback banner.
    expect(
      shouldShowCustomBanner({
        hasStoredConsent: false,
        cmpConfigured: true,
        cmpStatus: "no-message-applicable",
      }),
    ).toBe(true);
  });

  it("Case C: shows ours when the CMP is configured but failed to load (e.g. blocked by Brave)", () => {
    expect(
      shouldShowCustomBanner({
        hasStoredConsent: false,
        cmpConfigured: true,
        cmpStatus: "unavailable",
      }),
    ).toBe(true);
  });
});
