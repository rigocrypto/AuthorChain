"use server";

import type { Prisma } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { getCurrentAuthor } from "@/lib/auth/session";
import { prisma } from "@/lib/db";
import {
  parseMarketResearchFormData,
  buildInputSummary,
  runComplianceGuardrails,
  buildScaffoldReport,
} from "@/lib/agents/modern-bestsellers";
import {
  createMarketResearchReport,
  deleteMarketResearchReportForAuthor,
  type MarketResearchReportDTO,
} from "@/lib/data/market-research-reports";

function asJson(value: unknown): Prisma.InputJsonValue {
  return value as Prisma.InputJsonValue;
}

export type ModernBestsellersActionState = {
  error?: string;
  success?: string;
  report?: MarketResearchReportDTO;
};

/**
 * Phase 1: validate user-pasted inputs, apply compliance guardrails,
 * persist a private DRAFT scaffold report. No LLM. No marketplace fetch.
 */
export async function saveModernBestsellersDraftAction(
  _prev: ModernBestsellersActionState,
  formData: FormData,
): Promise<ModernBestsellersActionState> {
  const author = await getCurrentAuthor();
  const input = parseMarketResearchFormData(formData);

  const guard = runComplianceGuardrails(input);
  if (!guard.ok) {
    return { error: guard.error };
  }

  // Optional book must belong to this author.
  let bookId: string | null = null;
  if (input.bookId) {
    const book = await prisma.book.findFirst({
      where: { id: input.bookId, authorId: author.id },
      select: { id: true },
    });
    if (!book) {
      return { error: "Linked book not found." };
    }
    bookId = book.id;
  }

  const scaffold = buildScaffoldReport(input, guard.warnings);
  const inputSummary = buildInputSummary(input);

  // Persist URLs + summaries only — not full review/market paste bodies.
  const report = await createMarketResearchReport({
    authorId: author.id,
    bookId,
    genre: input.genre,
    sourceUrls: input.sourceUrls,
    inputSummary,
    trendSignals: asJson(scaffold.trendSignals),
    reviewPatterns: asJson(scaffold.reviewPatterns),
    opportunityGaps: asJson(scaffold.opportunityGaps),
    recommendedConcepts: asJson(scaffold.recommendedConcepts),
    warnings: asJson(scaffold.warnings),
    report: asJson(scaffold.report),
    status: "DRAFT",
  });

  revalidatePath("/dashboard/agents/modern-bestsellers");
  revalidatePath("/dashboard/agents");

  return {
    success:
      "Research draft saved. Full AI opportunity reports arrive in a later phase. Your report is private to your account.",
    report,
  };
}

export async function deleteModernBestsellersReportAction(
  reportId: string,
): Promise<{ error?: string; success?: string }> {
  const author = await getCurrentAuthor();
  const ok = await deleteMarketResearchReportForAuthor(reportId, author.id);
  if (!ok) return { error: "Report not found." };
  revalidatePath("/dashboard/agents/modern-bestsellers");
  return { success: "Report deleted." };
}
