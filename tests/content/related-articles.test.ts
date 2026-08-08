import { describe, it, expect } from "vitest";
import { getArticleByHref, getRelatedArticles } from "@/lib/content/queries";

describe("getRelatedArticles", () => {
  it("prioritizes explicit relatedArticles from frontmatter, in order", () => {
    const article = getArticleByHref("/appliances/washing-machines/not-draining");
    expect(article).toBeDefined();
    const related = getRelatedArticles(article!);

    expect(related[0]?.href).toBe("/appliances/washing-machines/hums-but-wont-drain");
    expect(related[1]?.href).toBe(
      "/appliances/washing-machines/drain-pump-runs-but-water-stays-inside",
    );
  });

  it("never includes the article itself", () => {
    const article = getArticleByHref("/error-codes/samsung/washer-4c-error");
    const related = getRelatedArticles(article!);
    expect(related.some((a) => a.href === article!.href)).toBe(false);
  });

  it("fills remaining slots using signal-based scoring when explicit links run out", () => {
    const article = getArticleByHref(
      "/appliances/refrigerators/not-cooling-but-freezer-works",
    );
    const related = getRelatedArticles(article!);
    // No explicit relatedArticles set on this one, so everything is score-based.
    expect(related.length).toBeGreaterThan(0);
  });

  it("respects the limit parameter", () => {
    const article = getArticleByHref("/heating-cooling/radiator-cold-at-the-bottom");
    const related = getRelatedArticles(article!, 2);
    expect(related.length).toBeLessThanOrEqual(2);
  });
});
