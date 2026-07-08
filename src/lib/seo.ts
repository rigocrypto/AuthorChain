/**
 * Central SEO configuration + helpers. Public metadata only — never reference
 * private routes, storage keys, or secrets here.
 */

import { siteContact } from "@/lib/site-contact";

/** Normalized site origin (no trailing slash). Falls back to the prod alias. */
export const siteUrl = (
  process.env.NEXT_PUBLIC_APP_URL ?? "https://author-chain-alpha.vercel.app"
).replace(/\/+$/, "");

export const siteConfig = {
  name: "AuthorChain",
  readerBrand: "ReaderChain",
  url: siteUrl,
  description:
    "AuthorChain is an AI-powered Web3 publishing platform where authors publish books, prove manuscript ownership on-chain, sell directly, and give readers secure access through ReaderChain.",
  tagline: "Publish. Own. Earn. Grow.",
  keywords: [
    "AuthorChain",
    "ReaderChain",
    "Web3 publishing",
    "blockchain authorship proof",
    "AI publishing platform",
    "self publishing",
    "independent authors",
    "digital books",
    "on-chain proof",
    "book marketplace",
  ],
  twitterCard: "summary_large_image" as const,
};

/** Build an absolute HTTPS URL for a site-relative path. */
export function absoluteUrl(path = "/"): string {
  if (/^https?:\/\//i.test(path)) return path;
  return `${siteUrl}${path.startsWith("/") ? "" : "/"}${path}`;
}

/**
 * Trim text to a search-friendly meta description (~155 chars) on a word
 * boundary, collapsing whitespace. Returns the site default when empty.
 */
export function metaDescription(
  primary?: string | null,
  fallback: string = siteConfig.description,
  max = 155,
): string {
  const text = (primary ?? "").replace(/\s+/g, " ").trim();
  const base = text || fallback;
  if (base.length <= max) return base;
  const cut = base.slice(0, max);
  const lastSpace = cut.lastIndexOf(" ");
  return `${(lastSpace > 40 ? cut.slice(0, lastSpace) : cut).trimEnd()}…`;
}

// --- JSON-LD builders (schema.org). Proof wording stays factual: an on-chain
// manuscript hash — never "legal copyright" / "government registered". ---

export function organizationJsonLd() {
  const sameAs = Object.values(siteContact.social).filter(
    (u): u is string => typeof u === "string" && u.length > 0,
  );

  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: siteConfig.name,
    url: siteConfig.url,
    description: siteConfig.description,
    logo: absoluteUrl("/brand/authorchain-icon-512.png"),
    slogan: siteConfig.tagline,
    email: siteContact.email,
    ...(sameAs.length ? { sameAs } : {}),
  };
}

export function websiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: siteConfig.name,
    url: siteConfig.url,
    description: siteConfig.description,
  };
}

export type BookJsonLdInput = {
  id: string;
  slug: string;
  title: string;
  subtitle: string | null;
  description: string;
  authorName: string;
  category: string;
  language: string;
  price: number;
  currency: string;
  isbn13: string | null;
  pageCount: number | null;
  publicationDate: string | null; // ISO
  hasCover: boolean;
  proofVerified: boolean;
};

export function bookJsonLd(book: BookJsonLdInput) {
  const url = absoluteUrl(`/book/${book.slug}`);
  const jsonLd: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "Book",
    name: book.title,
    url,
    description: metaDescription(book.subtitle ?? book.description, book.description, 300),
    author: { "@type": "Person", name: book.authorName },
    inLanguage: book.language,
    genre: book.category,
    isAccessibleForFree: false,
    // Point at a real, stable public image (the cover) — not the hashed OG route.
    image: book.hasCover
      ? absoluteUrl(`/api/assets/books/${book.id}/cover`)
      : absoluteUrl("/opengraph-image"),
    offers: {
      "@type": "Offer",
      price: book.price.toFixed(2),
      priceCurrency: book.currency,
      availability: "https://schema.org/InStock",
      url,
    },
  };
  if (book.subtitle) jsonLd.alternativeHeadline = book.subtitle;
  if (book.isbn13) jsonLd.isbn = book.isbn13;
  if (book.pageCount) jsonLd.numberOfPages = book.pageCount;
  if (book.publicationDate) jsonLd.datePublished = book.publicationDate.slice(0, 10);
  return jsonLd;
}

/** Serialize JSON-LD safely for embedding in a <script> tag. */
export function jsonLdScript(data: unknown): string {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}
