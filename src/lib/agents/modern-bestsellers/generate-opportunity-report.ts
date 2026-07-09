/**
 * Modern Bestsellers report generation.
 * Phase 1 scaffold (no LLM) + Phase 2 live generation (user-pasted inputs only).
 */

import { isLiveConfigured } from "@/lib/agents/provider";
import { buildModernBestsellersPrompt } from "./prompt";
import { completeJsonChat, extractJsonObject } from "./llm-json";
import { normalizeMarketResearchReport } from "./normalize-report";
import { enforceModernBestsellersGuardrails } from "./output-guardrails";
import {
  COMPLIANCE_DISCLAIMER,
  type MarketResearchInput,
  type ModernBestsellerOpportunityReport,
} from "./types";

export type GeneratedMarketBundle = {
  report: ModernBestsellerOpportunityReport;
  trendSignals: Record<string, unknown>;
  reviewPatterns: Record<string, unknown>;
  opportunityGaps: string[];
  recommendedConcepts: ModernBestsellerOpportunityReport["originalConceptOpportunities"];
  warnings: string[];
};

function uniqueStrings(items: string[]): string[] {
  const seen = new Set<string>();
  const out: string[] = [];
  for (const item of items) {
    if (!item || seen.has(item)) continue;
    seen.add(item);
    out.push(item);
  }
  return out;
}

function toBundle(
  report: ModernBestsellerOpportunityReport,
  extraWarnings: string[] = [],
): GeneratedMarketBundle {
  const warnings = uniqueStrings([
    ...extraWarnings,
    ...report.complianceWarnings,
    "No marketplace pages were fetched automatically. Source URLs are references only.",
  ]);

  return {
    report: {
      ...report,
      complianceDisclaimer: COMPLIANCE_DISCLAIMER,
      complianceWarnings: warnings,
    },
    trendSignals: {
      genre: report.genre,
      riskLevel: report.saturationRiskLevel,
      phase: report.pipelinePhase,
      providerName: report.providerName ?? null,
    },
    reviewPatterns: {
      praise: report.commonPraisePatterns,
      complaints: report.commonComplaintPatterns,
      note: "Patterns only; raw review text not stored.",
    },
    opportunityGaps: report.marketGaps,
    recommendedConcepts: report.originalConceptOpportunities,
    warnings,
  };
}

/** Deterministic scaffold (DRAFT) — not presented as live AI output. */
export function buildScaffoldReport(
  input: MarketResearchInput,
  extraWarnings: string[] = [],
): GeneratedMarketBundle {
  const raw = {
    genreSnapshot: `Scaffold snapshot for ${input.genre}. Paste competitor descriptions and review excerpts, then generate a full report when an AI provider is configured.`,
    bestsellerSignalSummary:
      "Relative popularity signals will be summarized from content you paste — not exact unit sales.",
    readerExpectations: [
      "Clear genre promise and pacing.",
      "Emotional or intellectual payoff matching category norms.",
    ],
    commonPraisePatterns: [
      "Praise patterns will be extracted from review excerpts you provide (summarized, not quoted at length).",
    ],
    commonComplaintPatterns: [
      "Complaint patterns will be extracted from review excerpts you provide.",
    ],
    marketGaps: [
      "Opportunity gaps (high demand + repeated complaints) appear after full analysis.",
    ],
    coverTitlePositioning: [
      "Title/subtitle and cover genre signals will be described as patterns only — not instructions to clone a competitor cover.",
    ],
    originalConceptOpportunities: [
      {
        title: "Original concept (pending generation)",
        angle: input.optionalIdea.trim()
          ? "Your idea was saved for compare-mode analysis on generate."
          : `Original ${input.genre} angle will be generated from market patterns — not copied from bestsellers.`,
        readerPromise:
          "A clear reader promise will be drafted on full generation.",
      },
    ],
    readerPromise:
      "Pending full analysis — generate to propose an original reader promise.",
    suggestedOutlineDirection:
      "Outline direction will be suggested from gap analysis on generate.",
    marketingKeywordIdeas: [
      input.genre.toLowerCase(),
      "original concept",
      "reader demand",
    ],
    saturationRiskLevel: "unknown",
    complianceWarnings: [
      ...extraWarnings,
      "This is a scaffold draft, not a live AI market report.",
    ],
    nextSteps: [
      "Paste richer competitor notes and short review excerpts.",
      "Generate a full opportunity report when AI is configured.",
    ],
    avoidList: [
      "Do not copy bestseller plots or rewrite another author's description.",
      "Do not claim exact sales numbers or guarantee bestseller / KDP outcomes.",
      "Do not generate or manipulate reviews.",
    ],
  };

  const normalized = normalizeMarketResearchReport(raw, {
    genre: input.genre,
    pipelinePhase: "scaffold",
    providerName: "Scaffold",
    extraComplianceWarnings: extraWarnings,
  });
  const { report } = enforceModernBestsellersGuardrails(normalized);
  return toBundle(report, extraWarnings);
}

export type GenerateResult =
  | { ok: true; bundle: GeneratedMarketBundle }
  | { ok: false; error: string };

/**
 * Phase 2: generate a full market opportunity report via live provider.
 * Fails safely when no AI key is configured — does not fake AI output.
 */
export async function generateModernBestsellersReport(
  input: MarketResearchInput,
  extraWarnings: string[] = [],
): Promise<GenerateResult> {
  if (!isLiveConfigured()) {
    return {
      ok: false,
      error:
        "AI provider is not configured. Set OPENAI_API_KEY or ANTHROPIC_API_KEY to generate market reports. You can still save a research draft.",
    };
  }

  const { system, user } = buildModernBestsellersPrompt(input);
  const llm = await completeJsonChat(system, user);
  if (!llm.ok) {
    return { ok: false, error: llm.error };
  }

  let parsed: unknown;
  try {
    parsed = extractJsonObject(llm.text);
  } catch {
    return {
      ok: false,
      error:
        "The AI returned an unreadable report. Please try again with clearer market notes or fewer review excerpts.",
    };
  }

  const normalized = normalizeMarketResearchReport(parsed, {
    genre: input.genre,
    pipelinePhase: "full",
    providerName: llm.providerName,
    extraComplianceWarnings: extraWarnings,
  });

  const empty =
    !normalized.genreSnapshot &&
    normalized.originalConceptOpportunities.length === 0 &&
    normalized.marketGaps.length === 0;
  if (empty) {
    return {
      ok: false,
      error:
        "The AI returned an incomplete report. Add more market notes or review excerpts and try again.",
    };
  }

  const { report, redacted } = enforceModernBestsellersGuardrails(normalized);
  return {
    ok: true,
    bundle: toBundle(
      report,
      redacted
        ? [
            ...extraWarnings,
            "Output was scanned for compliance; risky sales/guarantee phrasing was adjusted.",
          ]
        : extraWarnings,
    ),
  };
}
