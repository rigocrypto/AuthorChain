import { prisma } from "@/lib/db";
import { locales, type Locale } from "@/i18n/config";
import type { BookTranslation } from "@prisma/client";

export type BookTranslationDTO = {
  id: string;
  bookId: string;
  locale: Locale;
  title: string;
  subtitle: string | null;
  description: string | null;
  createdAt: string;
  updatedAt: string;
};

function toDTO(translation: BookTranslation): BookTranslationDTO {
  return {
    id: translation.id,
    bookId: translation.bookId,
    locale: translation.locale as Locale,
    title: translation.title,
    subtitle: translation.subtitle,
    description: translation.description,
    createdAt: translation.createdAt.toISOString(),
    updatedAt: translation.updatedAt.toISOString(),
  };
}

function normalizeText(value: string | null | undefined): string | null {
  const trimmed = value?.trim();
  return trimmed ? trimmed : null;
}

export function resolveLocalizedBookMetadata<T extends { title: string; subtitle: string | null; description: string | null }>(
  original: T,
  translation: { title: string; subtitle: string | null; description: string | null } | null,
): { title: string; subtitle: string | null; description: string | null } {
  const fallbackTitle = original.title.trim() || "";
  const fallbackSubtitle = original.subtitle?.trim() ? original.subtitle : null;
  const fallbackDescription = original.description?.trim() ? original.description : null;

  return {
    title: translation?.title?.trim() ? translation.title.trim() : fallbackTitle,
    subtitle: translation?.subtitle?.trim() ? translation.subtitle.trim() : fallbackSubtitle,
    description: translation?.description?.trim() ? translation.description.trim() : fallbackDescription,
  };
}

export async function getBookTranslation(
  bookId: string,
  locale: string,
): Promise<BookTranslationDTO | null> {
  const translation = await prisma.bookTranslation.findUnique({
    where: { bookId_locale: { bookId, locale } },
  });
  return translation ? toDTO(translation) : null;
}

export async function listBookTranslations(bookId: string): Promise<BookTranslationDTO[]> {
  const rows = await prisma.bookTranslation.findMany({
    where: { bookId },
    orderBy: [{ locale: "asc" }],
  });
  return rows.map(toDTO);
}

export async function upsertBookTranslation(
  bookId: string,
  locale: string,
  title: string,
  subtitle: string | null,
  description: string | null,
): Promise<BookTranslationDTO> {
  if (!locales.includes(locale as Locale)) {
    throw new Error("Unsupported locale.");
  }

  const translation = await prisma.bookTranslation.upsert({
    where: { bookId_locale: { bookId, locale } },
    update: {
      title: title.trim(),
      subtitle: normalizeText(subtitle),
      description: normalizeText(description),
    },
    create: {
      bookId,
      locale,
      title: title.trim(),
      subtitle: normalizeText(subtitle),
      description: normalizeText(description),
    },
  });

  return toDTO(translation);
}

export async function deleteBookTranslation(bookId: string, locale: string): Promise<void> {
  await prisma.bookTranslation.deleteMany({ where: { bookId, locale } });
}
