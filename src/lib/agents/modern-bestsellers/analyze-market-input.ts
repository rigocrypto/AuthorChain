/**
 * Normalize user-provided market research form data (no network I/O).
 */

import type { MarketResearchInput, ResearchModeId } from "./types";
import { RESEARCH_MODES } from "./types";

const MODE_IDS = new Set<string>(RESEARCH_MODES.map((m) => m.id));

function parseUrls(raw: string): string[] {
  const lines = raw
    .split(/[\n,]+/)
    .map((s) => s.trim())
    .filter(Boolean);
  const seen = new Set<string>();
  const out: string[] = [];
  for (const line of lines) {
    // Accept bare amazon paths only if user added https; otherwise keep as typed for validation.
    const url = line;
    if (seen.has(url)) continue;
    seen.add(url);
    out.push(url);
  }
  return out;
}

function parseModes(raw: FormData | string[]): ResearchModeId[] {
  if (Array.isArray(raw)) {
    return raw.filter((m): m is ResearchModeId => MODE_IDS.has(m));
  }
  const values = raw.getAll("modes").map(String);
  return values.filter((m): m is ResearchModeId => MODE_IDS.has(m));
}

export function parseMarketResearchFormData(
  formData: FormData,
): MarketResearchInput {
  const bookIdRaw = String(formData.get("bookId") ?? "").trim();
  return {
    genre: String(formData.get("genre") ?? "").trim(),
    modes: parseModes(formData),
    sourceUrls: parseUrls(String(formData.get("sourceUrls") ?? "")),
    marketNotes: String(formData.get("marketNotes") ?? "").trim(),
    reviewExcerpts: String(formData.get("reviewExcerpts") ?? "").trim(),
    optionalIdea: String(formData.get("optionalIdea") ?? "").trim(),
    bookId: bookIdRaw || null,
  };
}

/**
 * Build a short, non-copyright-heavy summary for persistence.
 * Does not include full review bodies or full market pastes.
 */
export function buildInputSummary(input: MarketResearchInput): string {
  const parts = [
    `Genre: ${input.genre}`,
    input.modes.length
      ? `Modes: ${input.modes.join(", ")}`
      : "Modes: (default)",
    `Source URLs: ${input.sourceUrls.length}`,
    `Market notes: ${input.marketNotes.length} chars`,
    `Review excerpts: ${input.reviewExcerpts.length} chars`,
    input.optionalIdea
      ? `Author idea: ${input.optionalIdea.length} chars provided`
      : "Author idea: none",
  ];
  return parts.join(" · ");
}
