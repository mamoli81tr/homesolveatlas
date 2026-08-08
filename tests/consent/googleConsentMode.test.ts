import { describe, it, expect } from "vitest";
import {
  buildConsentModeUpdate,
  mapConsentModeUpdateToState,
  CONSENT_MODE_DEFAULT,
  CONSENT_MODE_SIGNALS,
} from "@/lib/consent/googleConsentMode";

describe("CONSENT_MODE_DEFAULT", () => {
  it("denies all four signals by default — no region scoping", () => {
    for (const signal of CONSENT_MODE_SIGNALS) {
      expect(CONSENT_MODE_DEFAULT[signal]).toBe("denied");
    }
  });
});

describe("buildConsentModeUpdate", () => {
  it("maps analytics: true to analytics_storage: granted", () => {
    const update = buildConsentModeUpdate({ analytics: true, advertising: false });
    expect(update.analytics_storage).toBe("granted");
  });

  it("maps analytics: false to analytics_storage: denied", () => {
    const update = buildConsentModeUpdate({ analytics: false, advertising: false });
    expect(update.analytics_storage).toBe("denied");
  });

  it("maps advertising: true to all three ad-related signals granted", () => {
    const update = buildConsentModeUpdate({ analytics: false, advertising: true });
    expect(update.ad_storage).toBe("granted");
    expect(update.ad_user_data).toBe("granted");
    expect(update.ad_personalization).toBe("granted");
  });

  it("maps advertising: false to all three ad-related signals denied", () => {
    const update = buildConsentModeUpdate({ analytics: false, advertising: false });
    expect(update.ad_storage).toBe("denied");
    expect(update.ad_user_data).toBe("denied");
    expect(update.ad_personalization).toBe("denied");
  });

  it("reject-non-essential (both false) denies every signal", () => {
    const update = buildConsentModeUpdate({ analytics: false, advertising: false });
    for (const signal of CONSENT_MODE_SIGNALS) {
      expect(update[signal]).toBe("denied");
    }
  });

  it("accept-all (both true) grants every signal", () => {
    const update = buildConsentModeUpdate({ analytics: true, advertising: true });
    for (const signal of CONSENT_MODE_SIGNALS) {
      expect(update[signal]).toBe("granted");
    }
  });

  it("always returns all four keys (Required<ConsentModeParams>)", () => {
    const update = buildConsentModeUpdate({ analytics: true, advertising: false });
    expect(Object.keys(update).sort()).toEqual([...CONSENT_MODE_SIGNALS].sort());
  });
});

describe("mapConsentModeUpdateToState", () => {
  it("maps a full update with everything granted", () => {
    const state = mapConsentModeUpdateToState(
      {
        analytics_storage: "granted",
        ad_storage: "granted",
        ad_user_data: "granted",
        ad_personalization: "granted",
      },
      null,
    );
    expect(state).toEqual({ analytics: true, advertising: true });
  });

  it("maps a full update with everything denied", () => {
    const state = mapConsentModeUpdateToState(
      {
        analytics_storage: "denied",
        ad_storage: "denied",
        ad_user_data: "denied",
        ad_personalization: "denied",
      },
      null,
    );
    expect(state).toEqual({ analytics: false, advertising: false });
  });

  it("treats a signal missing from `previous` and the update as denied", () => {
    const state = mapConsentModeUpdateToState({}, null);
    expect(state).toEqual({ analytics: false, advertising: false });
  });

  it("falls back to `previous` for a signal absent from a partial update", () => {
    const previous = { analytics: true, advertising: true, necessary: true as const };
    const state = mapConsentModeUpdateToState({ analytics_storage: "denied" }, previous);
    // analytics_storage was explicitly present -> honored
    expect(state.analytics).toBe(false);
    // ad_storage was absent from this update -> falls back to previous, not denied
    expect(state.advertising).toBe(true);
  });

  it("does not silently regress a previously-granted signal omitted from a partial update", () => {
    const previous = { analytics: true, advertising: false, necessary: true as const };
    const state = mapConsentModeUpdateToState({ ad_storage: "granted" }, previous);
    expect(state.advertising).toBe(true);
    expect(state.analytics).toBe(true); // untouched, preserved from previous
  });

  it("round-trips through buildConsentModeUpdate for every combination", () => {
    for (const analytics of [true, false]) {
      for (const advertising of [true, false]) {
        const update = buildConsentModeUpdate({ analytics, advertising });
        const state = mapConsentModeUpdateToState(update, null);
        expect(state).toEqual({ analytics, advertising });
      }
    }
  });
});
