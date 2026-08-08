import { describe, it, expect } from "vitest";
import { getPublicUrlPaths, getPublicUrlPathSet } from "@/lib/seo/publicUrls";

describe("getPublicUrlPaths", () => {
  it("includes the homepage and known static pages", () => {
    const paths = getPublicUrlPaths();
    expect(paths).toContain("/");
    expect(paths).toContain("/calculators");
    expect(paths).toContain("/about");
  });

  it("includes a known, real article href", () => {
    const paths = getPublicUrlPaths();
    expect(paths).toContain("/appliances/dishwashers/spray-arm-not-spinning");
  });

  it("excludes the internal search route", () => {
    const paths = getPublicUrlPaths();
    expect(paths).not.toContain("/search");
  });

  it("contains no duplicate paths", () => {
    const paths = getPublicUrlPaths();
    expect(new Set(paths).size).toBe(paths.length);
  });

  it("getPublicUrlPathSet returns the same membership as the array", () => {
    const paths = getPublicUrlPaths();
    const set = getPublicUrlPathSet();
    for (const p of paths) expect(set.has(p)).toBe(true);
    expect(set.size).toBe(new Set(paths).size);
  });
});
