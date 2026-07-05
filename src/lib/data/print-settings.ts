import type {
  BookPrintSettings,
  PrintTrimSize,
  PrintInteriorColor,
  PrintPaperType,
  PrintBinding,
  PrintCoverFinish,
} from "@prisma/client";
import { prisma } from "@/lib/db";
import { computeSpineWidthIn } from "@/lib/publishing/print";

/**
 * Per-book print edition settings (display/metadata only). All author-facing
 * reads/writes are scoped by authorId; the public getter only returns settings
 * for books whose print edition has been marked available.
 */

export type PrintSettingsDTO = {
  id: string;
  isAvailable: boolean;
  trimSize: PrintTrimSize;
  trimWidthIn: number | null;
  trimHeightIn: number | null;
  interiorColor: PrintInteriorColor;
  paperType: PrintPaperType;
  binding: PrintBinding;
  coverFinish: PrintCoverFinish;
  pageCount: number | null;
  spineWidthIn: number | null;
  printIsbn13: string | null;
  imprintName: string | null;
  price: number | null;
  currency: string;
  weightOz: number | null;
  distributor: string | null;
  availabilityNote: string | null;
  printNotes: string | null;
};

function toDTO(s: BookPrintSettings): PrintSettingsDTO {
  return {
    id: s.id,
    isAvailable: s.isAvailable,
    trimSize: s.trimSize,
    trimWidthIn: s.trimWidthIn,
    trimHeightIn: s.trimHeightIn,
    interiorColor: s.interiorColor,
    paperType: s.paperType,
    binding: s.binding,
    coverFinish: s.coverFinish,
    pageCount: s.pageCount,
    spineWidthIn: s.spineWidthIn,
    printIsbn13: s.printIsbn13,
    imprintName: s.imprintName,
    price: s.price === null ? null : Number(s.price),
    currency: s.currency,
    weightOz: s.weightOz,
    distributor: s.distributor,
    availabilityNote: s.availabilityNote,
    printNotes: s.printNotes,
  };
}

/** The author's print settings for a book, or null. Owner-scoped. */
export async function getPrintSettings(
  bookId: string,
  authorId: string,
): Promise<PrintSettingsDTO | null> {
  const settings = await prisma.bookPrintSettings.findFirst({
    where: { bookId, authorId },
  });
  return settings ? toDTO(settings) : null;
}

/**
 * Public print settings for a book — only returned when the print edition is
 * marked available. Callers already gate on the book being published + visible.
 */
export async function getPublicPrintSettings(
  bookId: string,
): Promise<PrintSettingsDTO | null> {
  const settings = await prisma.bookPrintSettings.findUnique({
    where: { bookId },
  });
  if (!settings || !settings.isAvailable) return null;
  return toDTO(settings);
}

export type PrintSettingsInput = {
  isAvailable: boolean;
  trimSize: PrintTrimSize;
  trimWidthIn: number | null;
  trimHeightIn: number | null;
  interiorColor: PrintInteriorColor;
  paperType: PrintPaperType;
  binding: PrintBinding;
  coverFinish: PrintCoverFinish;
  pageCount: number | null;
  printIsbn13: string | null;
  imprintName: string | null;
  price: number | null;
  currency: string;
  weightOz: number | null;
  distributor: string | null;
  availabilityNote: string | null;
  printNotes: string | null;
};

/**
 * Create or update a book's print settings. Verifies ownership first, then
 * derives + persists the spine width from page count + paper type. Returns null
 * when the book isn't owned by the author.
 */
export async function upsertPrintSettings(
  bookId: string,
  authorId: string,
  input: PrintSettingsInput,
): Promise<PrintSettingsDTO | null> {
  const owns = await prisma.book.findFirst({
    where: { id: bookId, authorId },
    select: { id: true },
  });
  if (!owns) return null;

  const spineWidthIn = computeSpineWidthIn(input.pageCount, input.paperType);
  const data = { ...input, spineWidthIn };

  const saved = await prisma.bookPrintSettings.upsert({
    where: { bookId },
    create: { bookId, authorId, ...data },
    update: data,
  });
  return toDTO(saved);
}
