/**
 * Phase 1: scaffold-only report builder (no LLM, no external fetch).
 * Phase 2 will replace scaffold sections with model-generated analysis.
 */

import {
  COMPLIANCE_DISCLAIMER,
  type MarketResearchInput,
  type ModernBestsellerOpportunityReport,
} from "./types";

/** Deterministic scaffold so UI + storage work before the AI pipeline ships. */
export function buildScaffoldReport(
  input: MarketResearchInput,
  extraWarnings: string[] = [],
): {
  report: ModernBestsellerOpportunityReport;
  trendSignals: Record<string, unknown>;
  reviewPatterns: Record<string, unknown>;
  opportunityGaps: unknown[];
  recommendedConcepts: unknown[];
  warnings: string[];
} {
  const warnings = [
    ...extraWarnings,
    "Full AI market analysis is not enabled yet (Phase 1 scaffold). Your inputs were validated and saved as a draft.",
    "No marketplace pages were fetched automatically.",
  ];

  const report: ModernBestsellerOpportunityReport = {
    version: 1,
    genre: input.genre,
    genreSnapshot: `Scaffold snapshot for ${input.genre}. Paste competitor descriptions and review excerpts, then re-run once AI generation is enabled.`,
    bestsellerSignalSummary:
      "Relative popularity signals will be summarized from content you paste — not exact unit sales. Exact Amazon sales figures are not claimed.",
    readerExpectations: [
      "Clear genre promise and pacing (to be refined from your inputs in Phase 2).",
      "Emotional or intellectual payoff matching category norms.",
    ],
    commonPraisePatterns: [
      "Praise patterns will be extracted from review excerpts you provide (summarized, not quoted at length).",
    ],
    commonComplaintPatterns: [
      "Complaint patterns will be extracted from review excerpts you provide.",
    ],
    marketGaps: [
      "Opportunity gaps (high demand + repeated complaints) will appear after full analysis.",
    ],
    coverTitlePositioningNotes: [
      "Title/subtitle and cover genre signals will be described as patterns only — not instructions to clone a competitor cover.",
    ],
    originalConceptOpportunities: [
      {
        title: "Original concept (pending AI)",
        angle:
          input.optionalIdea.trim()
            ? "Your idea was saved for compare-mode analysis in Phase 2."
            : `Original ${input.genre} angle will be generated from market patterns — not copied from bestsellers.`,
        readerPromise:
          "A clear reader promise will be drafted once generation is enabled.",
      },
    ],
    recommendedReaderPromise:
      "Pending full analysis — Phase 2 will propose an original reader promise.",
    avoidList: [
      "Do not copy bestseller plots or rewrite another author’s description.",
      "Do not claim exact sales numbers or guarantee bestseller / KDP outcomes.",
      "Do not generate or manipulate reviews.",
    ],
    suggestedOutlineDirection:
      "Outline direction will be suggested from gap analysis in Phase 2.",
    marketingKeywordIdeas: [
      input.genre.toLowerCase(),
      "original concept",
      "reader demand",
    ],
    riskLevel: "unknown",
    complianceDisclaimer: COMPLIANCE_DISCLAIMER,
    pipelinePhase: "scaffold",
    generatedAt: new Date().toISOString(),
  };

  return {
    report,
    trendSignals: {
      genre: input.genre,
      modes: input.modes,
      sourceUrlCount: input.sourceUrls.length,
      phase: "scaffold",
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
