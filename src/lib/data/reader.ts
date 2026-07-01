import type { AccessStatus } from "@prisma/client";
import { prisma } from "@/lib/db";
import { coverGradient } from "@/lib/cover";

/**
 * Reader-side data access: a reader's purchased library and entitlement checks.
 * DTOs never include storage keys, file paths, or other readers' data.
 */
export type LibraryItemDTO = {
  bookId: string;
  slug: string;
  title: string;
  authorName: string;
  coverColor: string;
  hasCover: boolean;
  purchaseDate: string;
  accessStatus: AccessStatus;
};

const coverInclude = {
  author: true,
  assets: {
    where: { assetType: "COVER" as const, isPrimary: true },
    select: { id: true },
    take: 1,
  },
};

export async function getReaderByEmail(email: string) {
  return prisma.reader.findUnique({ where: { email } });
}

export async function listReaderLibrary(
  readerId: string,
): Promise<LibraryItemDTO[]> {
  const rows = await prisma.readerLibrary.findMany({
    where: { readerId },
    orderBy: { createdAt: "desc" },
    include: { book: { include: coverInclude } },
  });
  return rows.map((r) => ({
    bookId: r.bookId,
    slug: r.book.slug,
    title: r.book.title,
    authorName: r.book.author.name,
    coverColor: coverGradient(r.book.id),
    hasCover: r.book.assets.length > 0,
    purchaseDate: r.createdAt.toISOString(),
    accessStatus: r.accessStatus,
  }));
}

/** Whether a reader currently has ACTIVE access to a book (download guard). */
export async function hasActiveEntitlement(
  readerId: string,
  bookId: string,
): Promise<boolean> {
  const e = await prisma.readerLibrary.findUnique({
    where: { readerId_bookId: { readerId, bookId } },
    select: { accessStatus: true },
  });
  return e?.accessStatus === "ACTIVE";
}

export type ReaderBookDTO = {
  bookId: string;
  title: string;
  authorName: string;
  coverColor: string;
  hasCover: boolean;
  accessStatus: AccessStatus;
  registration: {
    contractAddress: string | null;
    transactionHash: string | null;
    bookHash: string;
  } | null;
};

/** A reader's owned book (any access status), or null if they don't own it. */
export async function getReaderBook(
  readerId: string,
  bookId: string,
): Promise<ReaderBookDTO | null> {
  const entitlement = await prisma.readerLibrary.findUnique({
    where: { readerId_bookId: { readerId, bookId } },
  });
  if (!entitlement) return null;

  const book = await prisma.book.findUnique({
    where: { id: bookId },
    include: {
      ...coverInclude,
      blockchainRegistrations: {
        where: { status: "REGISTERED" },
        orderBy: { createdAt: "desc" },
        take: 1,
      },
    },
  });
  if (!book) return null;

  const reg = book.blockchainRegistrations[0];
  return {
    bookId: book.id,
    title: book.title,
    authorName: book.author.name,
    coverColor: coverGradient(book.id),
    hasCover: book.assets.length > 0,
    accessStatus: entitlement.accessStatus,
    registration: reg
      ? {
          contractAddress: reg.contractAddress,
          transactionHash: reg.transactionHash,
          bookHash: reg.bookHash,
        }
      : null,
  };
}
