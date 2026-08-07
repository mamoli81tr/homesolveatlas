import { describe, it, expect } from "vitest";
import { slugify } from "@/lib/utils/slugify";

describe("slugify", () => {
  it("lowercases and hyphenates a normal title", () => {
    expect(slugify("Why Is My Washing Machine Not Draining?")).toBe(
      "why-is-my-washing-machine-not-draining",
    );
  });

  it("strips punctuation and collapses whitespace", () => {
    expect(slugify("LG Refrigerator: Not Cooling, but Freezer Works!")).toBe(
      "lg-refrigerator-not-cooling-but-freezer-works",
    );
  });

  it("collapses multiple separators into a single hyphen", () => {
    expect(slugify("Samsung Washer -- 4C Error")).toBe("samsung-washer-4c-error");
  });

  it("trims leading and trailing hyphens", () => {
    expect(slugify("  -- Hello World -- ")).toBe("hello-world");
  });

  it("removes apostrophes rather than turning them into hyphens", () => {
    expect(slugify("Don't Do This")).toBe("dont-do-this");
  });

  it("is idempotent", () => {
    const once = slugify("How Much Paint Do I Need for a Room?");
    expect(slugify(once)).toBe(once);
  });
});
