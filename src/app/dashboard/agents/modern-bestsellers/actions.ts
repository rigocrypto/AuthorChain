"use server";

import type { Prisma } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { getCurrentAuthor } from "@/lib/auth/session";
import { prisma } from "@/lib/db";
import {
  parseMarketResearchFormData,
  buildInputSummary,
  validateMarketResearchInputs,
  buildScaffoldReport,
  generateModernBestsellersReport,
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

async function resolveOwnedBookId(
  authorId: string,
  bookId: string | null | undefined,
): Promise<{ bookId: string | null; error?: string }> {
  if (!bookId) return { bookId: null };
  const book = await prisma.book.findFirst({
    where: { id: bookId, authorId },
    select: { id: true },
  });
  if (!book) return { bookId: null, error: "Linked book not found." };
  return { bookId: book.id };
}

function revalidateAgentPaths() {
  revalidatePath("/dashboard/agents/modern-bestsellers");
  revalidatePath("/dashboard/agents");
}

/**
 * Save a private DRAFT scaffold without calling the LLM.
 * Does not present scaffold as live AI generation.
 */
export async function saveModernBestsellersDraftAction(
  _prev: ModernBestsellersActionState,
  formData: FormData,
): Promise<ModernBestsellersActionState> {
  const author = await getCurrentAuthor();
  const input = parseMarketResearchFormData(formData);

  const guard = validateMarketResearchInputs(input);
  if (!guard.ok) {
    return { error: guard.error };
  }

  const owned = await resolveOwnedBookId(author.id, input.bookId);
  if (owned.error) return { error: owned.error };

  const scaffold = buildScaffoldReport(input, guard.warnings);
  const inputSummary = buildInputSummary(input);

  const report = await createMarketResearchReport({
    authorId: author.id,
    bookId: owned.bookId,
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

  revalidateAgentPaths();
  return {
    success:
      "Research draft saved privately. Generate a full report when you are ready (requires AI provider configuration).",
    report,
  };
}

/**
 * Generate a full market opportunity report (Phase 2).
 * READY on success; FAILED on generation failure (safe message only).
 * Never scrapes URLs. Never stores bulk review text.
 */
export async function generateModernBestsellersReportAction(
  _prev: ModernBestsellersActionState,
  formData: FormData,
): Promise<ModernBestsellersActionState> {
  const author = await getCurrentAuthor();
  const input = parseMarketResearchFormData(formData);

  const guard = validateMarketResearchInputs(input);
  if (!guard.ok) {
    return { error: guard.error };
  }

  const owned = await resolveOwnedBookId(author.id, input.bookId);
  if (owned.error) return { error: owned.error };

  const inputSummary = buildInputSummary(input);
  const generated = await generateModernBestsellersReport(
    input,
    guard.warnings,
  );

  if (!generated.ok) {
    // Persist FAILED for author history without exposing provider internals.
    const failed = await createMarketResearchReport({
      authorId: author.id,
      bookId: owned.bookId,
      genre: input.genre,
      sourceUrls: input.sourceUrls,
      inputSummary,
      warnings: asJson([generated.error]),
      report: asJson({
        version: 1,
        genre: input.genre,
        pipelinePhase: "full",
        error: generated.error,
        complianceDisclaimer:
          "Generation failed. No marketplace pages were fetched. No exact sales claims are made.",
      }),
      status: "FAILED",
    });

    revalidateAgentPaths();
    return {
      error: generated.error,
      report: failed,
    };
  }

  const { bundle } = generated;
  const report = await createMarketResearchReport({
    authorId: author.id,
    bookId: owned.bookId,
    genre: input.genre,
    sourceUrls: input.sourceUrls,
    inputSummary,
    trendSignals: asJson(bundle.trendSignals),
    reviewPatterns: asJson(bundle.reviewPatterns),
    opportunityGaps: asJson(bundle.opportunityGaps),
    recommendedConcepts: asJson(bundle.recommendedConcepts),
    warnings: asJson(bundle.warnings),
    report: asJson(bundle.report),
    status: "READY",
  });

  revalidateAgentPaths();
  return {
    success:
      "Market opportunity report generated. It is private to your account.",
    report,
  };
}

export async function deleteModernBestsellersReportAction(
  reportId: string,
): Promise<{ error?: string; success?: string }> {
  const author = await getCurrentAuthor();
  const ok = await deleteMarketResearchReportForAuthor(reportId, author.id);
  if (!ok) return { error: "Report not found." };
  revalidateAgentPaths();
  return { success: "Report deleted." };
}
