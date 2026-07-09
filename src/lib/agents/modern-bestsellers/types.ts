/**
 * Modern Bestsellers Agent — types for market research inputs and reports.
 *
 * User-pasted inputs only. No automated marketplace fetch.
 */

export const MODERN_BESTSELLERS_GENRES = [
  "Science Fiction",
  "Fantasy",
  "Romantasy",
  "Thriller",
  "Romance",
  "Horror",
  "Nonfiction",
  "Other",
] as const;

export type ModernBestsellersGenre =
  (typeof MODERN_BESTSELLERS_GENRES)[number];

export const DEFAULT_GENRE: ModernBestsellersGenre = "Science Fiction";

export const RESEARCH_MODES = [
  { id: "category", label: "Analyze bestseller category signals" },
  { id: "competitors", label: "Analyze competitor books" },
  { id: "reviews", label: "Analyze review praise / complaints" },
  { id: "opportunities", label: "Generate original book opportunities" },
  { id: "compare", label: "Compare my idea to market demand" },
] as const;

export type ResearchModeId = (typeof RESEARCH_MODES)[number]["id"];

/** User-provided market research input (never auto-scraped). */
export type MarketResearchInput = {
  genre: string;
  modes: ResearchModeId[];
  /** User-supplied Amazon/category/book URL references only. */
  sourceUrls: string[];
  /** Pasted descriptions / bestseller notes (analyzed in-memory; not bulk-stored). */
  marketNotes: string;
  /** Short review excerpts for pattern analysis only. */
  reviewExcerpts: string;
  /** Optional author concept for compare mode. */
  optionalIdea: string;
  /** Optional link to an existing Studio book. */
  bookId?: string | null;
};

export type ReportRiskLevel = "saturated" | "moderate" | "emerging" | "unknown";

export type ConceptOpportunity = {
  title: string;
  angle: string;
  readerPromise: string;
};

/**
 * Structured opportunity report (Phase 2 full generation + Phase 1 scaffold).
 */
export type ModernBestsellerOpportunityReport = {
  version: 1;
  genre: string;
  genreSnapshot: string;
  bestsellerSignalSummary: string;
  readerExpectations: string[];
  commonPraisePatterns: string[];
  commonComplaintPatterns: string[];
  marketGaps: string[];
  coverTitlePositioning: string[];
  originalConceptOpportunities: ConceptOpportunity[];
  readerPromise: string;
  suggestedOutlineDirection: string;
  marketingKeywordIdeas: string[];
  saturationRiskLevel: ReportRiskLevel;
  complianceWarnings: string[];
  nextSteps: string[];
  /** Explicit avoid-list (copycat traps, risky claims). */
  avoidList: string[];
  complianceDisclaimer: string;
  pipelinePhase: "scaffold" | "full";
  generatedAt: string;
  providerName?: string;
};

export const COMPLIANCE_DISCLAIMER =
  "This report summarizes market patterns and reader demand signals from content you provided. " +
  "It does not copy books, claim exact sales figures, guarantee bestseller status, " +
  "promise marketplace or KDP approval, or bypass marketplace policies. " +
  "Create original work — do not imitate competitor plots or covers too closely.";

export const COMPLIANCE_UI_COPY =
  "This agent summarizes market patterns from content you provide. " +
  "It does not copy books, guarantee bestseller status, or bypass marketplace policies.";

/** LLM JSON schema target (before normalize/guardrails). */
export type RawModelReport = {
  genreSnapshot?: unknown;
  bestsellerSignalSummary?: unknown;
  readerExpectations?: unknown;
  commonPraisePatterns?: unknown;
  commonComplaintPatterns?: unknown;
  marketGaps?: unknown;
  coverTitlePositioning?: unknown;
  originalConceptOpportunities?: unknown;
  readerPromise?: unknown;
  suggestedOutlineDirection?: unknown;
  marketingKeywordIdeas?: unknown;
  saturationRiskLevel?: unknown;
  complianceWarnings?: unknown;
  nextSteps?: unknown;
  avoidList?: unknown;
};
