/**
 * Post-generation compliance: redact risky claims and long review quotes.
 */

import type { ModernBestsellerOpportunityReport } from "./types";
import { COMPLIANCE_DISCLAIMER } from "./types";

const RISKY = [
  /\b\d{1,3}(?:,\d{3})+\s*(?:copies|units|sales)\b/i,
  /\bsold\s+\d[\d,]*(?:\s*(?:k|m|million|thousand))?\s*(?:copies|units)?\b/i,
  /\bexact(?:ly)?\s+(?:sales|units|copies)\b/i,
  /\bguaranteed?\s+bestseller\b/i,
  /\bwill\s+(?:definitely\s+)?(?:hit|become|be)\s+(?:a\s+)?bestseller\b/i,
  /\b(?:guaranteed?|will\s+pass)\s+kdp\b/i,
  /\bkdp\s+(?:approved|approval)\s+guaranteed\b/i,
  /\bbuy\s+reviews?\b/i,
  /\bfake\s+reviews?\b/i,
  /\breview\s+manipulation\b/i,
  /\bscrape\s+amazon\b/i,
  /\b\d+\s*(?:million|billion)\s+(?:copies|sales)\b/i,
];

const REDACTION =
  "[Relative popularity signal only — exact sales figures are not claimed.]";

function scrubText(text: string): { text: string; hit: boolean } {
  let out = text;
  let hit = false;
  for (const re of RISKY) {
    if (re.test(out)) {
      hit = true;
      out = out.replace(re, REDACTION);
    }
  }
  out = out.replace(/"[^"]{180,}"/g, (m) => {
    hit = true;
    return `"${m.slice(1, 80)}…"`;
  });
  return { text: out, hit };
}

function scrubList(items: string[]): { items: string[]; hit: boolean } {
  let hit = false;
  const next = items.map((item) => {
    const r = scrubText(item);
    if (r.hit) hit = true;
    return r.text;
  });
  return { items: next, hit };
}

/**
 * Enforce output guardrails. Always attaches the standard disclaimer.
 */
export function enforceModernBestsellersGuardrails(
  report: ModernBestsellerOpportunityReport,
): { report: ModernBestsellerOpportunityReport; redacted: boolean } {
  let redacted = false;

  const scrubField = (value: string): string => {
    const r = scrubText(value);
    if (r.hit) redacted = true;
    return r.text;
  };

  const scrubArr = (items: string[]): string[] => {
    const r = scrubList(items);
    if (r.hit) redacted = true;
    return r.items;
  };

  const next: ModernBestsellerOpportunityReport = {
    ...report,
    genreSnapshot: scrubField(report.genreSnapshot),
    bestsellerSignalSummary: scrubField(report.bestsellerSignalSummary),
    readerPromise: scrubField(report.readerPromise),
    suggestedOutlineDirection: scrubField(report.suggestedOutlineDirection),
    readerExpectations: scrubArr(report.readerExpectations),
    commonPraisePatterns: scrubArr(report.commonPraisePatterns),
    commonComplaintPatterns: scrubArr(report.commonComplaintPatterns),
    marketGaps: scrubArr(report.marketGaps),
    coverTitlePositioning: scrubArr(report.coverTitlePositioning),
    marketingKeywordIdeas: scrubArr(report.marketingKeywordIdeas),
    complianceWarnings: scrubArr(report.complianceWarnings),
    nextSteps: scrubArr(report.nextSteps),
    avoidList: scrubArr(report.avoidList),
    originalConceptOpportunities: report.originalConceptOpportunities.map(
      (c) => ({
        title: scrubField(c.title),
        angle: scrubField(c.angle),
        readerPromise: scrubField(c.readerPromise),
      }),
    ),
    complianceDisclaimer: COMPLIANCE_DISCLAIMER,
  };

  const requiredAvoid = [
    "Do not copy bestseller plots or rewrite another author's description.",
    "Do not claim exact sales numbers or guarantee bestseller / KDP outcomes.",
    "Do not generate or manipulate reviews.",
  ];
  for (const item of requiredAvoid) {
    if (!next.avoidList.some((a) => a.toLowerCase() === item.toLowerCase())) {
      next.avoidList.push(item);
    }
  }

  if (redacted) {
    next.complianceWarnings = [
      ...next.complianceWarnings,
      "Some generated phrasing was adjusted to remove risky sales, guarantee, or review-related claims.",
    ];
  }

  return { report: next, redacted };
}
