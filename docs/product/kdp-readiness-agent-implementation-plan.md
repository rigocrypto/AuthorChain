# KDP Readiness Agent — Implementation Plan

> **Status:** Draft technical plan. Not built. Companion to the product spec at
> [kdp-readiness-agent.md](./kdp-readiness-agent.md). This turns the spec into a
> concrete build plan; nothing here ships until reviewed and implemented.
>
> **Reference:** all positioning/compliance rules come from the spec — this plan
> does not restate them, it just implements them.

---

## 1. MVP scope

**Ships in v1**
- Author can trigger a readiness check for a book that has an uploaded manuscript.
- Deterministic mechanical pass (grammar/spelling via self-hosted LanguageTool) +
  LLM judgment pass (authenticity, consistency, human-touch, disclosure guidance).
- One structured, schema-validated report persisted per manuscript version.
- A dashboard "KDP Readiness" section on the manage-book page showing status + report.
- Downloadable "Publishing Readiness Report."
- ES + EN manuscripts, reviewed in the detected language; UI labels via existing i18n.
- Advisory readiness signal that **never gates** proof registration.

**Explicitly out of scope for v1**
- Auto-rewriting or applying fixes to the manuscript (advice only).
- Public display of the report (owner-only in v1).
- Deep stylistic scoring / genre-specific models (later).
- Locales beyond ES/EN for report *content* (UI chrome stays 8-locale).
- Any gating, certification, or Amazon-facing integration.

---

## 2. Data model proposal

A **new Prisma model** is warranted (reports are persistent, queryable, per-version).

Proposed `BookReadinessReport`:

| field | type | notes |
| --- | --- | --- |
| `id` | String `@id @default(cuid())` | |
| `bookId` | String | FK → `Book`, `onDelete: Cascade` |
| `authorId` | String | denormalized owner for fast owner-scoped queries |
| `manuscriptHash` | String | the SHA-256 of the analyzed manuscript version |
| `locale` | String | detected manuscript language (report content language) |
| `status` | enum | `ANALYZING | READY | NEEDS_WORK | FAILED` |
| `overallScore` | Int? | 0–100, advisory only |
| `report` | Json | full structured report (checklist, issues, warnings, stats) |
| `aiUseNotes` | String? | author-provided context on AI use (not an assertion by us) |
| `createdAt` / `updatedAt` | DateTime | |

- **Link:** `book Book @relation(...)`; `Book` gains `readinessReports BookReadinessReport[]`.
- **Versioned per manuscript hash:** yes. Key insight — a report is only meaningful for
  the exact manuscript it reviewed. Store `manuscriptHash`; recommend
  `@@unique([bookId, manuscriptHash])` so re-running on the same version upserts, and a
  new manuscript upload yields a fresh report while old ones remain as history.
- **Migration:** additive only (new table + a virtual relation on `Book`). No changes to
  existing columns. Must be created via `prisma migrate dev` **against local** and applied
  to prod only through the Vercel `prisma migrate deploy` pipeline (see the DB-safety note
  in the README — never run migrate against production locally).
- Enum `ReadinessStatus` added alongside existing enums.

---

## 3. Agent architecture

- **Server-side only.** No manuscript text or LLM keys touch the client.
- Suggested files under `src/lib/agents/`:
  - `kdp-readiness/index.ts` — orchestrator: fetch manuscript bytes (server, from the
    private store — same path `finalize*` uses), extract text, chunk, run passes, assemble.
  - `kdp-readiness/extract.ts` — PDF/EPUB → plain text + chapter segmentation.
  - `kdp-readiness/languagetool.ts` — deterministic grammar/spelling pass (ES/EN).
  - `kdp-readiness/analyze.ts` — LLM pass (Claude Sonnet), strict "JSON only" + retry-once.
  - `kdp-readiness/schema.ts` — zod (or equivalent) schema + server-side validation.
  - `kdp-readiness/report.ts` — merge per-chapter results, compute aggregate score.
  - Data layer `src/lib/data/readiness-reports.ts` (owner-scoped get/list/upsert), mirroring
    the existing `book-translations.ts` pattern.
  - Server action(s) in `src/app/dashboard/books/[id]/actions.ts` (or a colocated file),
    owner-checked via `getAuthorBookById(bookId, author.id)` like every other action.
- **Chunking:** analyze per chapter, then merge; recompute the aggregate score server-side
  so weighting stays consistent regardless of chunking. Bound max chapters/tokens per run.
- **Avoid exposing private manuscripts:** read bytes only through the existing private
  storage path (never `public/`, never a signed URL handed to the client). The report
  stores *derived* findings + short excerpts (≤ ~15 words), never the full manuscript.
- **Store report safely:** persist the structured report as `Json` on
  `BookReadinessReport`, owner-scoped. The downloadable file is generated on demand from
  that record; it is not a public asset.

---

## 4. Report structure

Backed by the persisted `report` JSON; rendered as the four spec sections:

1. **Readiness summary** — advisory status + short plain-language summary (author's language).
2. **Quality checklist** — grammar/readability/consistency findings, each with a location.
3. **Formatting checklist** — chapter/heading/TOC/front-back-matter checks.
4. **AI disclosure guidance** — the AI-generated vs AI-assisted distinction and how to
   answer KDP's disclosure; guidance only, author decides.
5. **Human-editing workflow notes** — which chapters most need a human pass, and how.
6. **Proof-of-authorship context** — read-only: manuscript SHA-256 + on-chain reference
   (from existing `BlockchainRegistration`), with an explicit note that proof ≠ quality/approval.
7. **Limitations / disclaimer** — reduces risk, does not guarantee acceptance; heuristics
   labeled as patterns, not Amazon rules.

---

## 5. UI integration

- **Location:** the manage-book page `src/app/dashboard/books/[id]/page.tsx`, a new
  **"KDP Readiness"** card (client form + server-rendered latest report), consistent with
  the existing Manuscript / Cover / Proof cards.
- **Status states:** `not started` → `analyzing` (async; poll or revalidate) → `ready` /
  `needs_work` → `failed` (friendly retry). All labels via the i18n dictionaries (8 locales).
- **Downloadable report** button (owner-only).
- **No gating:** the Proof-of-Authorship card and the hash/registration flow are **untouched**;
  readiness never blocks or is a prerequisite for registering proof. At most, an optional
  "review recommended" nudge with "continue anyway."

---

## 6. Compliance guardrails (implementation-level)

- No copy — in UI, report, action messages, or marketing — uses forbidden claims
  (guaranteed approval, bypass/defeat AI detection, anti-AI protection, survive KDP review,
  Amazon-certified, official KDP approval tool). Enforce via review + a simple string check
  in tests if practical.
- **No automatic disclosure decisions:** the agent guides; the author fills the declaration.
- **Author remains responsible** for quality/IP/disclosure — stated in the report and UI.
- **Proof independent of quality:** verified by keeping the registration flow unchanged.

---

## 7. Technical risks & mitigations

- **Malware / infected uploads (raised, important).** Manuscripts are PDF/EPUB uploaded
  *presigned direct-to-R2*, so they never pass through app-server validation today, and are
  later **downloadable by readers** — a malicious file could reach R2 and end users. This is
  a real gap and a **prerequisite** for any flow that fetches/serves manuscript bytes.
  - *Mitigation:* add an antivirus scan at the `finalize*` step — the server already fetches
    the bytes back to compute the SHA-256, so scan there (self-hosted **ClamAV/clamd**, same
    "cheap mechanical layer" model as LanguageTool, or a scanning API) and **reject + delete**
    on detection before the file is accepted/hashed. Scope: applies to *all* manuscript/cover
    uploads, not just the readiness agent. Recommend a **separate infra spec/PR** for this so
    it lands independently of the agent. The readiness agent should refuse to run on any file
    that hasn't passed the scan.
- **Long-PDF parsing / memory:** cap size + page count; stream/segment; fail gracefully with
  a friendly error rather than an OOM.
- **LLM cost control:** per-chapter chunking with token caps; cache by `manuscriptHash` so a
  re-run on an unchanged manuscript reuses the report; rate-limit runs per author.
- **Rate limits (LLM + LanguageTool):** queue/backoff; mark `status = ANALYZING` and let the
  UI poll; never block the request thread.
- **Hallucinated advice:** require every issue to cite a real location (chapter + verbatim
  excerpt); server-side schema validation + reject fabricated/empty locations; label inferred
  risks as heuristics; keep the LLM to judgment, not fact-invention.
- **Privacy/security:** manuscripts stay in the private store; report holds only derived
  findings + short excerpts; owner-scoped reads; no client-side manuscript exposure; do not
  retain manuscript text beyond analysis.
- **Multilingual manuscripts:** detect primary language; review in it; respect intentional
  language mixing (dialogue/quotes) — only flag unintended switches.

---

## 8. MVP acceptance criteria

- [ ] Author can run a readiness check on a book that has an uploaded manuscript.
- [ ] A schema-valid report is generated and persisted.
- [ ] The report is linked to the book **and** the specific manuscript SHA-256.
- [ ] The report is visible **only to the owning author** (owner-scoped queries + action guards).
- [ ] The public book page does **not** show the report (owner-only in v1).
- [ ] Existing **proof registration, sales, and upload flows remain unchanged** — readiness
      never gates proof.
- [ ] No forbidden claims appear anywhere in output, UI, or copy.
- [ ] Uploaded manuscripts are malware-scanned before analysis (or the agent refuses to run).
- [ ] typecheck / lint / build pass; migration is additive and applied only via the deploy pipeline.

---

## Suggested sequencing

1. **Malware scanning on upload** (separate infra PR) — safety prerequisite for serving bytes.
2. `BookReadinessReport` model + additive migration (local dev first).
3. Extraction + LanguageTool pass + report persistence (no LLM yet) → prove the pipeline.
4. LLM judgment pass + schema validation.
5. Dashboard "KDP Readiness" card + downloadable report (owner-only).
6. i18n labels across 8 locales; report content ES/EN.
