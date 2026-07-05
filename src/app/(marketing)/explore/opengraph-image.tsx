import { ImageResponse } from "next/og";
import { siteOgElement, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/og/book-card";

// Social card for the ReaderChain marketplace (/explore).
export const alt = "ReaderChain — Discover verified books";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default function OpengraphImage() {
  return new ImageResponse(
    siteOgElement({
      eyebrow: "ReaderChain",
      heading: "Discover verified books.",
      sub: "Books from independent authors with verified on-chain authorship proof, secure previews, and reader library access.",
    }),
    { ...size },
  );
}
