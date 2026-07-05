import { ImageResponse } from "next/og";
import { siteOgElement, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/og/book-card";

// Default social card for public marketing pages (home + any without their own).
export const alt = "AuthorChain — AI-powered Web3 publishing for authors";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default function OpengraphImage() {
  return new ImageResponse(
    siteOgElement({
      heading: "Publish, prove, sell, and deliver books.",
      sub: "AI-powered Web3 publishing with on-chain manuscript proof, direct checkout, and secure ReaderChain library access.",
    }),
    { ...size },
  );
}
