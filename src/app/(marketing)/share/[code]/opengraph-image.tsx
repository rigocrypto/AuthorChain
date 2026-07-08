import { resolveShareLanding } from "@/lib/data/referrals";
import { getLocale } from "@/i18n/get-dictionary";
import { OG_SIZE, bookOgElement, fetchCoverDataUrl } from "@/lib/og/book-card";
import { OG_JPEG_CONTENT_TYPE, ogJpegResponse } from "@/lib/og/jpeg";

export const alt = "Book on AuthorChain";
export const size = OG_SIZE;
// JPEG (not the default PNG) so the embedded cover card stays under WhatsApp's
// ~300 KB og:image cap and previews reliably. See lib/og/jpeg.tsx.
export const contentType = OG_JPEG_CONTENT_TYPE;

/** Social card for a referral-share link. Same renderer as the book OG image. */
export default async function Image({
  params,
}: {
  params: Promise<{ code: string }>;
}) {
  const { code } = await params;
  const locale = await getLocale();
  const landing = await resolveShareLanding(code, locale);

  if (!landing) {
    return ogJpegResponse(
      bookOgElement({ title: "AuthorChain", authorName: "Verified Web3 publishing" }),
    );
  }

  const { book } = landing;
  const coverDataUrl = book.hasCover ? await fetchCoverDataUrl(book.id) : null;

  return ogJpegResponse(
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
  );
}
