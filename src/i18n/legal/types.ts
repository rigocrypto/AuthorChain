/**
 * Structured legal/policy body copy. Kept separate from UI dictionaries so long
 * documents stay maintainable. UI chrome (nav titles, footer labels) still lives
 * in `locales/*`.
 */

export type LegalBlock =
  /** Paragraph. Supports `{{email}}` and `[[/path|Label]]` link tokens. */
  | { p: string }
  | { list: string[] }
  /** Policy shortcut links (labels resolved from footer dict at render time). */
  | { policyLinks: true };

export type LegalSectionContent = {
  id?: string;
  title: string;
  blocks: LegalBlock[];
};

export type LegalDocContent = {
  sections: LegalSectionContent[];
};

export type LegalDocId =
  | "privacy"
  | "terms"
  | "cookies"
  | "security"
  | "copyright"
  | "acceptableUse"
  | "contact";

export type LegalBundle = Record<LegalDocId, LegalDocContent>;
