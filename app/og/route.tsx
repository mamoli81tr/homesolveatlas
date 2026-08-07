import { ImageResponse } from "next/og";
import { siteConfig } from "@/config/site";

export const runtime = "nodejs";

const WIDTH = 1200;
const HEIGHT = 630;

/**
 * Shared dynamic Open Graph image generator, e.g. `/og?title=...&category=...`.
 * One route serves every article/calculator/hub instead of a static
 * `opengraph-image.tsx` per dynamic segment — scales to any number of pages
 * with zero extra files, and needs no uploaded photography.
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const title = (searchParams.get("title") || siteConfig.tagline).slice(0, 140);
  const category = (searchParams.get("category") || "").slice(0, 40);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "72px",
          backgroundColor: "#0b1220",
          backgroundImage: "linear-gradient(135deg, #0b1220 0%, #14264a 55%, #0b3b33 100%)",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div
            style={{
              width: 56,
              height: 56,
              borderRadius: 16,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: "linear-gradient(135deg, #2563eb, #10b981)",
            }}
          >
            {/* Compass brand mark — matches app/icon.svg and components/layout/Logo.tsx */}
            <svg width="30" height="30" viewBox="0 0 64 64">
              <circle cx="32" cy="32" r="16" fill="none" stroke="#ffffff" strokeWidth="3.2" />
              <path d="M38 26 L29 29 L26 38 L35 35 Z" fill="#ffffff" />
              <circle cx="32" cy="32" r="2.4" fill="#2563eb" />
            </svg>
          </div>
          <div style={{ display: "flex", fontSize: 30, fontWeight: 700, color: "#ffffff" }}>
            {siteConfig.name}
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          {category && (
            <div
              style={{
                display: "flex",
                fontSize: 26,
                fontWeight: 600,
                color: "#7dd3fc",
                textTransform: "uppercase",
                letterSpacing: 2,
              }}
            >
              {category}
            </div>
          )}
          <div
            style={{
              display: "flex",
              fontSize: 56,
              fontWeight: 800,
              lineHeight: 1.15,
              color: "#ffffff",
              maxWidth: 980,
            }}
          >
            {title}
          </div>
        </div>

        <div style={{ display: "flex", fontSize: 22, color: "#94a3b8" }}>
          {siteConfig.tagline}
        </div>
      </div>
    ),
    { width: WIDTH, height: HEIGHT },
  );
}
