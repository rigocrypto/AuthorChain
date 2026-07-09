/**
 * Compliance guardrails for Modern Bestsellers Agent (Phase 1).
 *
 * - Cap paste sizes
 * - Reject copy/paraphrase-plot style instructions
 * - Never encourage scraping, fake reviews, or sales/KDP guarantees
 */

import type { MarketResearchInput } from "./types";

/** Combined free-text budget (market notes + reviews + idea). */
export const MAX_COMBINED_TEXT_CHARS = 40_000;
export const MAX_REVIEW_EXCERPT_CHARS = 12_000;
export const MAX_MARKET_NOTES_CHARS = 20_000;
export const MAX_OPTIONAL_IDEA_CHARS = 4_000;
export const MAX_SOURCE_URLS = 15;

const COPY_INTENT =
  /\b(copy|clone|rewrite|paraphrase|imitate|steal)\b.{0,40}\b(plot|book|novel|description|blurb)\b/i;

const FORBIDDEN_REQUEST =
  /\b(fake\s+reviews?|buy\s+reviews?|review\s+manipulation|guarantee(d)?\s+bestseller|exact\s+sales|scrape\s+amazon)\b/i;

export type GuardrailResult =
  | { ok: true; warnings: string[] }
  | { ok: false; error: string; warnings: string[] };

function countChars(...parts: string[]): number {
  return parts.reduce((n, p) => n + p.length, 0);
}

/** Validate and soft-warn on user market research input. */
export function runComplianceGuardrails(
  input: MarketResearchInput,
): GuardrailResult {
  const warnings: string[] = [];

  if (!input.genre.trim()) {
    return { ok: false, error: "Choose a genre.", warnings };
  }

  const hasMaterial =
    input.sourceUrls.length > 0 ||
    input.marketNotes.trim().length > 0 ||
    input.reviewExcerpts.trim().length > 0;

  if (!hasMaterial) {
    return {
      ok: false,
      error:
        "Provide at least one of: source URLs, market notes / book descriptions, or review excerpts.",
      warnings,
    };
  }

  if (input.sourceUrls.length > MAX_SOURCE_URLS) {
    return {
      ok: false,
      error: `At most ${MAX_SOURCE_URLS} source URLs are allowed.`,
      warnings,
    };
  }

  for (const url of input.sourceUrls) {
    if (!/^https:\/\//i.test(url)) {
      return {
        ok: false,
        error: "Source URLs must use https:// only.",
        warnings,
      };
    }
  }

  if (input.marketNotes.length > MAX_MARKET_NOTES_CHARS) {
    return {
      ok: false,
      error: `Market notes are too long (max ${MAX_MARKET_NOTES_CHARS.toLocaleString()} characters).`,
      warnings,
    };
  }

  if (input.reviewExcerpts.length > MAX_REVIEW_EXCERPT_CHARS) {
    return {
      ok: false,
      error: `Review excerpts are too long (max ${MAX_REVIEW_EXCERPT_CHARS.toLocaleString()} characters). Summarize or paste fewer excerpts.`,
      warnings,
    };
  }

  if (input.optionalIdea.length > MAX_OPTIONAL_IDEA_CHARS) {
    return {
      ok: false,
      error: `Your book idea is too long (max ${MAX_OPTIONAL_IDEA_CHARS.toLocaleString()} characters).`,
      warnings,
    };
  }

  const combined = countChars(
    input.marketNotes,
    input.reviewExcerpts,
    input.optionalIdea,
  );
  if (combined > MAX_COMBINED_TEXT_CHARS) {
    return {
      ok: false,
      error: `Combined pasted text is too long (max ${MAX_COMBINED_TEXT_CHARS.toLocaleString()} characters).`,
      warnings,
    };
  }

  const allText = [
    input.marketNotes,
    input.reviewExcerpts,
    input.optionalIdea,
  ].join("\n");

  if (COPY_INTENT.test(allText)) {
    return {
      ok: false,
      error:
        "This agent helps you create original books. Requests to copy, clone, or rewrite another author’s plot or description are not supported.",
      warnings,
    };
  }

  if (FORBIDDEN_REQUEST.test(allText)) {
    return {
      ok: false,
      error:
        "Requests involving fake reviews, review manipulation, guaranteed bestsellers, exact sales figures, or scraping are not allowed.",
      warnings,
    };
  }

  if (input.reviewExcerpts.length > 6_000) {
    warnings.push(
      "Long review pastes are summarized as patterns only; full review text is not stored.",
    );
  }

  if (input.sourceUrls.length > 0) {
    warnings.push(
      "URLs are stored as references only. This agent does not automatically fetch or scrape marketplace pages.",
    );
  }

  return { ok: true, warnings };
}
