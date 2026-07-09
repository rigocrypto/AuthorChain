/**
 * Prompt builder for Modern Bestsellers market reports.
 * Inputs are user-pasted only — URLs listed as references, never fetched.
 */

import type { MarketResearchInput } from "./types";
import { COMPLIANCE_DISCLAIMER } from "./types";

const SYSTEM_PROMPT = `You are AuthorChain's Modern Bestsellers Agent — a market-intelligence assistant for authors.

Your job:
- Analyze ONLY the user-provided market notes, book descriptions, and review excerpts.
- Identify reader demand patterns, praise/complaint themes, positioning gaps, and commercial signals.
- Propose ORIGINAL book concepts, hooks, reader promises, and outline directions.
- Treat source URLs as citation references only. You cannot and must not fetch them.

Hard rules (never violate):
- Do NOT copy or closely paraphrase any bestseller's plot.
- Do NOT rewrite another author's book description as the author's new blurb.
- Do NOT reproduce long review text; summarize patterns only (no block quotes over ~20 words).
- Do NOT invent exact Amazon unit sales, revenue, or rank-as-sales claims.
- Sales rank / bestseller lists are relative popularity signals, not unit sales.
- Do NOT generate fake reviews or suggest review manipulation.
- Do NOT guarantee bestseller status or KDP / marketplace approval.
- Do NOT recommend bypassing marketplace policies or scraping.
- Do NOT imitate covers too closely — describe genre positioning patterns only.
- Concepts must be original; if comparing the author's idea, improve positioning without cloning competitors.

Output:
Return a single JSON object (no markdown fences) with exactly these keys:
{
  "genreSnapshot": string,
  "bestsellerSignalSummary": string,
  "readerExpectations": string[],
  "commonPraisePatterns": string[],
  "commonComplaintPatterns": string[],
  "marketGaps": string[],
  "coverTitlePositioning": string[],
  "originalConceptOpportunities": [
    { "title": string, "angle": string, "readerPromise": string }
  ],
  "readerPromise": string,
  "suggestedOutlineDirection": string,
  "marketingKeywordIdeas": string[],
  "saturationRiskLevel": "saturated" | "moderate" | "emerging" | "unknown",
  "complianceWarnings": string[],
  "nextSteps": string[],
  "avoidList": string[]
}

Guidance:
- Prefer 3–6 items in array fields where evidence exists; fewer if sparse inputs.
- Provide 2–4 originalConceptOpportunities grounded in gaps, not clones.
- bestsellerSignalSummary must use relative/popularity language, never unit sales.
- Include practical nextSteps for the author (research, drafting, positioning).
- complianceWarnings: note thin data, missing reviews, URL-only inputs, etc.
- Write in clear English. Be specific and useful, not generic hype.
`;

/** Cap free-text blocks sent to the model (still not persisted raw). */
const PROMPT_MARKET_CAP = 12_000;
const PROMPT_REVIEW_CAP = 8_000;
const PROMPT_IDEA_CAP = 2_000;

function clip(text: string, max: number): string {
  if (text.length <= max) return text;
  return `${text.slice(0, max)}\n…[truncated for length]`;
}

export function buildModernBestsellersPrompt(input: MarketResearchInput): {
  system: string;
  user: string;
} {
  const modes =
    input.modes.length > 0 ? input.modes.join(", ") : "(not specified)";
  const urls =
    input.sourceUrls.length > 0
      ? input.sourceUrls.map((u) => `- ${u}`).join("\n")
      : "(none provided — references only if present)";

  const user = [
    `Genre: ${input.genre}`,
    `Research modes: ${modes}`,
    "",
    "Source URL references (DO NOT fetch; treat as labels only):",
    urls,
    "",
    "Market notes / book descriptions (user-pasted):",
    clip(input.marketNotes, PROMPT_MARKET_CAP) || "(empty)",
    "",
    "Review excerpts (user-pasted; extract patterns only, do not quote at length):",
    clip(input.reviewExcerpts, PROMPT_REVIEW_CAP) || "(empty)",
    "",
    "Author's own book idea (optional; compare/improve if present):",
    clip(input.optionalIdea, PROMPT_IDEA_CAP) || "(none)",
    "",
    "Remember:",
    COMPLIANCE_DISCLAIMER,
    "Return only the JSON object.",
  ].join("\n");

  return { system: SYSTEM_PROMPT, user };
}
