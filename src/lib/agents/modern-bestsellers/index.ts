/**
 * Modern Bestsellers Agent — market intelligence for original books.
 *
 * Phase 1: input validation, compliance guardrails, scaffold report, persistence.
 * Phase 2: LLM pipeline (no aggressive marketplace scraping).
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
} from "./types";

export {
  runComplianceGuardrails,
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

export { buildScaffoldReport } from "./generate-opportunity-report";
