import { ImageResponse } from "next/og";
import { getPublicBookBySlug } from "@/lib/data/books";
import {
  OG_SIZE,
  OG_CONTENT_TYPE,
  bookOgElement,
  fetchCoverDataUrl,
} from "@/lib/og/book-card";

export const alt = "Book on AuthorChain";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

/**
 * Dynamic 1200×630 social card for a public book. Public data only — cover is
 * pulled through the public asset route; no private manuscript or signed URLs.
 */
export default async function Image({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const book = await getPublicBookBySlug(slug);

  if (!book) {
    // Fall back to a branded card rather than erroring for missing/unpublished.
    return new ImageResponse(
      bookOgElement({ title: "AuthorChain", authorName: "Verified Web3 publishing" }),
      { ...size },
    );
  }

  const coverDataUrl = book.hasCover ? await fetchCoverDataUrl(book.id) : null;

  return new ImageResponse(
    bookOgElement({
      title: book.title,
      subtitle: book.subtitle,
      authorName: book.authorName,
      category: book.category,
      price: book.price,
      currency: book.currency,
      proofVerified: book.proofVerified,
      coverDataUrl,
    }),
    { ...size },
  );
}
