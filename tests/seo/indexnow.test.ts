import { describe, it, expect, vi, afterEach } from "vitest";
import {
  validateIndexNowUrl,
  dedupeUrls,
  buildIndexNowPayload,
  matchIndexNowKeyFile,
  getIndexNowKey,
  isIndexNowConfigured,
  getIndexNowKeyLocation,
  submitToIndexNow,
  INDEXNOW_HOST,
  INDEXNOW_ENDPOINT,
} from "@/lib/seo/indexnow";

// A real, published article href — guaranteed sitemap-eligible.
const REAL_ARTICLE_PATH = "/appliances/dishwashers/spray-arm-not-spinning";
const REAL_ARTICLE_URL = `https://${INDEXNOW_HOST}${REAL_ARTICLE_PATH}`;

afterEach(() => {
  vi.unstubAllEnvs();
});

describe("getIndexNowKey / isIndexNowConfigured", () => {
  it("is undefined/false when INDEXNOW_KEY is unset", () => {
    vi.stubEnv("INDEXNOW_KEY", "");
    expect(getIndexNowKey()).toBeUndefined();
    expect(isIndexNowConfigured()).toBe(false);
  });

  it("reads and trims INDEXNOW_KEY when set", () => {
    vi.stubEnv("INDEXNOW_KEY", "  abc123  ");
    expect(getIndexNowKey()).toBe("abc123");
    expect(isIndexNowConfigured()).toBe(true);
  });
});

describe("getIndexNowKeyLocation", () => {
  it("builds the key file URL on the production host", () => {
    expect(getIndexNowKeyLocation("mykey123")).toBe(
      `https://${INDEXNOW_HOST}/mykey123.txt`,
    );
  });
});

describe("matchIndexNowKeyFile", () => {
  it("returns the key when the pathname matches exactly", () => {
    expect(matchIndexNowKeyFile("/abc123.txt", "abc123")).toBe("abc123");
  });

  it("returns null when the pathname doesn't match", () => {
    expect(matchIndexNowKeyFile("/other.txt", "abc123")).toBeNull();
    expect(matchIndexNowKeyFile("/abc123", "abc123")).toBeNull();
  });

  it("returns null when no key is configured", () => {
    expect(matchIndexNowKeyFile("/abc123.txt", undefined)).toBeNull();
  });
});

describe("validateIndexNowUrl — canonical host filtering", () => {
  it("accepts a well-formed URL on the production host", () => {
    const result = validateIndexNowUrl(REAL_ARTICLE_URL);
    expect(result.ok).toBe(true);
    expect(result.url).toBe(REAL_ARTICLE_URL);
  });

  it("rejects localhost", () => {
    const result = validateIndexNowUrl(`http://localhost:3000${REAL_ARTICLE_PATH}`);
    expect(result.ok).toBe(false);
  });

  it("rejects a Vercel preview URL", () => {
    const result = validateIndexNowUrl(
      `https://homesolveatlas-git-feature-branch.vercel.app${REAL_ARTICLE_PATH}`,
    );
    expect(result.ok).toBe(false);
    expect(result.reason).toMatch(/host/i);
  });

  it("rejects an external domain", () => {
    const result = validateIndexNowUrl(`https://example.com${REAL_ARTICLE_PATH}`);
    expect(result.ok).toBe(false);
  });

  it("rejects non-https URLs on the correct host", () => {
    const result = validateIndexNowUrl(`http://${INDEXNOW_HOST}${REAL_ARTICLE_PATH}`);
    expect(result.ok).toBe(false);
    expect(result.reason).toMatch(/https/i);
  });

  it("rejects malformed/invalid URLs", () => {
    expect(validateIndexNowUrl("not a url").ok).toBe(false);
    expect(validateIndexNowUrl("").ok).toBe(false);
    expect(validateIndexNowUrl("/just-a-path").ok).toBe(false);
  });
});

describe("validateIndexNowUrl — exclusions", () => {
  it("rejects the internal /search route", () => {
    const result = validateIndexNowUrl(`https://${INDEXNOW_HOST}/search`);
    expect(result.ok).toBe(false);
    expect(result.reason).toMatch(/search/i);
  });

  it("rejects /search with a query string path", () => {
    const result = validateIndexNowUrl(`https://${INDEXNOW_HOST}/search/anything`);
    expect(result.ok).toBe(false);
  });

  it("rejects a URL not in the sitemap-eligible set on 'update' (covers draft/noindexed/typo paths)", () => {
    const result = validateIndexNowUrl(
      `https://${INDEXNOW_HOST}/appliances/dishwashers/this-slug-does-not-exist`,
    );
    expect(result.ok).toBe(false);
    expect(result.reason).toMatch(/sitemap-eligible/i);
  });

  it("allows a URL outside the sitemap-eligible set on 'delete' events", () => {
    const result = validateIndexNowUrl(
      `https://${INDEXNOW_HOST}/appliances/dishwashers/this-slug-was-removed`,
      "delete",
    );
    expect(result.ok).toBe(true);
  });

  it("still rejects a bad host on 'delete' events", () => {
    const result = validateIndexNowUrl(
      `https://example.com/appliances/dishwashers/this-slug-was-removed`,
      "delete",
    );
    expect(result.ok).toBe(false);
  });
});

describe("dedupeUrls", () => {
  it("removes duplicate entries while preserving first-seen order", () => {
    expect(dedupeUrls(["a", "b", "a", "c", "b"])).toEqual(["a", "b", "c"]);
  });

  it("returns an empty array for empty input", () => {
    expect(dedupeUrls([])).toEqual([]);
  });
});

describe("buildIndexNowPayload", () => {
  it("produces the official IndexNow bulk JSON shape", () => {
    const payload = buildIndexNowPayload([REAL_ARTICLE_URL, REAL_ARTICLE_URL], "mykey");
    expect(payload).toEqual({
      host: INDEXNOW_HOST,
      key: "mykey",
      keyLocation: `https://${INDEXNOW_HOST}/mykey.txt`,
      urlList: [REAL_ARTICLE_URL],
    });
  });
});

describe("submitToIndexNow", () => {
  it("does not call fetch and reports an error when INDEXNOW_KEY is unset", async () => {
    vi.stubEnv("INDEXNOW_KEY", "");
    const fetchImpl = vi.fn();
    const result = await submitToIndexNow([REAL_ARTICLE_URL], { fetchImpl });
    expect(fetchImpl).not.toHaveBeenCalled();
    expect(result.error).toMatch(/INDEXNOW_KEY/);
    expect(result.submitted).toEqual([]);
  });

  it("filters invalid URLs into `rejected` and only submits valid ones", async () => {
    vi.stubEnv("INDEXNOW_KEY", "testkey");
    const fetchImpl = vi.fn().mockResolvedValue(new Response(null, { status: 200 }));

    const result = await submitToIndexNow(
      [REAL_ARTICLE_URL, "https://example.com/not-us", "not a url"],
      { fetchImpl },
    );

    expect(result.submitted).toEqual([REAL_ARTICLE_URL]);
    expect(result.rejected).toHaveLength(2);
    expect(fetchImpl).toHaveBeenCalledTimes(1);
  });

  it("sends a well-formed POST request to the IndexNow endpoint", async () => {
    vi.stubEnv("INDEXNOW_KEY", "testkey");
    const fetchImpl = vi.fn().mockResolvedValue(new Response(null, { status: 200 }));

    await submitToIndexNow([REAL_ARTICLE_URL], { fetchImpl });

    expect(fetchImpl).toHaveBeenCalledWith(
      INDEXNOW_ENDPOINT,
      expect.objectContaining({
        method: "POST",
        headers: expect.objectContaining({ "Content-Type": "application/json; charset=utf-8" }),
      }),
    );
    const body = JSON.parse(fetchImpl.mock.calls[0]?.[1]?.body as string);
    expect(body).toEqual({
      host: INDEXNOW_HOST,
      key: "testkey",
      keyLocation: `https://${INDEXNOW_HOST}/testkey.txt`,
      urlList: [REAL_ARTICLE_URL],
    });
  });

  it("does not call fetch at all when every URL is rejected", async () => {
    vi.stubEnv("INDEXNOW_KEY", "testkey");
    const fetchImpl = vi.fn();
    const result = await submitToIndexNow(["https://example.com/nope"], { fetchImpl });
    expect(fetchImpl).not.toHaveBeenCalled();
    expect(result.submitted).toEqual([]);
    expect(result.response).toBeUndefined();
  });

  it("reports a network error without throwing", async () => {
    vi.stubEnv("INDEXNOW_KEY", "testkey");
    const fetchImpl = vi.fn().mockRejectedValue(new Error("boom"));
    const result = await submitToIndexNow([REAL_ARTICLE_URL], { fetchImpl });
    expect(result.error).toMatch(/boom/);
  });

  it("deduplicates URLs before submitting", async () => {
    vi.stubEnv("INDEXNOW_KEY", "testkey");
    const fetchImpl = vi.fn().mockResolvedValue(new Response(null, { status: 200 }));
    const result = await submitToIndexNow([REAL_ARTICLE_URL, REAL_ARTICLE_URL], { fetchImpl });
    expect(result.submitted).toEqual([REAL_ARTICLE_URL]);
  });
});
