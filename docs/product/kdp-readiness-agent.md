# KDP Readiness Agent — Product Spec

> **Status:** Draft spec. Not built. This document defines a *future* AuthorChain
> Studio feature. Nothing here ships until it is reviewed and implemented.
>
> **One-line:** A human-in-the-loop assistant that helps authors *prepare* a
> manuscript for publishing-quality review and get their **AI-use disclosure**
> right — paired with AuthorChain's on-chain proof-of-authorship record.

---

## 1. Overview

The KDP Readiness Agent is a **preparation and readiness** tool, not an approval
tool. It reviews a manuscript and returns a structured, human-readable report that
helps the author:

1. Fix editorial quality issues (grammar, consistency, structure, formatting).
2. Understand and correctly **disclose** whether their content is AI-generated vs
   AI-assisted, per Amazon KDP's own guidelines.
3. Decide where a **human editing pass** is most needed.
4. Attach a **proof-of-authorship context** (the manuscript hash + on-chain record
   AuthorChain already produces) to that preparation.

It **advises**; it never silently rewrites the manuscript, never certifies quality,
and never claims to influence Amazon's decision.

**Positioning:**
`KDP Readiness Agent = publishing quality checklist + AI disclosure guidance + human-editing workflow support + proof-of-authorship context.`

---

## 2. Problem

Independent authors — especially those who used AI anywhere in their workflow — are
anxious and under-informed about publishing on Amazon KDP:

- They don't know the difference between **AI-generated** content (which KDP asks
  authors to disclose) and **AI-assisted** content (which KDP does not require them
  to disclose) — and they fear getting it wrong.
- They worry their manuscript will be seen as low-effort or low-quality.
- They have no simple, trustworthy artifact that says "I prepared this responsibly,
  I disclosed correctly, and I can prove it's mine."

AuthorChain already answers "is this provably yours?" (on-chain proof). The gap is a
**trust + readiness layer** on top of that proof: quality preparation and correct
disclosure guidance, produced with a human in the loop.

---

## 3. Target users

- **Primary:** indie / self-published KDP authors who use AI tools in their process
  and want to publish responsibly and confidently.
- **Secondary:** authors worried about originality/ownership who want a documented,
  reviewable preparation trail alongside their proof-of-authorship record.
- **Tertiary (internal):** AuthorChain, as a differentiator — "proof + preparation,"
  not just "blockchain proof."

Assumed bilingual (English + Spanish) at minimum, matching the platform.

---

## 4. User stories

- *As an author who used AI for research,* I want clear guidance on whether I need to
  disclose it to KDP, so I complete the KDP form correctly.
- *As an author,* I want a checklist of quality and formatting issues to fix before I
  publish, so my book reads as professionally prepared.
- *As an author,* I want to know which chapters most need a human editing pass, so I
  spend my limited editing time where it matters.
- *As an author,* I want a downloadable readiness report I can keep, so I have a record
  that I prepared and disclosed responsibly.
- *As an author,* I never want the tool to secretly rewrite my book or change my voice.
- *As an author,* I want proof-of-authorship to work **even if** I skip or fail the
  quality review — owning my draft must not depend on a score.

---

## 5. What the agent checks

Editorial + preparation signals, each tied to a location (chapter + short excerpt):

- **Grammar / spelling / punctuation / syntax** (mechanical layer; see §12).
- **Consistency:** names, terminology, tense, POV, tone, formatting.
- **Structure & formatting:** chapter breaks, headings, table-of-contents alignment,
  front/back-matter presence.
- **Readability:** sentence-rhythm variety, over-long or uniform paragraphs.
- **Low-effort / repetitive-content signals:** near-duplicate passages, templated
  scaffolding, filler with no specific detail. Flagged as **heuristics** ("risk
  pattern we infer"), never as an Amazon rule.
- **Human-touch opportunities:** concrete, specific suggestions where a section reads
  flat or generic — *how* to strengthen it (a specific detail, example, or narrator
  reaction), always preserving the author's voice.
- **AI-disclosure prompts:** questions that help the author classify content as
  AI-generated vs AI-assisted and complete KDP's disclosure accurately.

Respect author intent: dialect, stylistic fragments, and genre conventions are not
errors. When unsure, the agent asks ("confirm intent"), it does not assert an error.

---

## 6. What the agent does NOT claim

Non-negotiable. The agent (and all surrounding UI/marketing) must never state or imply:

- ❌ guaranteed KDP approval
- ❌ bypass KDP filters
- ❌ defeat AI detection
- ❌ anti-AI filter protection
- ❌ survive KDP review
- ❌ Amazon-certified / official KDP approval tool

It also does **not**:

- Rewrite the manuscript on the author's behalf (advice only; suggestions are opt-in).
- Certify quality, originality, or legal ownership.
- Make legal or eligibility guarantees.
- Decide the author's AI disclosure for them — it **guides**; the author declares.
- Quote or invent Amazon policy. If a risk is inferred from known patterns, it is
  labeled a heuristic, not a rule.

It reduces risk and improves preparation. It does not control Amazon's decision.

---

## 7. Inputs

- Manuscript text (per-chapter chunks), from a supported source (PDF/EPUB/plain text).
- Detected primary language (ES/EN at minimum); reviewed in that language.
- Optional author-provided context: genre, intended audience, and a short note on how
  (if at all) AI was used in the workflow.
- Optional AuthorChain context: manuscript SHA-256 hash + on-chain registration
  reference (read-only; the agent does not create or gate the proof).
- Config knobs: **strictness** (`lenient | standard | strict`) and **tone**
  (`encouraging | neutral | blunt`) — tone affects wording only, never scoring.

Privacy: the manuscript is confidential. It is not retained, quoted externally, or
used outside this analysis.

---

## 8. Outputs

- A single structured report object (schema in §9), all human-readable strings in the
  manuscript's primary language.
- A **downloadable "Publishing Readiness Report"** rendering of that object.
- A **readiness signal** (`readiness: ready | needs_work | not_assessed`) that is
  **advisory only**. It MUST NOT block or gate the on-chain proof step. Proof-of-
  authorship is decoupled: an author owns their draft regardless of quality. At most,
  the UI may show a "review recommended" nudge with an explicit "continue anyway."

---

## 9. Suggested report structure

Four sections (the author-facing "Publishing Readiness Report"):

```
1. Proof-of-authorship context   (read-only, from existing AuthorChain records)
   - manuscript SHA-256 hash
   - on-chain registration transaction + timestamp (if registered)
   - author account / wallet reference
   - NOTE: presence of a proof does not imply quality or KDP approval

2. Editorial readiness review
   - grammar / spelling / readability findings (with locations)
   - structure & formatting findings
   - consistency findings (names, tense, POV, terminology)
   - low-effort / repetitive-content warnings (labeled as heuristics)
   - human-editing recommendations (which chapters, and how)

3. KDP readiness checklist
   - title / subtitle consistency
   - description accuracy vs. content
   - table-of-contents / chapter-structure check
   - duplicate / repetitive content check
   - public-domain differentiation check (if relevant)
   - AI-generated vs AI-assisted disclosure guidance (what KDP asks, and how to answer)

4. Author declaration   (author-authored, not asserted by the agent)
   - author confirms ownership
   - author states whether AI was used, and how (generated vs assisted)
   - author confirms a human review/editing pass was completed
```

A machine-readable JSON object backs the report (scores by category, issues with
`severity` + `location` + `suggestion`, heuristic risk flags with `is_heuristic: true`,
consistency notes, stats, and the advisory `readiness` field). The exact schema is an
implementation detail to finalize during build; server-side validation is required.

---

## 10. Compliance guardrails

- **Readiness, not approval.** All copy uses allowed wording (KDP-readiness support,
  publishing quality checklist, AI disclosure guidance, manuscript preparation review,
  human-editing workflow support, proof-of-authorship context) and never the forbidden
  wording in §6.
- **Disclosure-positive, not evasion.** The agent helps authors *disclose AI use
  correctly*, consistent with KDP's AI-generated vs AI-assisted distinction. It never
  helps hide AI use or evade detection.
- **Human in the loop.** The author reviews, accepts/rejects suggestions, and signs the
  declaration. The platform records; it does not certify.
- **Proof is independent of quality.** The on-chain proof step is never gated by a
  readiness score.
- **Heuristics are labeled.** Inferred risks are marked as patterns, not Amazon rules.
- **No fabricated policy.** Reference Amazon/Google guidance only as their own current
  public guidance; do not paraphrase it into a guarantee.
- **Privacy.** Manuscript content stays confidential (see §7).

---

## 11. MVP acceptance criteria

The first shippable version is "done" when:

- [ ] Runs on ES and EN manuscripts and reviews in the detected language.
- [ ] Returns a schema-valid report; invalid output is caught and retried once.
- [ ] Every issue cites a real location (chapter + verbatim excerpt ≤ ~15 words); no
      fabricated locations.
- [ ] Produces the four report sections in §9, including AI-disclosure guidance.
- [ ] The author declaration is filled in by the author, not asserted by the agent.
- [ ] The readiness signal is advisory and never blocks the on-chain proof step.
- [ ] No forbidden wording (§6) appears anywhere in output, UI, or marketing.
- [ ] `strictness` and `tone` knobs work; tone changes wording only, not scores.
- [ ] Manuscript content is not retained beyond the analysis.
- [ ] A downloadable readiness report can be generated.

---

## 12. Future implementation notes

Non-binding direction for when this is built:

- **Two-layer pipeline.** Run a deterministic grammar/spelling pass first
  (e.g. self-hosted **LanguageTool** for ES + EN — cheap, private, mechanical), then
  pass the text + those findings to an LLM for judgment (authenticity, human-touch,
  consistency, and disclosure guidance). Keep the reliable layer cheap; reserve the LLM
  for editorial judgment.
- **Model.** A strong editorial-judgment model (e.g. Claude Sonnet) with strict
  "return valid JSON only" instruction + server-side schema validation.
- **Chunking.** Analyze long manuscripts per chapter, then merge and compute any
  aggregate score server-side so weighting stays consistent.
- **Fits the existing agents surface.** AuthorChain Studio already has an agents system
  (`src/lib/agents`, AgentStudio, agent outputs). This can slot in as a new agent type,
  reusing that plumbing — but as a **required-optional readiness step**, never a hard
  gate on the proof/hash flow.
- **i18n.** All author-facing labels go through the existing dictionary system (8
  locales, RTL for Arabic). Report *content* is written in the manuscript's language.
- **Sequencing.** Ship the report + disclosure guidance first (highest trust value);
  add deeper stylistic analysis later.
