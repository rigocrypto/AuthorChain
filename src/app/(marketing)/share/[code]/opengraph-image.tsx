import { ImageResponse } from "next/og";
import { resolveShareLanding } from "@/lib/data/referrals";
import {
  OG_SIZE,
  OG_CONTENT_TYPE,
  bookOgElement,
  fetchCoverDataUrl,
} from "@/lib/og/book-card";

export const alt = "Book on AuthorChain";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

/** Social card for a referral-share link. Same renderer as the book OG image. */
export default async function Image({
  params,
}: {
  params: Promise<{ code: string }>;
}) {
  const { code } = await params;
  const landing = await resolveShareLanding(code);

  if (!landing) {
    return new ImageResponse(
      bookOgElement({ title: "AuthorChain", authorName: "Verified Web3 publishing" }),
      { ...size },
    );
  }

  const { book } = landing;
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
