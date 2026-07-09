# Modern Bestsellers Agent — Implementation Plan

> **Status:** Draft plan. Docs only. No code, schema, or migrations until approved.
>
> **Source of truth (product):** `docs/product/modern-bestsellers-agent.md`
>
> **Goal:** Translate the product spec into a **safe technical plan** for a Tier 1
> MVP: user-provided market inputs → structured opportunity report → saved in Studio.

---

## 1. MVP scope

### In scope

- New Studio agent: **Modern Bestsellers Agent**
- User-provided inputs only (no automated Amazon scrape-at-scale)
- Genre selector + research modes
- Structured **Modern Bestseller Opportunity Report**
- Save / list reports per author (when DB work is approved)
- Mock provider for local/dev; live LLM provider when keys exist (same pattern as
  existing agents)
- Compliance guardrails module
- Science Fiction as first polished genre prompt pack; schema genre-agnostic

### Out of scope (MVP)

- Prisma migrations until an implementation PR is authorized
- Scheduled rank tracking
- Third-party marketplace APIs
- Cover image generation
- Guarantees of sales, rank, or KDP approval
- Bulk review corpus storage

### Non-goals for engineering

- Do not modify malware scanner, upload/finalize, R2, Stripe, auth, proof
  registration, referrals, entitlements, or live marketing copy in the first agent
  PR unless explicitly requested.
- Do not add dependencies without review.

---

## 2. User-provided input workflow

```text
Author (Studio)
  → form: genre, modes, sourceUrls[], marketText, reviewExcerpts, optionalIdea
  → server action (auth + author scope)
  → normalize + size-limit inputs
  → complianceGuardrails()
  → pipeline.generateOpportunityReport()
  → persist BookMarketResearchReport (optional bookId)
  → return DTO to UI
```

### Input normalization

| Field | Rules |
|-------|--------|
| `genre` | Enum/string allowlist |
| `modes` | Subset of research modes |
| `sourceUrls` | Optional URL list; validate `https:` only; store as references |
| `marketText` | Max length (e.g. 30–50k chars combined); strip control chars |
| `reviewExcerpts` | Max length; if over threshold, refuse or truncate with warning |
| `optionalIdea` | Max length; used only for compare mode |

### Server action sketch (future)

```text
generateModernBestsellersReportAction(formData)
  require author session
  parse + validate
  run agent pipeline
  save report
  revalidatePath('/dashboard/agents/...')
```

---

## 3. Data model proposal

### Table: `BookMarketResearchReport`

| Column | Type | Notes |
|--------|------|--------|
| `id` | cuid | PK |
| `authorId` | string | FK Author; always scoped |
| `bookId` | string? | Optional FK Book |
| `genre` | string | |
| `sourceType` | enum/string | `USER_PASTED` \| `MIXED` |
| `sourceUrls` | Json | URL strings only |
| `inputSummary` | text | Short safe summary of what was analyzed |
| `trendSignals` | Json | |
| `reviewPatterns` | Json | praise/complaint patterns |
| `opportunityGaps` | Json | |
| `recommendedConcepts` | Json | original concepts |
| `warnings` | Json | compliance / data-quality warnings |
| `riskLevel` | string | `saturated` \| `moderate` \| `emerging` |
| `report` | Json | Full structured report (optional if columns above sufficient) |
| `createdAt` / `updatedAt` | datetime | |

### Indexes

- `(authorId, createdAt desc)`
- `(authorId, bookId)` where bookId not null

### Privacy / copyright

- Do **not** add a column for raw full-page HTML scrapes
- Prefer storing **patterns and summaries** over raw review bodies
- If debugging needs raw input temporarily, use short TTL or omit from production

### Migration timing

- Spec + plan: **no migration**
- Implementation PR 1: may ship **in-memory/mock save** without DB
- Implementation PR 2: Prisma model + migration after schema review

---

## 4. Agent pipeline

### Module layout (future)

```text
src/lib/agents/modern-bestsellers/
  types.ts
  compliance-guardrails.ts
  analyze-market-input.ts
  extract-book-signals.ts
  extract-review-patterns.ts
  score-opportunities.ts
  generate-opportunity-report.ts
  index.ts                 // register agent definition
```

### Stages

1. **`analyzeMarketInput`**  
   Parse genre, modes, and free text into typed `MarketInput`.

2. **`complianceGuardrails`**  
   - Reject “copy book X plot” style instructions  
   - Cap review paste size  
   - Inject mandatory system rules (no sales numbers, no KDP guarantees)

3. **`extractBookSignals`**  
   From descriptions/metadata text: tropes, title formulas, price/format notes,
   series cues.

4. **`extractReviewPatterns`**  
   Topic/sentiment clusters for praise and complaints (see §5).

5. **`scoreOpportunities`**  
   Combine demand signals + complaint density + saturation heuristic → gaps +
   `riskLevel`.

6. **`generateOpportunityReport`**  
   LLM (or mock) produces original concepts, avoid-list, outline direction,
   keywords, disclaimer.

### Provider integration

- Register as an `AgentDefinition` alongside copy/launch/community agents, **or**
  as a dedicated pipeline if the report shape is too large for the current field
  form model.
- Prefer dedicated pipeline if inputs are multi-textarea + modes.

### Mock provider

Mock must return a valid full report for Science Fiction so UI and tests work
without API keys.

---

## 5. Review-sentiment extraction

### Goals

- Identify **what readers like / dislike / want improved**
- Never dump long review quotations into the UI

### Approach

1. Chunk user-provided review excerpts  
2. Ask model for JSON:

```json
{
  "praisePatterns": [{ "theme": "...", "evidenceStrength": "weak|moderate|strong" }],
  "complaintPatterns": [{ "theme": "...", "evidenceStrength": "..." }],
  "emotionalLanguage": ["..."],
  "recurringTropesMentioned": ["..."],
  "unmetExpectations": ["..."]
}
```

3. Deduplicate themes  
4. Surface top N themes in the report  

### Controls

- If review text empty → warning: “Complaint/praise patterns limited”  
- If paste huge → truncate + warning  
- System prompt: “Summarize patterns only; do not quote more than a short phrase”

---

## 6. Trend / trope extraction

### From bestseller/category notes + descriptions

- Dominant tropes  
- Pacing/tone signals  
- Series vs standalone bias  
- Price band observations (as stated in input)  
- Format mix (ebook/print/audio) when present  

### Language rules

- Use “signals,” “patterns,” “list position,” “relative popularity”  
- Never invent ranks not present in user input  
- Never convert ranks into unit sales  

---

## 7. Opportunity scoring

### Heuristic inputs (MVP)

| Signal | Positive for opportunity |
|--------|---------------------------|
| Repeated complaints | High |
| Strong trope demand + weak character/worldbuilding complaints | High |
| Dense near-identical title formulas | Higher saturation |
| Sparse complaint data | Lower confidence |
| Author idea overlaps saturated lane with no differentiator | Higher risk |

### Output

- `riskLevel`: `saturated` | `moderate` | `emerging`  
- `opportunityGaps[]` with short rationale  
- `warnings[]` for low-data runs  

Scoring can start rule-based + LLM narrative; refine later with history (Tier 3).

---

## 8. Dashboard UI states

### Route (proposal)

`/dashboard/agents/modern-bestsellers`  
or expand existing agents page with a mode selector.

### Components (future)

- Genre select  
- Mode multi-select  
- Market input textarea  
- Competitor URLs multi-line  
- Review excerpts textarea  
- Optional idea textarea  
- Generate button  
- Report viewer (sections)  
- Save status  
- Report history list  

### States

| State | UI |
|-------|-----|
| Idle | Empty form + examples (Sci-Fi sample paste) |
| Validating | Client-side length checks |
| Generating | Disabled form + spinner |
| Success | Report sections + save confirmation |
| Warning | Success with yellow callouts (missing reviews, etc.) |
| Error | Safe message; no provider dumps |

### Accessibility

- Labels on all fields  
- Focus management after generate  
- Report headings as real H2/H3 hierarchy  

---

## 9. Saved reports

### MVP-A (no DB)

- Return report to client; “download JSON” optional  
- Session-only  

### MVP-B (with DB)

- Persist `BookMarketResearchReport`  
- List last N reports  
- Open report by id (author-scoped)  
- Optional attach to `bookId`  

### Authorization

- All reads/writes filter by `authorId` from session  
- Never expose another author’s research  

---

## 10. Compliance and copyright controls

### Code module: `compliance-guardrails.ts`

Checks:

1. Instruction intent: reject copy/paraphrase-plot requests  
2. Output scan: flag if concept too close to a single pasted title’s plot summary  
3. Ban phrases: “sold X copies,” “guaranteed bestseller,” “will pass KDP,” etc.  
4. Review quote length limit in model output  
5. Always append standard disclaimer block  

### Product copy (UI)

> Identifies market patterns and reader demand signals. Helps authors create
> original, better-positioned books — not copies of existing bestsellers.

### Data retention

- Prefer summaries in DB  
- Log only non-sensitive diagnostics  
- No bulk copyrighted review archive  

---

## 11. Future API / source integrations (Tier 2–3)

| Integration | Use | Prerequisite |
|-------------|-----|----------------|
| Open Library / Google Books | Metadata enrichment | Terms review |
| Affiliate/product APIs | Structured product fields where allowed | Legal + key mgmt |
| Public bestseller feeds | Category snapshots | Source allowlist |
| Social trend signals | Trope/demand hints | Rate limits, no scrape abuse |
| Scheduled jobs | Rank movement (Tier 3) | Infra + compliance review |

Each source requires:

- Written allowlist entry  
- Rate limiting  
- Provenance field in report (`sourcesAcknowledged`)  
- Fallback to user-pasted mode if source fails  

---

## 12. Acceptance criteria (implementation)

### Functional

- [ ] Genre + modes + text inputs accepted  
- [ ] Full report schema returned  
- [ ] Praise/complaint patterns without long review dumps  
- [ ] Original concepts + avoid-list present  
- [ ] Risk level present  
- [ ] Disclaimer present  
- [ ] Mock path works offline  
- [ ] Author-scoped save/list when DB enabled  

### Compliance

- [ ] No exact Amazon unit sales claims  
- [ ] No bestseller/KDP guarantees  
- [ ] No automatic Amazon scrape-at-scale  
- [ ] Guardrails reject explicit “copy this book” requests  

### Quality

- [ ] Sci-Fi template produces coherent sample  
- [ ] Typecheck / lint / tests for pure functions  
- [ ] UI usable on mobile dashboard  

---

## 13. Suggested PR breakdown (when coding is approved)

| PR | Scope |
|----|--------|
| PR1 | Types + mock pipeline + unit tests (no DB) |
| PR2 | Server action + dashboard UI (no persistence or local-only) |
| PR3 | Prisma model + migration + save/list |
| PR4 | Live provider prompts + guardrails hardening |
| PR5 | Tier 2 source adapters (optional, separate review) |

---

## 14. Testing plan

- Unit: guardrails, scoring heuristics, JSON schema validation  
- Integration: action with mock provider  
- Manual: paste Sci-Fi competitors + reviews → inspect report  
- Regression: ensure other agents unchanged  

---

## 15. Open questions

1. Dedicated route vs tab inside existing AI Tools page?  
2. Persist raw user paste for 30 days or summaries only?  
3. Max concurrent generations per author (rate limit)?  
4. Should opportunity reports feed Copy/Launch agents in v1 or v2?  

---

## 16. References (product)

- Product spec: `docs/product/modern-bestsellers-agent.md`  
- Existing agent pattern: `src/lib/agents/*`  
- Related future agent: `docs/product/kdp-readiness-agent.md` (preparation, not market research)

---

*End of implementation plan. No code or migrations in this document’s delivery.*
