import { describe, it, expect } from "vitest";
import { searchArticles } from "@/lib/content/queries";

describe("searchArticles", () => {
  it("returns an empty array for an empty query", () => {
    expect(searchArticles("")).toEqual([]);
    expect(searchArticles("   ")).toEqual([]);
  });

  it("finds an article by error code", () => {
    const results = searchArticles("4C");
    expect(results.length).toBeGreaterThan(0);
    expect(results[0]?.article.frontmatter.errorCode).toBe("4C");
  });

  it("finds an article by a distinctive keyword in the title", () => {
    const results = searchArticles("towels smell");
    expect(
      results.some((r) => r.article.href.includes("why-do-towels-smell-after-washing")),
    ).toBe(true);
  });

  it("is case-insensitive", () => {
    const lower = searchArticles("mold");
    const upper = searchArticles("MOLD");
    expect(lower.map((r) => r.article.href)).toEqual(upper.map((r) => r.article.href));
  });

  it("ranks results by relevance score, highest first", () => {
    const results = searchArticles("dishwasher");
    for (let i = 1; i < results.length; i++) {
      expect(results[i - 1]?.score).toBeGreaterThanOrEqual(results[i]?.score ?? 0);
    }
  });

  it("returns no results for nonsense queries", () => {
    expect(searchArticles("zzznonexistentqueryxyz")).toEqual([]);
  });
});
