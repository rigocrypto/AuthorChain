import type { MarketResearchReportStatus, Prisma } from "@prisma/client";
import { prisma } from "@/lib/db";

/**
 * Author-private market research reports (Modern Bestsellers Agent).
 * All queries are scoped by authorId — never expose cross-author data.
 */

export type MarketResearchReportDTO = {
  id: string;
  authorId: string;
  bookId: string | null;
  bookTitle: string | null;
  genre: string;
  sourceUrls: string[];
  inputSummary: string | null;
  trendSignals: unknown;
  reviewPatterns: unknown;
  opportunityGaps: unknown;
  recommendedConcepts: unknown;
  warnings: unknown;
  report: unknown;
  status: MarketResearchReportStatus;
  createdAt: string;
  updatedAt: string;
};

function asStringArray(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value.filter((v): v is string => typeof v === "string");
}

function toDTO(
  row: {
    id: string;
    authorId: string;
    bookId: string | null;
    genre: string;
    sourceUrls: Prisma.JsonValue;
    inputSummary: string | null;
    trendSignals: Prisma.JsonValue;
    reviewPatterns: Prisma.JsonValue;
    opportunityGaps: Prisma.JsonValue;
    recommendedConcepts: Prisma.JsonValue;
    warnings: Prisma.JsonValue;
    report: Prisma.JsonValue;
    status: MarketResearchReportStatus;
    createdAt: Date;
    updatedAt: Date;
    book?: { title: string } | null;
  },
): MarketResearchReportDTO {
  return {
    id: row.id,
    authorId: row.authorId,
    bookId: row.bookId,
    bookTitle: row.book?.title ?? null,
    genre: row.genre,
    sourceUrls: asStringArray(row.sourceUrls),
    inputSummary: row.inputSummary,
    trendSignals: row.trendSignals,
    reviewPatterns: row.reviewPatterns,
    opportunityGaps: row.opportunityGaps,
    recommendedConcepts: row.recommendedConcepts,
    warnings: row.warnings,
    report: row.report,
    status: row.status,
    createdAt: row.createdAt.toISOString(),
    updatedAt: row.updatedAt.toISOString(),
  };
}

export async function createMarketResearchReport(params: {
  authorId: string;
  bookId?: string | null;
  genre: string;
  sourceUrls: string[];
  inputSummary: string;
  trendSignals?: Prisma.InputJsonValue;
  reviewPatterns?: Prisma.InputJsonValue;
  opportunityGaps?: Prisma.InputJsonValue;
  recommendedConcepts?: Prisma.InputJsonValue;
  warnings?: Prisma.InputJsonValue;
  report?: Prisma.InputJsonValue;
  status?: MarketResearchReportStatus;
}): Promise<MarketResearchReportDTO> {
  const row = await prisma.bookMarketResearchReport.create({
    data: {
      authorId: params.authorId,
      bookId: params.bookId ?? null,
      genre: params.genre,
      sourceUrls: params.sourceUrls,
      inputSummary: params.inputSummary,
      trendSignals: params.trendSignals ?? undefined,
      reviewPatterns: params.reviewPatterns ?? undefined,
      opportunityGaps: params.opportunityGaps ?? undefined,
      recommendedConcepts: params.recommendedConcepts ?? undefined,
      warnings: params.warnings ?? undefined,
      report: params.report ?? undefined,
      status: params.status ?? "DRAFT",
    },
    include: { book: { select: { title: true } } },
  });
  return toDTO(row);
}

export async function listMarketResearchReports(
  authorId: string,
  limit = 20,
): Promise<MarketResearchReportDTO[]> {
  const rows = await prisma.bookMarketResearchReport.findMany({
    where: { authorId },
    orderBy: { createdAt: "desc" },
    take: limit,
    include: { book: { select: { title: true } } },
  });
  return rows.map(toDTO);
}

export async function getMarketResearchReportForAuthor(
  id: string,
  authorId: string,
): Promise<MarketResearchReportDTO | null> {
  const row = await prisma.bookMarketResearchReport.findFirst({
    where: { id, authorId },
    include: { book: { select: { title: true } } },
  });
  return row ? toDTO(row) : null;
}

export async function deleteMarketResearchReportForAuthor(
  id: string,
  authorId: string,
): Promise<boolean> {
  const existing = await prisma.bookMarketResearchReport.findFirst({
    where: { id, authorId },
    select: { id: true },
  });
  if (!existing) return false;
  await prisma.bookMarketResearchReport.delete({ where: { id: existing.id } });
  return true;
}

/** Update fields on an author-owned report (e.g. FAILED after generation error). */
export async function updateMarketResearchReportForAuthor(params: {
  id: string;
  authorId: string;
  status?: MarketResearchReportStatus;
  inputSummary?: string;
  trendSignals?: Prisma.InputJsonValue;
  reviewPatterns?: Prisma.InputJsonValue;
  opportunityGaps?: Prisma.InputJsonValue;
  recommendedConcepts?: Prisma.InputJsonValue;
  warnings?: Prisma.InputJsonValue;
  report?: Prisma.InputJsonValue;
}): Promise<MarketResearchReportDTO | null> {
  const existing = await prisma.bookMarketResearchReport.findFirst({
    where: { id: params.id, authorId: params.authorId },
    select: { id: true },
  });
  if (!existing) return null;

  const row = await prisma.bookMarketResearchReport.update({
    where: { id: existing.id },
    data: {
      status: params.status,
      inputSummary: params.inputSummary,
      trendSignals: params.trendSignals,
      reviewPatterns: params.reviewPatterns,
      opportunityGaps: params.opportunityGaps,
      recommendedConcepts: params.recommendedConcepts,
      warnings: params.warnings,
      report: params.report,
    },
    include: { book: { select: { title: true } } },
  });
  return toDTO(row);
}
