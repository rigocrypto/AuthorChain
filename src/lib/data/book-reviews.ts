import { prisma } from "@/lib/db";

export type PublicBookReviewDTO = {
  id: string;
  rating: number;
  thoughts: string;
  readerName: string;
  createdAt: string;
};

function readerDisplayName(name: string | null, email: string): string {
  if (name?.trim()) return name.trim();
  const [localPart] = email.split("@");
  return localPart ? `${localPart.slice(0, 2)}***` : "Reader";
}

export async function listPublicBookReviews(bookId: string): Promise<PublicBookReviewDTO[]> {
  const rows = await prisma.bookReview.findMany({
    where: { bookId },
    orderBy: { createdAt: "desc" },
    take: 20,
    include: {
      reader: {
        select: { name: true, email: true },
      },
    },
  });

  return rows.map((r) => ({
    id: r.id,
    rating: r.rating,
    thoughts: r.thoughts,
    readerName: readerDisplayName(r.reader.name, r.reader.email),
    createdAt: r.createdAt.toISOString(),
  }));
}

export async function upsertReaderBookReview(input: {
  bookId: string;
  readerId: string;
  rating: number;
  thoughts: string;
}) {
  return prisma.bookReview.upsert({
    where: {
      bookId_readerId: {
        bookId: input.bookId,
        readerId: input.readerId,
      },
    },
    create: {
      bookId: input.bookId,
      readerId: input.readerId,
      rating: input.rating,
      thoughts: input.thoughts,
    },
    update: {
      rating: input.rating,
      thoughts: input.thoughts,
    },
  });
}