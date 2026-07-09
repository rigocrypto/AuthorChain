/**
 * Normalize raw model JSON into ModernBestsellerOpportunityReport.
 */

import {
  COMPLIANCE_DISCLAIMER,
  type ConceptOpportunity,
  type ModernBestsellerOpportunityReport,
  type RawModelReport,
  type ReportRiskLevel,
} from "./types";

function asString(value: unknown, fallback = ""): string {
  if (typeof value === "string") return value.trim();
  if (typeof value === "number" || typeof value === "boolean") {
    return String(value);
  }
  return fallback;
}

function asStringArray(value: unknown, max = 12): string[] {
  if (!Array.isArray(value)) {
    if (typeof value === "string" && value.trim()) return [value.trim()];
    return [];
  }
  return value
    .map((v) => asString(v))
    .filter(Boolean)
    .slice(0, max);
}

function asRisk(value: unknown): ReportRiskLevel {
  const s = asString(value).toLowerCase();
  if (s === "saturated" || s === "moderate" || s === "emerging") return s;
  return "unknown";
}

function asConcepts(value: unknown, max = 4): ConceptOpportunity[] {
  if (!Array.isArray(value)) return [];
  const out: ConceptOpportunity[] = [];
  for (const item of value) {
    if (!item || typeof item !== "object") continue;
    const o = item as Record<string, unknown>;
    const title = asString(o.title);
    const angle = asString(o.angle);
    const readerPromise = asString(o.readerPromise ?? o.promise);
    if (!title && !angle) continue;
    out.push({
      title: title || "Original concept",
      angle: angle || "Differentiate with an original reader promise.",
      readerPromise:
        readerPromise || "A clear, original promise grounded in market gaps.",
    });
    if (out.length >= max) break;
  }
  return out;
}

export function normalizeMarketResearchReport(
  raw: unknown,
  meta: {
    genre: string;
    pipelinePhase: "scaffold" | "full";
    providerName?: string;
    extraComplianceWarnings?: string[];
  },
): ModernBestsellerOpportunityReport {
  const r = (raw && typeof raw === "object" ? raw : {}) as RawModelReport &
    Record<string, unknown>;

  // Backward-compatible field aliases from scaffold / older shapes.
  const coverTitlePositioning = asStringArray(
    r.coverTitlePositioning ?? r.coverTitlePositioningNotes,
  );
  const readerPromise = asString(
    r.readerPromise ?? r.recommendedReaderPromise,
    "Position an original promise that answers repeated reader complaints without cloning competitors.",
  );
  const saturationRiskLevel = asRisk(
    r.saturationRiskLevel ?? r.riskLevel,
  );

  const complianceWarnings = [
    ...asStringArray(r.complianceWarnings, 10),
    ...(meta.extraComplianceWarnings ?? []),
  ];

  return {
    version: 1,
    genre: meta.genre,
    genreSnapshot: asString(
      r.genreSnapshot,
      `Market snapshot for ${meta.genre} based on user-provided inputs.`,
    ),
    bestsellerSignalSummary: asString(
      r.bestsellerSignalSummary,
      "Relative popularity and positioning signals from provided materials only — not exact unit sales.",
    ),
    readerExpectations: asStringArray(r.readerExpectations),
    commonPraisePatterns: asStringArray(r.commonPraisePatterns),
    commonComplaintPatterns: asStringArray(r.commonComplaintPatterns),
    marketGaps: asStringArray(r.marketGaps),
    coverTitlePositioning,
    originalConceptOpportunities: asConcepts(r.originalConceptOpportunities),
    readerPromise,
    suggestedOutlineDirection: asString(
      r.suggestedOutlineDirection,
      "Outline around the core conflict, escalating stakes, and a satisfying payoff that addresses common complaints.",
    ),
    marketingKeywordIdeas: asStringArray(r.marketingKeywordIdeas, 20),
    saturationRiskLevel,
    complianceWarnings,
    nextSteps: asStringArray(r.nextSteps, 10),
    avoidList: asStringArray(r.avoidList, 12),
    complianceDisclaimer: COMPLIANCE_DISCLAIMER,
    pipelinePhase: meta.pipelinePhase,
    generatedAt: new Date().toISOString(),
    providerName: meta.providerName,
  };
}
