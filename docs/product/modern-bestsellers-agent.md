# Modern Bestsellers Agent — Product Spec

> **Status:** Draft spec. Not built. This document defines a *future* AuthorChain
> Studio feature. Nothing here ships until it is reviewed and implemented.
>
> **One-line:** An AI market-intelligence assistant that helps authors understand
> reader demand, genre trends, review sentiment, positioning gaps, and commercial
> patterns — then turns those insights into **original** book concepts, outlines,
> hooks, and publishing strategy.

---

## 1. Overview

The **Modern Bestsellers Agent** is a **market-research assistant for authors**, not
a “copy Amazon bestsellers” tool.

It helps authors:

1. Understand **what readers in a genre currently reward** (pacing, tropes, emotional
   payoffs, series expectations).
2. Summarize **review patterns** (praise and complaints) without reproducing long
   review text.
3. Spot **positioning and market gaps** (high demand + repeated unmet expectations).
4. Generate **original concept directions**, title/subtitle angles, hooks, outline
   directions, and marketing keyword ideas grounded in those patterns.
5. Validate **their own idea** against demand signals before drafting.

**Positioning:**

> The agent identifies market patterns and reader demand signals. It helps authors
> create original, better-positioned books — not copies of existing bestsellers.

**Product name (recommended):** Modern Bestsellers Agent  
**Alternate names considered:** Market Trends Agent, Reader Demand Agent, Book Market
Intelligence Agent, Genre Opportunity Agent, Bestseller Signals Agent.

---

## 2. Problem

Independent and self-published authors often decide what to write next with weak
market signal:

- Bestseller lists and ranks are **public-facing popularity signals**, not published
  unit-sales figures. Authors often misread rank as “exact sales.”
- Reading dozens of competitor pages and reviews is slow; authors need **structured
  pattern extraction**, not raw dumps.
- Genre tropes and reader complaints evolve quickly (e.g. romantasy, AI-adjacent
  sci-fi, thriller series hooks).
- Authors fear producing derivative work if “research” means “imitate the top 10.”
- Existing AuthorChain agents help with **copy, launch, and community** after a book
  exists; there is no first-class tool for **what to write and how to position it**.

AuthorChain already offers on-chain proof, Studio AI tools, and ReaderChain delivery.
This agent adds a **pre-writing commercial intelligence** layer that stays compliant
and original-work focused.

---

## 3. Target users

- Indie / self-published authors choosing a genre or subgenre.
- Authors validating a concept before drafting.
- Authors who want review-driven improvements without scraping abuse.
- AI-assisted authors who still want **original** plots and promises.
- KDP-oriented authors seeking market awareness **without** KDP-approval guarantees.
- Series authors looking for trope/gap opportunities between installments.

Assumed product language: English UI first; all platform locales when shipping (match
AuthorChain Studio i18n).

---

## 4. User stories

- *As an author,* I want a genre snapshot of current demand signals so I choose a
  commercially sensible lane without copying anyone.
- *As an author,* I want common **praise and complaint** patterns from reviews I
  provide, so I know what readers reward and what frustrates them.
- *As an author,* I want **market gap** ideas (high demand + repeated complaints) so
  I can invent an original angle.
- *As an author,* I want original concept, title/subtitle angles, hook, and outline
  direction so I can start drafting with a clear reader promise.
- *As an author,* I want an avoid-list so I do not fall into saturated or copycat
  traps.
- *As an author,* I want to paste my own idea and see how it compares to demand.
- *As an author,* I never want the product to tell me exact Amazon unit sales, to
  rewrite another author’s book, or to guarantee bestseller/KDP outcomes.
- *As AuthorChain,* we want a differentiated Studio agent that is useful, trustworthy,
  and legally conservative.

---

## 5. MVP input types

**MVP is Tier 1 only: user-provided inputs.** No automatic large-scale Amazon scraping.

### Required

| Input | Notes |
|-------|--------|
| Genre / category | e.g. Science Fiction, Fantasy, Romantasy, Thriller, Romance, Horror, Nonfiction… |
| Research mode | See §5.1 |
| Market material | At least one of: category notes, competitor descriptions, review excerpts |

### Optional

| Input | Notes |
|-------|--------|
| Amazon category URL / book URLs | Stored as **user-supplied references**; MVP does not auto-fetch at scale |
| 3–10 competitor book blurbs/descriptions | Pasted text preferred for compliance |
| Pasted review excerpts | Short excerpts only; agent summarizes **patterns** |
| Author’s own book idea | For “compare my idea to market demand” |
| Optional bookId | Link report to an existing Studio book |

### 5.1 Research modes (MVP)

1. Analyze bestseller **category signals** (from user-pasted list/summary)
2. Analyze **competitor books** (metadata + descriptions provided)
3. Analyze **review complaints / praise** (excerpts provided)
4. Generate **original book opportunities**
5. **Compare my idea** to market demand

Authors may combine modes in one run (e.g. competitors + reviews + opportunity).

---

## 6. MVP output report

Primary artifact: **Modern Bestseller Opportunity Report** (structured JSON +
human-readable view).

### Recommended sections

1. Genre snapshot  
2. Top trend / bestseller **signals** (relative popularity language only)  
3. Reader expectations  
4. Common praise patterns  
5. Common complaint patterns  
6. Underserved market gaps  
7. Cover / title positioning notes (patterns only, not “clone this cover”)  
8. Original book concept opportunities  
9. Recommended reader promise  
10. Avoid-list  
11. Suggested outline direction  
12. Marketing keyword ideas  
13. Risk level: **saturated / moderate / emerging**  
14. Compliance disclaimer  

### Example (Science Fiction — illustrative)

**Genre:** Science Fiction  

**Possible opportunity:** Readers respond strongly to fast-paced sci-fi with
emotional stakes, survival pressure, AI conflict, and series potential. Common
complaints include weak character depth, confusing worldbuilding, and endings that
feel like setup instead of payoff.

**Original angle:** A near-future blockchain archivist discovers that an AI has been
rewriting human memory records, but every correction requires sacrificing one
verified memory from their own life.

**Reader promise:** High-concept sci-fi with emotional cost, mystery pacing, and a
clear technological hook.

---

## 7. What the agent analyzes

For each genre/category research session (using **only provided material** in MVP):

### 7.1 Bestseller rankings (signals)

- Category / subcategory rank **as stated by the source the user provided**
- Movement over time **if the user supplies multiple snapshots**
- Release date, format (ebook, paperback, hardcover, audiobook) when visible in input
- Explicit language: ranks are **relative popularity indicators**, not unit sales

### 7.2 Book metadata

- Title, subtitle, author, series status  
- Category, inferred tropes/keywords from description  
- Price, page count, publish date when present  
- Publisher / indie appearance **only when visible in user text**

### 7.3 Review intelligence (patterns only)

- Average rating and review count when provided  
- Common praise patterns  
- Common complaint patterns  
- Unmet expectations  
- Recurring tropes readers mention  
- Emotional language clusters  

**Do not** reproduce long review quotations in outputs.

### 7.4 Cover / title positioning

- Title and subtitle **formulas** (patterns)
- Genre signals, color/style **patterns** (descriptive, not pixel-perfect clones)
- Series branding patterns

### 7.5 Market gap analysis

- High demand + repeated complaints  
- Strong trope + weak competitor execution (as inferred from reviews)  
- Underserved reader segment  
- Opportunity for a fresh angle  

### 7.6 Author recommendations

- Original concept directions  
- Title/subtitle angles  
- Hook ideas  
- Outline direction  
- Reader promise  
- Warning / avoid list  

---

## 8. What the agent must not do

| Prohibited | Rationale |
|------------|-----------|
| Copy bestseller plots | Copyright / trust |
| Rewrite another author’s description | Derivative marketing copy |
| Quote long reviews | Copyright / ToS / storage hygiene |
| Claim exact Amazon sales numbers | Not publicly published as unit sales |
| Tell authors to imitate covers too closely | Brand/trade dress risk |
| Aggressive/irresponsible Amazon scraping | ToS and operational risk |
| Generate fake reviews | Fraud / platform abuse |
| Recommend review manipulation | Policy abuse |
| Guarantee bestseller status | False commercial claim |
| Guarantee KDP approval / ranking | False commercial claim |
| Bypass Amazon policies | Compliance |

---

## 9. Amazon / review compliance guardrails

1. **User-provided first (MVP):** analysis runs on text the author pastes or supplies.  
2. **Rank language:** always frame rank as relative popularity / list position, not
   “X books sold.”  
3. **Review handling:** extract topics/sentiment patterns; do not store or redisplay
   large copyrighted review bodies beyond what is needed for the session. Prefer
   ephemeral processing; if retention is needed, store **summaries**, not full review
   dumps.  
4. **Output originality filter:** concepts must be transformed into original angles;
   reject outputs that are near-paraphrases of a single competitor plot.  
5. **Disclaimer on every report:** market patterns ≠ guaranteed outcomes; AuthorChain
   is not Amazon and does not control store ranking or approval.  
6. **No scrape-at-scale in MVP:** automated category crawling is explicitly out of
   scope until Tier 2/3 legal and product review.  
7. **Human responsibility:** author remains responsible for originality, rights, and
   third-party store compliance.

---

## 10. Data source roadmap

| Tier | Description | When |
|------|-------------|------|
| **Tier 1 — Manual / semi-manual MVP** | Author pastes category notes, book links (as references), descriptions, review excerpts. Agent analyzes only those inputs. | **Ship first** |
| **Tier 2 — Compliant public / API sources** | Approved APIs, affiliate/product APIs where allowed, public bestseller feeds, publisher lists, Google Books / Open Library metadata, social trend signals (e.g. BookTok-style public trends). | After MVP |
| **Tier 3 — Advanced market intelligence** | Scheduled category snapshots, rank movement history, review-topic clustering at scale, cross-platform scoring. | Later |

---

## 11. Suggested report structure (machine-readable)

```text
ModernBestsellerOpportunityReport
- genreSnapshot
- bestsellerSignalSummary      // ranks as signals only
- readerExpectations
- praisePatterns[]
- complaintPatterns[]
- marketGaps[]
- coverTitlePositioningNotes
- originalConcepts[]          // titleAngle, hook, outlineDirection, readerPromise
- avoidList[]
- marketingKeywords[]
- riskLevel                   // saturated | moderate | emerging
- disclaimer
- sourcesAcknowledged         // user-provided only in MVP
```

---

## 12. Dashboard UX

### Entry

- Studio nav: **AI Tools → Modern Bestsellers Agent**  
- Route proposal: `/dashboard/agents` tab or dedicated
  `/dashboard/agents/modern-bestsellers` (implementation plan decides)

### Flow

1. Choose genre  
2. Choose research mode(s)  
3. Provide market input (textarea), competitor links (optional list), review excerpts,
   optional own idea  
4. Generate report  
5. View structured report + save  

### UI states

- Empty / first-run guidance  
- Generating (progress)  
- Success with report  
- Partial input warning (e.g. no reviews → weaker complaint patterns)  
- Failure / provider error (safe message)  
- Saved reports list  

### Compliance UI

- Always-visible short disclaimer above generate  
- Link to full compliance notes in help text  
- Explicit “original concepts only — do not copy competitors” callout  

---

## 13. Data model proposal (not implemented)

```text
BookMarketResearchReport
- id
- authorId
- bookId            optional
- genre
- sourceType        e.g. USER_PASTED | MIXED
- sourceUrls        Json   // references only
- inputSummary      text
- trendSignals      Json
- reviewPatterns    Json
- opportunityGaps   Json
- recommendedConcepts Json
- warnings          Json
- riskLevel         string
- rawProviderMeta   Json   // non-sensitive diagnostics only
- createdAt
- updatedAt
```

**Do not** store full scraped HTML or bulk review corpora in MVP.

---

## 14. AI prompt / agent architecture (conceptual)

```text
src/lib/agents/modern-bestsellers/   (future)
- analyze-market-input.ts
- extract-book-signals.ts
- extract-review-patterns.ts
- generate-opportunity-report.ts
- compliance-guardrails.ts
```

Pipeline (logical):

1. **Normalize inputs** → genre, modes, text blocks, optional idea  
2. **Compliance guardrails** → strip/flag long review paste if excessive; refuse
   requests to “rewrite Book X”  
3. **Extract book signals** → tropes, positioning, price/format notes from descriptions  
4. **Extract review patterns** → praise/complaint topics without long quotes  
5. **Opportunity scoring** → gaps + saturation/risk  
6. **Generate original concepts** → multi-angle ideas + avoid-list  
7. **Assemble report** + disclaimer  

Provider: reuse existing AuthorChain agent provider pattern (mock in dev; live model
when configured). Same fail-soft philosophy as other Studio agents.

---

## 15. Risk controls

| Risk | Mitigation |
|------|------------|
| Copyright / derivative plots | Originality instructions + refuse copy modes |
| Review text retention | Prefer summaries; limit paste size; no bulk scrape store |
| Misstated sales figures | Ban exact sales claims; rank = signal language |
| Author over-trust | Risk level + disclaimer + avoid-list |
| Amazon ToS | Tier 1 user-provided; Tier 2 only approved sources |
| Brand damage from “guaranteed bestseller” | Prohibited outputs |
| Privacy | Author-scoped reports; no public market reports by default |

---

## 16. MVP acceptance criteria

- [ ] Author can select genre and research mode  
- [ ] Author can paste market/description/review text and optional idea  
- [ ] Agent returns a full **Modern Bestseller Opportunity Report** structure  
- [ ] Report includes praise/complaint **patterns**, not long review reprints  
- [ ] Report includes **original** concept opportunities and avoid-list  
- [ ] Report never states exact Amazon unit sales  
- [ ] Report never guarantees bestseller or KDP approval  
- [ ] Report includes compliance disclaimer  
- [ ] Author can save and re-open a report in Studio (when data model lands)  
- [ ] Mock provider path works without live API keys  
- [ ] No automatic Amazon scrape-at-scale in MVP  
- [ ] Science Fiction is the first polished genre template; schema works for others  

---

## 17. Future roadmap

1. **Multi-genre templates** (Romantasy, Thriller, Romance, Horror, Nonfiction…)  
2. **Tier 2** approved metadata/API sources  
3. **Compare my manuscript blurb** to gap analysis  
4. **Series opportunity** mode  
5. **History** of opportunity reports per author  
6. **Tier 3** rank movement and trend scoring  
7. Optional link into Copy / Launch agents (“generate blurb from opportunity”)  
8. Optional attachment to a Studio book record for proof/context later  

---

## 18. Relationship to other AuthorChain agents

| Agent | When |
|-------|------|
| **Modern Bestsellers** | Before / while choosing what to write |
| **Copy Agent** | After concept is clear — blurbs and marketing |
| **Launch Agent** | Near release planning |
| **Community Agent** | Reader engagement assets |
| **KDP Readiness** (future) | Preparation / disclosure quality — not market research |

---

## 19. Non-goals (MVP)

- Automated Amazon crawling  
- Exact sales estimation models presented as facts  
- Cover image generation that clones a specific bestseller  
- Review generation or review bombing advice  
- Store ranking manipulation  
- Legal copyright registration services  

---

*End of product spec. Implementation plan:
`docs/product/modern-bestsellers-agent-implementation-plan.md`.*
