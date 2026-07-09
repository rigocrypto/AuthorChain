/**
 * Modern Bestsellers Agent — market intelligence for original books.
 *
 * Phase 1: draft scaffold + compliance.
 * Phase 2: live LLM opportunity reports from user-pasted inputs only.
 */

export {
  MODERN_BESTSELLERS_GENRES,
  DEFAULT_GENRE,
  RESEARCH_MODES,
  COMPLIANCE_DISCLAIMER,
  COMPLIANCE_UI_COPY,
  type ModernBestsellersGenre,
  type ResearchModeId,
  type MarketResearchInput,
  type ModernBestsellerOpportunityReport,
  type ReportRiskLevel,
  type ConceptOpportunity,
} from "./types";

export {
  runComplianceGuardrails,
  validateMarketResearchInputs,
  MAX_COMBINED_TEXT_CHARS,
  MAX_REVIEW_EXCERPT_CHARS,
  MAX_MARKET_NOTES_CHARS,
  MAX_OPTIONAL_IDEA_CHARS,
  MAX_SOURCE_URLS,
  type GuardrailResult,
} from "./compliance-guardrails";

export {
  parseMarketResearchFormData,
  buildInputSummary,
} from "./analyze-market-input";

export {
  buildScaffoldReport,
  generateModernBestsellersReport,
  type GeneratedMarketBundle,
  type GenerateResult,
} from "./generate-opportunity-report";

export { buildModernBestsellersPrompt } from "./prompt";
export { normalizeMarketResearchReport } from "./normalize-report";
export { enforceModernBestsellersGuardrails } from "./output-guardrails";
