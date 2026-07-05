import { ImageResponse } from "next/og";
import type { ReactElement } from "react";
import sharp from "sharp";
import { OG_SIZE } from "./book-card";

/**
 * MIME type for the JPEG social cards. Exported so `opengraph-image` routes can
 * set `contentType` (which drives the `og:image:type` meta tag) to match.
 */
export const OG_JPEG_CONTENT_TYPE = "image/jpeg";

/**
 * Render an OG element to a compressed JPEG `Response`.
 *
 * `next/og` (`ImageResponse`) only emits lossless PNG. Once a photographic book
 * cover is embedded, that PNG exceeds ~370 KB — over WhatsApp's ~300 KB
 * `og:image` cap, so WhatsApp shows the bare link with no preview. Re-encoding
 * to JPEG (~q80, mozjpeg) brings a full cover card down to well under 300 KB
 * while staying visually crisp, so previews render on WhatsApp and everywhere.
 */
export async function ogJpegResponse(element: ReactElement): Promise<Response> {
  const png = await new ImageResponse(element, { ...OG_SIZE }).arrayBuffer();
  const jpeg = await sharp(Buffer.from(png))
    .jpeg({ quality: 80, mozjpeg: true })
    .toBuffer();

  return new Response(new Uint8Array(jpeg), {
    headers: {
      "Content-Type": OG_JPEG_CONTENT_TYPE,
      // Mirror ImageResponse's caching so the CDN serves the card cheaply;
      // covers change rarely.
      "Cache-Control":
        "public, max-age=3600, s-maxage=86400, stale-while-revalidate=604800",
    },
  });
}
