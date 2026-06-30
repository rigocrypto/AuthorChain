import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/db";
import { coverGradient } from "@/lib/cover";

/**
 * Data-access layer for books. Returns plain serializable DTOs (numbers + ISO
 * strings, never Prisma.Decimal/Date) so server and client components can use
 * them directly. This is the seam the UI depends on — not Prisma itself.
 */
export type BookDTO = {
  id: string;
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
  unitsSold: number;
  earningsUsdc: number;
  createdAt: string;
};

type BookRow = Prisma.BookGetPayload<object>;

function toDTO(book: BookRow, unitsSold = 0, earningsUsdc = 0): BookDTO {
  return {
    id: book.id,
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
    unitsSold,
    earningsUsdc,
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
    }),
    salesByBook(authorId),
  ]);
  return books.map((b) => {
    const s = agg.get(b.id);
    return toDTO(b, s?.units ?? 0, s?.revenue ?? 0);
  });
}

/** Best-selling published book for the dashboard "Top Book" card, or null. */
export async function getTopBook(authorId: string): Promise<BookDTO | null> {
  const books = await listAuthorBooks(authorId);
  const published = books.filter((b) => b.status === "PUBLISHED");
  if (published.length === 0) return null;
  return published.sort((a, b) => b.unitsSold - a.unitsSold)[0];
}

export type PublicBookDTO = BookDTO & { authorName: string };

export async function getPublicBookBySlug(
  slug: string,
): Promise<PublicBookDTO | null> {
  const book = await prisma.book.findFirst({
    where: { slug, status: "PUBLISHED" },
    include: { author: true },
  });
  if (!book) return null;
  return { ...toDTO(book), authorName: book.author.name };
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
