# Book Idea Architect Agent — Implementation Plan

> **Status:** Draft plan. Docs only. No code, schema, or migrations until approved.
>
> **Source of truth (product):** `docs/product/book-idea-architect-agent.md`
>
> **Goal:** Translate the product spec into a **safe technical plan** for MVP:
> user-provided idea inputs → structured original book blueprint → private save.

---

## 1. MVP scope

### In scope

- Studio route: `/dashboard/agents/book-idea-architect`
- Fiction / Nonfiction branches
- Structured **Book Idea Blueprint** generation via existing AI env pattern
  (`OPENAI_API_KEY` / `ANTHROPIC_API_KEY`, fetch-based, no new deps unless needed)
- Private persistence per author
- Optional link to `Book` and/or `BookMarketResearchReport`
- Delete + list history
- i18n for UI strings across all 8 locales
- Compliance guardrails on input and output

### Out of scope (MVP)

- Full manuscript generation  
- Cover image generation  
- Public blueprint pages  
- Guarantees of sales/rank/KDP  
- Scraping or external marketplace fetch  
- Changing live marketing homepage copy  

### Non-goals for engineering

- Do not touch malware scanner, Stripe, R2, auth, proof, referrals, entitlements
  unless explicitly requested.  
- Do not add dependencies without review.  

---

## 2. Data model proposal

### Enums

```text
BookIdeaType: FICTION | NONFICTION
BookIdeaBlueprintStatus: DRAFT | READY | FAILED
```

### Table: `BookIdeaBlueprint`

| Column | Type | Notes |
|--------|------|--------|
| `id` | cuid | PK |
| `authorId` | string | FK Author; cascade delete |
| `bookId` | string? | Optional FK Book; SetNull |
| `marketResearchReportId` | string? | Optional FK; SetNull |
| `type` | BookIdeaType | |
| `genre` | string | |
| `rawIdeaSummary` | text? | Short summary of user seed |
| `targetReader` | text? | |
| `tone` | string? | |
| `themes` | Json? | |
| `concept` | Json? | Core concept + fiction/nonfiction specifics |
| `titleOptions` | Json? | |
| `outline` | Json? | Chapters |
| `positioning` | Json? | |
| `warnings` | Json? | |
| `nextSteps` | Json? | |
| `report` | Json? | Full normalized blueprint (optional umbrella) |
| `status` | BookIdeaBlueprintStatus | default DRAFT |
| `createdAt` / `updatedAt` | datetime | |

### Indexes

- `(authorId, createdAt desc)`  
- `(authorId, bookId)`  
- `(authorId, marketResearchReportId)`  

### Migration policy

- Additive only when implementation is approved.  
- Spec + this plan: **no migration**.  

### Privacy

- All reads/writes filter by session `authorId`.  
- No public API or marketing page for blueprints.  
- Do not store bulk third-party copyrighted paste beyond generation-time caps.  

---

## 3. Dashboard route plan

| Item | Plan |
|------|------|
| Route | `src/app/dashboard/agents/book-idea-architect/page.tsx` |
| Actions | `.../actions.ts` (generate, save draft, delete) |
| UI | `src/components/book-idea-architect/*` |
| Hub link | Card on `/dashboard/agents` |
| Auth | Dashboard layout already author-gates |

### UI states

| State | Behavior |
|-------|----------|
| Idle | Empty form; Sci-Fi / Business examples optional |
| Generating | Disable submit; spinner |
| READY | Full sectioned blueprint |
| FAILED | Safe error; no provider dumps |
| Draft | Inputs saved without full generation |

---

## 4. Agent pipeline

```text
src/lib/agents/book-idea-architect/
  types.ts
  validate-inputs.ts
  compliance-guardrails.ts
  build-prompt.ts
  generate-blueprint.ts
  normalize-blueprint.ts
  output-guardrails.ts
  index.ts
```

### Stages

1. **`validateInputs`** — genre, type, raw idea length, https-only if URLs ever added later (MVP: no URL fetch).  
2. **`complianceGuardrails`** — reject copy-plot / fake-review / guarantee language in input.  
3. **`loadOptionalContext`** — if `marketResearchReportId`, load **author-owned** report summaries only (gaps, praise/complaint *patterns*, concepts) — never bulk review text.  
4. **`buildPrompt`** — fiction vs nonfiction system instructions + user fields.  
5. **`generateBlueprint`** — live JSON completion (reuse modern-bestsellers `llm-json` pattern or shared helper).  
6. **`normalizeBlueprint`** — strict schema fill with defaults.  
7. **`outputGuardrails`** — scrub sales/guarantee claims; reinforce originality.  
8. **Persist** — READY or FAILED.  

If `!isLiveConfigured()`: return safe error; allow draft-only path.

---

## 5. Fiction output schema

```ts
type FictionConcept = {
  premise: string;
  protagonist: string;
  antagonistOrConflict: string;
  worldbuildingNotes: string[];
  stakes: string;
  tropesToUseCarefully: string[];
  seriesPotential: string;
  endingPromise: string;
  // plus shared fields
};
```

Shared fields: ideaSummary, readerPromise, genreFit, targetAudience, uniqueAngle,
titleOptions[], subtitleOptions[], description, chapters[{ number, title, summary }],
writingRoadmap[], marketPositioning[], originalityGuardrails[], risks[], nextSteps[].

---

## 6. Nonfiction output schema

```ts
type NonfictionConcept = {
  transformationPromise: string;
  readerProblem: string;
  frameworkOrMethod: string;
  chapterProgressionLogic: string;
  exercisesOrPrompts: string[];
  credibilityNotes: string[];
  practicalOutcomes: string[];
  // plus shared fields
};
```

---

## 7. Optional integration with Modern Bestsellers reports

- UI: select from `listMarketResearchReports(authorId)`.  
- Server: re-check `authorId` ownership.  
- Prompt context: inject **summaries only** (genre, gaps, praise/complaint patterns,
  risk level, recommended concepts as *inspiration not templates*).  
- Explicit instruction: do not copy competitor plots or descriptions.  

---

## 8. Optional integration with Book records

- Optional `bookId` on form; verify ownership.  
- Future: “Create Book from blueprint” creates DRAFT book with title/description
  from selected options (separate PR).  
- MVP: link only, no auto-create book.  

---

## 9. Privacy and ownership rules

| Rule | Enforcement |
|------|-------------|
| Author-only read/write | `where: { authorId }` on every query |
| No public routes | Dashboard-only; robots noindex already on dashboard |
| No cross-author reports | Ownership checks on FKs |
| No secrets in reports | Never persist API keys, cookies, stack traces |
| Author owns creativity | UI + disclaimer: author is decision maker |

---

## 10. Compliance and copyright controls

### Input

- Size caps on free text  
- Reject copy/clone plot intents  
- Reject fake review / guarantee / scrape language  

### Output

- Ban: exact sales, guaranteed bestseller, KDP approval, fake reviews  
- Cap any quoted third-party-like blocks  
- Always attach planning-guidance disclaimer  
- Comps = positioning context only  

### Product copy

> Helps you plan an original book blueprint. Does not guarantee bestseller status,
> KDP approval, or commercial success. You remain the author.

---

## 11. i18n considerations

- Add `dashboard.bookIdeaArchitect` (or top-level) keys in all 8 locales:
  `en`, `es`, `fr`, `it`, `pt`, `de`, `ru`, `ar-AE`.  
- Genre option labels can stay English initially if needed; UI chrome must translate.  
- Generated blueprint content language: default English; optional `outputLanguage`
  later.  

---

## 12. Acceptance criteria

- [ ] Author-authenticated access only  
- [ ] Generate READY blueprint from raw idea + type + genre  
- [ ] Fiction vs nonfiction sections differ correctly  
- [ ] Optional market report / book link works and is ownership-checked  
- [ ] FAILED path is safe and private  
- [ ] Draft save without LLM works  
- [ ] Delete works  
- [ ] No scraping / no public exposure  
- [ ] No bestseller/KDP guarantee strings in happy-path fixture tests  
- [ ] typecheck, lint, build pass  
- [ ] Additive migration only when schema PR is approved  

---

## 13. Suggested PR breakdown (when coding is approved)

1. **Schema + data layer** — `BookIdeaBlueprint` additive migration  
2. **Agent pipeline + actions** — generate/draft/delete  
3. **Dashboard UI + hub card + i18n**  
4. **Optional market report context** polish  
5. **(Later)** Create Book from blueprint  

---

## 14. Testing plan

- Unit: normalize fiction/nonfiction schemas  
- Unit: output guardrail scrubbing  
- Unit: input validation limits  
- Integration: ownership isolation (author A cannot load author B)  
- Manual: generate Sci-Fi fiction blueprint; generate Business nonfiction blueprint  
- Manual: no provider key → draft only + clear error on generate  

---

## 15. Future roadmap

- Editable sections  
- Book draft creation  
- Cover Concept handoff  
- Manuscript Assistant chapter drafting  
- Multi-language generation  
- Series / multi-volume blueprints  

---

## 16. References

- `docs/product/book-idea-architect-agent.md`  
- `docs/product/modern-bestsellers-agent.md`  
- `docs/product/modern-bestsellers-agent-implementation-plan.md`  
- `docs/product/kdp-readiness-agent.md`  
- Live pattern: `src/lib/agents/modern-bestsellers/*`  
