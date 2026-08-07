import { describe, it, expect } from "vitest";
import { getArticleAdPlan } from "@/components/ads/adDensity";

describe("getArticleAdPlan", () => {
  it("shows only the bookend ads for short articles", () => {
    const plan = getArticleAdPlan(200);
    expect(plan).toEqual({ mid35: false, mid70: false, sidebar: false, mobileSticky: false });
  });

  it("adds mid-content, sidebar, and mobile-sticky ads for medium articles", () => {
    const plan = getArticleAdPlan(500);
    expect(plan).toEqual({ mid35: true, mid70: false, sidebar: true, mobileSticky: true });
  });

  it("shows the full set for long articles", () => {
    const plan = getArticleAdPlan(900);
    expect(plan).toEqual({ mid35: true, mid70: true, sidebar: true, mobileSticky: true });
  });

  it("is monotonic — more words never means fewer ad slots", () => {
    const short = getArticleAdPlan(100);
    const medium = getArticleAdPlan(400);
    const long = getArticleAdPlan(1000);
    const count = (p: ReturnType<typeof getArticleAdPlan>) => Object.values(p).filter(Boolean).length;
    expect(count(short)).toBeLessThanOrEqual(count(medium));
    expect(count(medium)).toBeLessThanOrEqual(count(long));
  });
});
