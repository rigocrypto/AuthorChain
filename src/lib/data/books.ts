import { Prisma } from "@prisma/client";
import type { BookFormat } from "@prisma/client";
import { prisma } from "@/lib/db";
import { coverGradient } from "@/lib/cover";

/**
 * Data-access layer for books. Returns plain serializable DTOs (numbers + ISO
 * strings, never Prisma.Decimal/Date) so server and client components can use
 * them directly. This is the seam the UI depends on — not Prisma itself.
 */
export type BookDTO = {
  id: string;
  authorId: string;
  slug: string;
  title: string;
  subtitle: string | null;
  description: string;
  category: string;
  language: string;
  price: number;
  currency: string;
  status: "DRAFT" | "PUBLISHED" | "ARCHIVED";
  coverColor: string;
  coverUrl: string | null;
  /** Whether a primary cover asset exists (served via /api/assets/books/[id]/cover). */
  hasCover: boolean;
  /** Whether the book has a successful (REGISTERED) on-chain proof of authorship. */
  proofVerified: boolean;
  /** sha-256 of the uploaded manuscript, if any (drives the real proof hash). */
  fileHash: string | null;
  // Publishing metadata (never includes storage keys/paths).
  isbn13: string | null;
  isbn10: string | null;
  bookFormat: "EBOOK" | "PAPERBACK" | "HARDCOVER" | "AUDIOBOOK" | null;
  publisherName: string | null;
  publicationDate: string | null;
  edition: string | null;
  unitsSold: number;
  earningsUsdc: number;
  /** Soft-archive timestamp (ISO) or null. Archived = hidden from active list + public. */
  archivedAt: string | null;
  createdAt: string;
};

type BookRow = Prisma.BookGetPayload<object>;

function toDTO(
  book: BookRow,
  unitsSold = 0,
  earningsUsdc = 0,
  hasCover = false,
  proofVerified = false,
): BookDTO {
  return {
    id: book.id,
    authorId: book.authorId,
    slug: book.slug,
    title: book.title,
    subtitle: book.subtitle,
    description: book.description,
    category: book.category,
    language: book.language,
    price: Number(book.price),
    currency: book.currency,
    status: book.status,
    coverColor: coverGradient(book.id),
    coverUrl: book.coverUrl,
    hasCover,
    proofVerified,
    fileHash: book.fileHash,
    isbn13: book.isbn13,
    isbn10: book.isbn10,
    bookFormat: book.bookFormat,
    publisherName: book.publisherName,
    publicationDate: book.publicationDate
      ? book.publicationDate.toISOString()
      : null,
    edition: book.edition,
    unitsSold,
    earningsUsdc,
    archivedAt: book.archivedAt ? book.archivedAt.toISOString() : null,
    createdAt: book.createdAt.toISOString(),
  };
}

/** Paid-sale aggregates (units + revenue) per book, for a given author. */
async function salesByBook(authorId: string) {
  const rows = await prisma.sale.groupBy({
    by: ["bookId"],
    where: { authorId, paymentStatus: "PAID" },
    _count: { _all: true },
    _sum: { amount: true },
  });
  const map = new Map<string, { units: number; revenue: number }>();
  for (const r of rows) {
    map.set(r.bookId, {
      units: r._count._all,
      revenue: Number(r._sum.amount ?? 0),
    });
  }
  return map;
}

export async function listAuthorBooks(authorId: string): Promise<BookDTO[]> {
  const [books, agg] = await Promise.all([
    prisma.book.findMany({
      where: { authorId },
      orderBy: { createdAt: "desc" },
      include: {
        assets: {
          where: { assetType: "COVER", isPrimary: true },
          select: { id: true },
          take: 1,
        },
        blockchainRegistrations: {
          where: { status: "REGISTERED" },
          select: { id: true },
          take: 1,
        },
      },
    }),
    salesByBook(authorId),
  ]);
  return books.map((b) => {
    const s = agg.get(b.id);
    return toDTO(
      b,
      s?.units ?? 0,
      s?.revenue ?? 0,
      b.assets.length > 0,
      b.blockchainRegistrations.length > 0,
    );
  });
}

/** Best-selling published book for the dashboard "Top Book" card, or null. */
export async function getTopBook(authorId: string): Promise<BookDTO | null> {
  const books = await listAuthorBooks(authorId);
  const published = books.filter((b) => b.status === "PUBLISHED");
  if (published.length === 0) return null;
  return published.sort((a, b) => b.unitsSold - a.unitsSold)[0];
}

/** Single book scoped to its author (dashboard detail view). */
export async function getAuthorBookById(
  bookId: string,
  authorId: string,
): Promise<BookDTO | null> {
  const book = await prisma.book.findFirst({
    where: { id: bookId, authorId },
  });
  return book ? toDTO(book) : null;
}

export type PublicBookDTO = BookDTO & {
  authorName: string;
  hasCover: boolean;
  /** Whether a public reader-preview PDF exists (served via /api/assets/books/[id]/preview). */
  hasPreview: boolean;
  /** On-chain proof transaction hash, if registered (for a public explorer link). */
  proofTxHash: string | null;
};

export async function getPublicBookBySlug(
  slug: string,
): Promise<PublicBookDTO | null> {
  const book = await prisma.book.findFirst({
    where: { slug, status: "PUBLISHED", archivedAt: null },
    include: {
      author: true,
      assets: {
        where: { assetType: { in: ["COVER", "PREVIEW"] }, isPrimary: true },
        select: { assetType: true },
      },
      blockchainRegistrations: {
        where: { status: "REGISTERED" },
        select: { id: true, transactionHash: true },
        orderBy: { createdAt: "desc" },
        take: 1,
      },
    },
  });
  if (!book) return null;
  const reg = book.blockchainRegistrations[0];
  return {
    ...toDTO(book),
    authorName: book.author.name,
    hasCover: book.assets.some((a) => a.assetType === "COVER"),
    hasPreview: book.assets.some((a) => a.assetType === "PREVIEW"),
    proofVerified: Boolean(reg),
    proofTxHash: reg?.transactionHash ?? null,
  };
}

/** Public discovery card for ReaderChain — no storage keys or private fields. */
export type PublishedBookDTO = {
  id: string;
  slug: string;
  title: string;
  subtitle: string | null;
  description: string;
  authorName: string;
  category: string;
  price: number;
  currency: string;
  coverColor: string;
  hasCover: boolean;
  /** True when the book has a successful on-chain proof of authorship. */
  proofVerified: boolean;
};

/**
 * All published books for the public ReaderChain marketplace + homepage
 * featured section. Read-only; never returns manuscript files or storage keys.
 * Independent of the author-scoped functions above.
 */
export async function listPublishedBooks(): Promise<PublishedBookDTO[]> {
  const books = await prisma.book.findMany({
    where: { status: "PUBLISHED", archivedAt: null },
    orderBy: { createdAt: "desc" },
    include: {
      author: { select: { name: true } },
      assets: {
        where: { assetType: "COVER", isPrimary: true },
        select: { id: true },
        take: 1,
      },
      blockchainRegistrations: {
        where: { status: "REGISTERED" },
        select: { id: true },
        take: 1,
      },
    },
  });
  return books.map((b) => ({
    id: b.id,
    slug: b.slug,
    title: b.title,
    subtitle: b.subtitle,
    description: b.description,
    authorName: b.author.name,
    category: b.category,
    price: Number(b.price),
    currency: b.currency,
    coverColor: coverGradient(b.id),
    hasCover: b.assets.length > 0,
    proofVerified: b.blockchainRegistrations.length > 0,
  }));
}

/** Generate a URL-safe, unique slug from a title. */
export async function generateUniqueSlug(title: string): Promise<string> {
  const base =
    title
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 80) || "book";

  let slug = base;
  let n = 1;
  while (await prisma.book.findUnique({ where: { slug } })) {
    slug = `${base}-${n++}`;
  }
  return slug;
}

export type CreateBookInput = {
  authorId: string;
  title: string;
  subtitle?: string;
  description: string;
  category: string;
  language: string;
  price: number;
};

export async function createBook(input: CreateBookInput): Promise<BookDTO> {
  const slug = await generateUniqueSlug(input.title);
  const book = await prisma.book.create({
    data: {
      authorId: input.authorId,
      title: input.title,
      slug,
      subtitle: input.subtitle || null,
      description: input.description,
      category: input.category,
      language: input.language,
      price: new Prisma.Decimal(input.price),
      status: "DRAFT",
    },
  });
  return toDTO(book);
}

export type UpdateBookDetailsInput = {
  title: string;
  subtitle: string | null;
  description: string;
  category: string;
  price: number;
};

/**
 * Update a book's core details (scoped to the author's own book). The slug is
 * intentionally left unchanged so public `/book/[slug]` links stay stable even
 * when the title changes. Does not touch the manuscript or its on-chain proof.
 */
export async function updateBookDetails(
  bookId: string,
  authorId: string,
  data: UpdateBookDetailsInput,
): Promise<void> {
  await prisma.book.updateMany({
    where: { id: bookId, authorId },
    data: {
      title: data.title,
      subtitle: data.subtitle,
      description: data.description,
      category: data.category,
      price: new Prisma.Decimal(data.price),
    },
  });
}

export type PublishingMetadataInput = {
  isbn13: string | null;
  isbn10: string | null;
  publisherName: string | null;
  publicationDate: Date | null;
  edition: string | null;
  bookFormat: BookFormat | null;
};

/** Update publishing identity fields (scoped to the author's own book). */
export async function updatePublishingMetadata(
  bookId: string,
  authorId: string,
  data: PublishingMetadataInput,
): Promise<void> {
  await prisma.book.updateMany({
    where: { id: bookId, authorId },
    data,
  });
}

export async function publishBook(
  bookId: string,
  authorId: string,
): Promise<void> {
  // Scope by authorId so an author can only publish their own books.
  await prisma.book.updateMany({
    where: { id: bookId, authorId },
    data: { status: "PUBLISHED" },
  });
}

/**
 * Visibility controls (all author-scoped so an author can only touch their own
 * books). None of these delete files, proof registrations, sales, or reader
 * entitlements — history stays auditable.
 */

/** Remove a book from public pages by moving it back to DRAFT. */
export async function unpublishBook(
  bookId: string,
  authorId: string,
): Promise<void> {
  await prisma.book.updateMany({
    where: { id: bookId, authorId },
    data: { status: "DRAFT" },
  });
}

/** Soft-archive: hide from the active dashboard list and all public pages. */
export async function archiveBook(
  bookId: string,
  authorId: string,
): Promise<void> {
  await prisma.book.updateMany({
    where: { id: bookId, authorId },
    data: { archivedAt: new Date() },
  });
}

/** Restore an archived book (returns it to its current status). */
export async function restoreBook(
  bookId: string,
  authorId: string,
): Promise<void> {
  await prisma.book.updateMany({
    where: { id: bookId, authorId },
    data: { archivedAt: null },
  });
}
