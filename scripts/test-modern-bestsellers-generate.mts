/**
 * One-off smoke test for Modern Bestsellers generation.
 * Loads env from PROCESS_ENV_FILE or .env.vercel-prod-test.
 * Never prints secrets or full provider payloads.
 */
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

function loadEnvFile(path: string) {
  const raw = readFileSync(path, "utf8");
  for (const line of raw.split(/\r?\n/)) {
    if (!line || line.startsWith("#")) continue;
    const eq = line.indexOf("=");
    if (eq <= 0) continue;
    const key = line.slice(0, eq).trim();
    let val = line.slice(eq + 1).trim();
    if (
      (val.startsWith('"') && val.endsWith('"')) ||
      (val.startsWith("'") && val.endsWith("'"))
    ) {
      val = val.slice(1, -1);
    }
    if (!process.env[key]) process.env[key] = val;
  }
}

const envPath = resolve(
  process.env.PROCESS_ENV_FILE || ".env.vercel-prod-test",
);
loadEnvFile(envPath);

const { isLiveConfigured } = await import("../src/lib/agents/provider.ts");
const {
  generateModernBestsellersReport,
  validateMarketResearchInputs,
} = await import("../src/lib/agents/modern-bestsellers/index.ts");

const input = {
  genre: "Science Fiction",
  modes: ["competitors", "reviews", "opportunities"] as (
    | "category"
    | "competitors"
    | "reviews"
    | "opportunities"
    | "compare"
  )[],
  sourceUrls: [
    "https://www.amazon.com/best-sellers-books-Amazon-Best-Sellers/zgbs/books",
    "https://www.amazon.com/gp/bestsellers/digital-text/158566011",
    "https://www.goodreads.com/genres/science-fiction",
  ],
  marketNotes: [
    "Category notes (user-pasted): fast-paced near-future sci-fi with survival pressure and AI conflict is common.",
    "Blurbs emphasize series potential, high stakes, and clear technological hooks.",
    "Several competitors use short chapters and cinematic pacing; emotional cost for the protagonist is a recurring sales angle.",
  ].join("\n"),
  reviewExcerpts: [
    "Loved the premise and the tense pacing, but the side characters felt thin.",
    "Great tech ideas; the ending felt more like a setup than a payoff.",
    "Wanted deeper character relationships and clearer world rules earlier.",
  ].join("\n\n"),
  optionalIdea:
    "A near-future blockchain archivist discovers an AI rewriting human memory records, and every correction costs one of their own verified memories.",
  bookId: null as string | null,
};

console.log("isLiveConfigured:", isLiveConfigured());
const guard = validateMarketResearchInputs(input);
console.log("guard.ok:", guard.ok);
if (!guard.ok) {
  console.log("guard.error:", guard.error);
  process.exit(1);
}

const result = await generateModernBestsellersReport(input, guard.warnings);
if (!result.ok) {
  console.log("GENERATE_FAILED");
  console.log("error:", result.error);
  process.exit(1);
}

const report = result.bundle.report;
const text = JSON.stringify(report);

const checks = {
  pipelinePhaseFull: report.pipelinePhase === "full",
  hasGenreSnapshot: Boolean(report.genreSnapshot?.length),
  hasSignals: Boolean(report.bestsellerSignalSummary?.length),
  hasPraise: (report.commonPraisePatterns?.length ?? 0) > 0,
  hasComplaints: (report.commonComplaintPatterns?.length ?? 0) > 0,
  hasGaps: (report.marketGaps?.length ?? 0) > 0,
  hasConcepts: (report.originalConceptOpportunities?.length ?? 0) > 0,
  hasPromise: Boolean(report.readerPromise?.length),
  hasOutline: Boolean(report.suggestedOutlineDirection?.length),
  hasDisclaimer: Boolean(report.complianceDisclaimer?.length),
  noGuaranteedBestseller: !/guaranteed?\s+bestseller/i.test(text),
  noGuaranteedKdp: !/guaranteed?\s+kdp|kdp\s+approval\s+guaranteed/i.test(text),
  noExactSalesPhrase: !/\bsold\s+\d[\d,]*/i.test(text),
  noLongReviewCopy:
    !text.includes("side characters felt thin") &&
    !text.includes("ending felt more like a setup") &&
    !text.includes("clearer world rules earlier"),
};

console.log("providerName:", report.providerName ?? "(none)");
console.log("riskLevel:", report.saturationRiskLevel);
console.log("CHECKS", JSON.stringify(checks, null, 2));
console.log(
  "SECTION_LENS",
  JSON.stringify(
    {
      genreSnapshot: report.genreSnapshot.length,
      bestsellerSignalSummary: report.bestsellerSignalSummary.length,
      readerExpectations: report.readerExpectations.length,
      praise: report.commonPraisePatterns.length,
      complaints: report.commonComplaintPatterns.length,
      gaps: report.marketGaps.length,
      concepts: report.originalConceptOpportunities.length,
      keywords: report.marketingKeywordIdeas.length,
      nextSteps: report.nextSteps.length,
      avoid: report.avoidList.length,
    },
    null,
    2,
  ),
);

const failed = Object.entries(checks).filter(([, v]) => v !== true);
if (failed.length) {
  console.log("FAILED_CHECKS", failed.map(([k]) => k).join(", "));
  process.exit(2);
}

console.log("ALL_CHECKS_PASSED");
