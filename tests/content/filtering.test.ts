import { describe, it, expect } from "vitest";
import { getArticlesByCategory, filterArticles } from "@/lib/content/queries";

describe("content filtering", () => {
  it("filters error-codes articles by brand", () => {
    const all = getArticlesByCategory("error-codes");
    const samsungOnly = filterArticles(all, { brand: "samsung" });

    expect(samsungOnly.length).toBeGreaterThan(0);
    expect(samsungOnly.every((a) => a.frontmatter.brand === "samsung")).toBe(true);
  });

  it("filters appliance articles by subcategory", () => {
    const all = getArticlesByCategory("appliances");
    const washers = filterArticles(all, { subcategory: "washing-machines" });

    expect(washers.length).toBeGreaterThan(0);
    expect(washers.every((a) => a.frontmatter.subcategory === "washing-machines")).toBe(
      true,
    );
  });

  it("filters by room", () => {
    const all = getArticlesByCategory("cleaning");
    const bathroomOnly = filterArticles(all, { room: "bathroom" });

    expect(bathroomOnly.length).toBeGreaterThan(0);
    expect(bathroomOnly.every((a) => a.frontmatter.room.includes("bathroom"))).toBe(true);
  });

  it("returns an empty array when no article matches every filter", () => {
    const all = getArticlesByCategory("appliances");
    const result = filterArticles(all, { brand: "some-brand-that-does-not-exist" });
    expect(result).toEqual([]);
  });

  it("returns all articles when no filters are given", () => {
    const all = getArticlesByCategory("maintenance");
    expect(filterArticles(all, {})).toHaveLength(all.length);
  });
});
