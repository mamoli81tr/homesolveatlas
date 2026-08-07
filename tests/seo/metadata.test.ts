import { describe, it, expect } from "vitest";
import { buildMetadata } from "@/lib/seo/metadata";
import { siteConfig } from "@/config/site";

describe("buildMetadata", () => {
  it("appends the site name to the title for non-home pages", () => {
    const meta = buildMetadata({
      title: "Paint Calculator",
      description: "A description long enough.",
      path: "/calculators/paint-calculator",
    });
    expect(meta.title).toEqual({ absolute: `Paint Calculator | ${siteConfig.name}` });
  });

  it("does not append the site name for the home page", () => {
    const meta = buildMetadata({
      title: "Home Title",
      description: "A description long enough.",
      path: "/",
    });
    expect(meta.title).toEqual({ absolute: "Home Title" });
  });

  it("builds an absolute canonical URL from the path", () => {
    const meta = buildMetadata({
      title: "Test",
      description: "A description long enough.",
      path: "/appliances/washing-machines/not-draining",
    });
    expect(meta.alternates?.canonical).toBe(
      `${siteConfig.url}/appliances/washing-machines/not-draining`,
    );
  });

  it("defaults to indexable, follow robots directives", () => {
    const meta = buildMetadata({
      title: "Test",
      description: "A description long enough.",
      path: "/test",
    });
    expect(meta.robots).toMatchObject({ index: true, follow: true });
  });

  it("sets noindex when requested", () => {
    const meta = buildMetadata({
      title: "Test",
      description: "A description long enough.",
      path: "/test",
      noindex: true,
    });
    expect(meta.robots).toMatchObject({ index: false, follow: false });
  });

  it("sets Open Graph type to article and includes dates for articles", () => {
    const meta = buildMetadata({
      title: "Test Article",
      description: "A description long enough.",
      path: "/cleaning/test-article",
      type: "article",
      publishedAt: "2026-01-01",
      updatedAt: "2026-02-01",
    });
    expect(meta.openGraph).toMatchObject({ type: "article" });
  });
});
