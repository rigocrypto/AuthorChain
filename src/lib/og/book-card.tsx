import { siteUrl } from "@/lib/seo";

/**
 * Shared 1200×630 social card for public book + referral-share Open Graph
 * images. Pure presentation for `next/og` (satori) — no client hooks, no
 * private data. Rendered by the book and /share opengraph-image routes.
 */

export const OG_SIZE = { width: 1200, height: 630 };
export const OG_CONTENT_TYPE = "image/png";

export type BookOgProps = {
  title: string;
  subtitle?: string | null;
  authorName: string;
  category?: string | null;
  price?: number | null;
  currency?: string | null;
  proofVerified?: boolean;
  coverDataUrl?: string | null;
};

function clamp(text: string, max: number): string {
  const t = text.replace(/\s+/g, " ").trim();
  return t.length <= max ? t : `${t.slice(0, max - 1).trimEnd()}…`;
}

/**
 * Fetch a book cover through the public asset route and return a data URI.
 * Skips non-PNG/JPEG (satori can't rasterize WEBP reliably) and any failure —
 * callers fall back to the gradient placeholder. Never touches private files.
 */
export async function fetchCoverDataUrl(bookId: string): Promise<string | null> {
  try {
    const res = await fetch(`${siteUrl}/api/assets/books/${bookId}/cover`, {
      // Cache within the OG route; covers change rarely.
      next: { revalidate: 3600 },
    });
    if (!res.ok) return null;
    const type = res.headers.get("content-type") ?? "";
    if (!/image\/(png|jpe?g)/i.test(type)) return null;
    const buf = Buffer.from(await res.arrayBuffer());
    if (buf.byteLength > 3_000_000) return null; // keep OG generation light
    return `data:${type};base64,${buf.toString("base64")}`;
  } catch {
    return null;
  }
}

/** Branded site card used for section landing pages (home, explore). */
export function siteOgElement({
  heading,
  sub,
  eyebrow = "AuthorChain",
}: {
  heading: string;
  sub: string;
  eyebrow?: string;
}) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        width: "100%",
        height: "100%",
        padding: 80,
        justifyContent: "center",
        background: "linear-gradient(135deg, #07070b 0%, #0e0a22 55%, #14082e 100%)",
        color: "#f4f4f7",
        fontFamily: "sans-serif",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", marginBottom: 28 }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: 72,
            height: 72,
            borderRadius: 18,
            marginRight: 24,
            background: "linear-gradient(135deg, #7c5cff, #22d3ee)",
            color: "#ffffff",
            fontWeight: 800,
            fontSize: 44,
          }}
        >
          A
        </div>
        <div style={{ display: "flex", fontSize: 44, fontWeight: 800 }}>{eyebrow}</div>
      </div>
      <div style={{ display: "flex", fontSize: 64, fontWeight: 800, lineHeight: 1.05, maxWidth: 960 }}>
        {heading}
      </div>
      <div style={{ display: "flex", fontSize: 30, color: "#c7c7d6", marginTop: 24, maxWidth: 940 }}>
        {sub}
      </div>
      <div style={{ display: "flex", fontSize: 26, color: "#22d3ee", marginTop: 40, letterSpacing: 2 }}>
        PUBLISH. OWN. EARN. GROW.
      </div>
    </div>
  );
}

export function bookOgElement(props: BookOgProps) {
  const { title, subtitle, authorName, category, price, currency, proofVerified, coverDataUrl } =
    props;

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        width: "100%",
        height: "100%",
        background: "linear-gradient(135deg, #07070b 0%, #0e0a22 55%, #14082e 100%)",
        color: "#f4f4f7",
        padding: 64,
        fontFamily: "sans-serif",
      }}
    >
      {/* Cover + text */}
      <div style={{ display: "flex", flex: 1 }}>
        {/* Cover (or gradient placeholder) */}
        <div
          style={{
            display: "flex",
            width: 300,
            height: 450,
            borderRadius: 20,
            border: "1px solid #2b2b40",
            marginRight: 56,
            overflow: "hidden",
            flexShrink: 0,
            boxShadow: "0 24px 60px rgba(124,92,255,0.35)",
            background: "linear-gradient(160deg, #7c5cff 0%, #22d3ee 100%)",
            alignItems: "flex-end",
          }}
        >
          {coverDataUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={coverDataUrl}
              alt=""
              width={300}
              height={450}
              style={{ width: 300, height: 450, objectFit: "cover" }}
            />
          ) : (
            <div style={{ display: "flex", padding: 28, fontSize: 38, fontWeight: 700, color: "#0b0b12" }}>
              {clamp(title, 40)}
            </div>
          )}
        </div>

        {/* Text column */}
        <div style={{ display: "flex", flexDirection: "column", flex: 1, justifyContent: "center" }}>
          {category ? (
            <div
              style={{
                display: "flex",
                alignSelf: "flex-start",
                color: "#22d3ee",
                fontSize: 24,
                letterSpacing: 3,
                textTransform: "uppercase",
                marginBottom: 18,
              }}
            >
              {clamp(category, 28)}
            </div>
          ) : null}

          <div style={{ display: "flex", fontSize: 58, fontWeight: 800, lineHeight: 1.05 }}>
            {clamp(title, 60)}
          </div>

          {subtitle ? (
            <div style={{ display: "flex", fontSize: 30, color: "#c7c7d6", marginTop: 16 }}>
              {clamp(subtitle, 90)}
            </div>
          ) : null}

          <div style={{ display: "flex", fontSize: 28, color: "#9b9bb0", marginTop: 20 }}>
            by {clamp(authorName, 40)}
          </div>

          <div style={{ display: "flex", alignItems: "center", marginTop: 34 }}>
            {price != null ? (
              <div style={{ display: "flex", fontSize: 40, fontWeight: 700 }}>
                ${price.toFixed(2)} {currency ?? "USD"}
              </div>
            ) : null}
            {proofVerified ? (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  marginLeft: price != null ? 28 : 0,
                  padding: "10px 20px",
                  borderRadius: 999,
                  border: "1px solid #d9a441",
                  color: "#f2c877",
                  background: "rgba(217,164,65,0.12)",
                  fontSize: 22,
                  fontWeight: 700,
                  letterSpacing: 1,
                }}
              >
                ✦ VERIFIED ON-CHAIN
              </div>
            ) : null}
          </div>
        </div>
      </div>

      {/* Branding footer */}
      <div style={{ display: "flex", alignItems: "center", color: "#9b9bb0", fontSize: 24 }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: 40,
            height: 40,
            borderRadius: 10,
            marginRight: 14,
            background: "linear-gradient(135deg, #7c5cff, #22d3ee)",
            color: "#ffffff",
            fontWeight: 800,
            fontSize: 24,
          }}
        >
          A
        </div>
        ReaderChain by AuthorChain · Publish. Own. Earn. Grow.
      </div>
    </div>
  );
}
