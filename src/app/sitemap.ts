import type { MetadataRoute } from "next";
import { listPublishedBookRefs } from "@/lib/data/books";
import { absoluteUrl } from "@/lib/seo";

// Rebuild the sitemap at request time so newly published books appear. Only
// public, published, non-archived books are included. /share/[code] pages are
// intentionally excluded (they canonicalize to /book/[slug]).
export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticEntries: MetadataRoute.Sitemap = [
    { url: absoluteUrl("/"), changeFrequency: "weekly", priority: 1 },
    { url: absoluteUrl("/explore"), changeFrequency: "daily", priority: 0.9 },
  ];

  let books: { slug: string; updatedAt: Date }[] = [];
  try {
    books = await listPublishedBookRefs();
  } catch {
    // Never fail the sitemap on a DB hiccup — serve the static entries.
    books = [];
  }

  const bookEntries: MetadataRoute.Sitemap = books.map((b) => ({
    url: absoluteUrl(`/book/${b.slug}`),
    lastModified: b.updatedAt,
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  return [...staticEntries, ...bookEntries];
}
