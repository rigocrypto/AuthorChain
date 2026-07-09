# Book Idea Architect Agent — Product Spec

> **Status:** Draft spec. Not built. This document defines a *future* AuthorChain
> Studio feature. Nothing here ships until it is reviewed and implemented.
>
> **One-line:** An AI planning assistant that turns an author’s raw idea, life
> experience, theme, genre, or message into a complete **original book concept**,
> reader promise, title options, outline, chapter roadmap, and publishing strategy.

---

## 1. Overview

The **Book Idea Architect Agent** helps authors develop **original book blueprints**
— not full publish-ready manuscripts, and not “guaranteed bestsellers.”

It helps authors:

1. Shape a vague idea into a clear **core concept** and **reader promise**.
2. Fit the idea to **genre, audience, and tone**.
3. Differentiate with a **unique angle** (without cloning named works).
4. Produce **title/subtitle options**, a **back-cover description**, and a
   **chapter-by-chapter outline**.
5. Create a **writing roadmap** and **next-step prompts** the author owns.
6. Optionally ground the blueprint in a prior **Modern Bestsellers** market report.

**Positioning:**

> Original book concept · Book blueprint · Market-aware idea development ·
> Reader-focused outline · Author-guided creative planning.

**Not:**

> Guaranteed bestseller · Copy this bestselling formula · KDP approval guarantee ·
> AI-written book ready to publish.

**Product name (recommended):** Book Idea Architect Agent

---

## 2. Problem

Many first-time and independent authors have:

- A strong life experience, expertise, or story seed — but no structured book plan.
- Market research insights (or none) — but no bridge from “idea” to “outline.”
- Fear of producing derivative work if they “study bestsellers” too closely.
- Overwhelm starting a manuscript without a reader promise or chapter map.

AuthorChain already offers market research (Modern Bestsellers Agent), on-chain
proof, Studio tools, and sales. The gap is a **pre-draft blueprint layer** that
turns *their* idea into a professional, original plan.

---

## 3. How it fits AuthorChain

```text
Modern Bestsellers Agent  →  market patterns & reader demand
Book Idea Architect Agent →  original book blueprint from the author’s idea
KDP Readiness Agent       →  later manuscript preparation & disclosure guidance
AuthorChain Proof         →  on-chain proof-of-authorship registration
Publish & sell            →  storefront, Stripe, protected reader delivery
```

The author remains the **creative owner and decision maker** at every step.

---

## 4. Target users

- Indie / self-published / KDP-oriented authors.
- First-time authors with raw ideas.
- Nonfiction creators with expertise or a method.
- Fiction writers building premise, world, or series seeds.
- AI-assisted authors who still want **original** ownership.
- Authors who finished a market research report and need a concrete book plan.

Assumed product language: English UI first; full platform locales when shipping.

---

## 5. User stories

- *As an author,* I want to paste a rough idea and get a structured blueprint so I
  know what book I’m writing before I draft.
- *As a nonfiction author,* I want a transformation promise and chapter progression
  so my expertise becomes a useful book for a specific reader.
- *As a fiction author,* I want premise, stakes, conflict, and chapter map so I
  start drafting with clarity.
- *As an author with a market report,* I want optional linkage so my blueprint can
  respect demand signals without copying competitors.
- *As an author,* I want title and description options as **ideas**, not final
  mandatory copy.
- *As an author,* I never want the product to guarantee bestseller/KDP outcomes or
  write a full “ready to publish” manuscript in this MVP.
- *As AuthorChain,* we want a trustworthy Studio agent that deepens the idea →
  publish pipeline without legal or expectation risk.

---

## 6. MVP input types

| Input | Required | Notes |
|-------|----------|--------|
| Fiction / Nonfiction | Yes | Drives schema branch |
| Working genre | Yes | e.g. Science Fiction, Memoir, Business… |
| Raw idea | Yes | Free text seed |
| Target reader | Recommended | Who the book is for |
| Desired tone | Optional | e.g. warm, bold, clinical, lyrical |
| Themes | Optional | Free text or tags |
| Personal experience / expertise | Optional | Especially nonfiction credibility |
| Comparable books | Optional | Titles as reference only — never clone plots |
| Linked `BookMarketResearchReport` | Optional | Market-aware positioning |
| Linked `Book` | Optional | Attach blueprint to existing Studio book |
| Language preference | Optional | Default English for MVP output |

**No automatic scraping.** No marketplace fetch. User-provided text and optional
internal AuthorChain links only.

---

## 7. MVP output

Primary artifact: **Book Idea Blueprint** (structured JSON + human-readable view).

### Shared sections

1. Idea summary / core concept  
2. Logline or reader promise  
3. Target audience  
4. Genre / category fit  
5. Unique angle / differentiation  
6. Title and subtitle options  
7. Back-cover / store description  
8. Chapter-by-chapter outline  
9. Writing roadmap  
10. Market positioning notes  
11. Originality / risk warnings  
12. Next-step prompts for the author  
13. Compliance disclaimer  

### Fiction-specific

- Premise  
- Protagonist  
- Antagonist / central conflict  
- Worldbuilding notes (light)  
- Stakes  
- Tropes to use carefully  
- Series potential  
- Ending promise  

### Nonfiction-specific

- Transformation promise  
- Reader problem  
- Framework / method  
- Chapter progression logic  
- Exercises or reflection prompts (optional)  
- Credibility notes  
- Practical outcomes  

### Explicitly out of MVP scope

- Full publish-ready manuscript  
- Automatic cover image generation (Cover Concept Agent later)  
- Guarantees of sales, rank, or KDP approval  
- Public blueprint pages  

---

## 8. What the agent must not do

- Copy bestseller plots or closely imitate a living author’s style.  
- Reproduce copyrighted descriptions or long reviews.  
- Guarantee bestseller status or KDP / marketplace approval.  
- Claim official government copyright protection.  
- Create fake reviews or recommend review manipulation.  
- Output a full publish-ready manuscript in this MVP.  
- Replace the author’s responsibility for originality and quality.  
- Scrape marketplaces or bypass platform policies.  

---

## 9. Compliance guardrails

- Author remains creative owner and final decision maker.  
- Label outputs as **creative planning guidance**.  
- Ask clarifying questions (or note assumptions) when input is vague.  
- Encourage originality and differentiation.  
- Avoid close imitation of named works; use comps only as **positioning context**.  
- Never claim commercial success is guaranteed.  
- Prefer summarizing market patterns over quoting third-party text.  
- Store only what is needed for the author’s private blueprint — not bulk
  copyrighted material.  

**Safe language:** original book concept, book blueprint, market-aware idea
development, reader-focused outline, higher market potential, professionally
positioned.

**Unsafe language:** guaranteed bestseller, copy this formula, KDP approval
guarantee, AI-written book ready to publish.

---

## 10. Suggested report structure

```text
Book Idea Blueprint

1. Idea summary
2. Reader promise
3. Best-fit genre
4. Target audience
5. Unique angle
6. Title / subtitle options
7. Book description
8. Chapter outline
9. Writing roadmap
10. Market positioning
11. Originality guardrails
12. Risks to avoid
13. Next-step prompts
14. Compliance disclaimer
```

---

## 11. Dashboard UX

**Route:** `/dashboard/agents/book-idea-architect`

**Form:**

- Fiction / Nonfiction selector  
- Genre selector  
- Raw idea textarea  
- Target reader textarea  
- Tone selector  
- Themes textarea  
- Optional personal experience / expertise  
- Optional comparable books (titles only)  
- Optional market research report selector  
- Optional book selector  
- Generate blueprint button  
- Save draft option (if inputs incomplete)  

**Output:**

- Saved **private** idea blueprint  
- Sectioned report view (DRAFT / READY / FAILED)  
- Delete blueprint  
- Future: editable sections; convert blueprint → draft Book record  

**Compliance copy (UI):**

> This agent helps you plan an original book blueprint. It does not guarantee
> bestseller status, KDP approval, or commercial success. You remain the author
> and creative owner.

---

## 12. Data model proposal (not implemented)

### `BookIdeaBlueprint`

| Field | Type | Notes |
|-------|------|--------|
| `id` | cuid | PK |
| `authorId` | string | Always scoped |
| `bookId` | string? | Optional FK Book |
| `marketResearchReportId` | string? | Optional FK BookMarketResearchReport |
| `type` | enum | `FICTION` \| `NONFICTION` |
| `genre` | string | |
| `rawIdeaSummary` | string? | Short summary — not bulk dumps |
| `targetReader` | string? | |
| `tone` | string? | |
| `themes` | Json? | |
| `concept` | Json? | Core concept, promise, angle… |
| `titleOptions` | Json? | |
| `outline` | Json? | Chapters |
| `positioning` | Json? | Market notes |
| `warnings` | Json? | Risks + compliance |
| `nextSteps` | Json? | |
| `status` | enum | `DRAFT` \| `READY` \| `FAILED` |
| `createdAt` / `updatedAt` | datetime | |

Indexes: `(authorId, createdAt desc)`, optional `(authorId, bookId)`.

### Privacy

- Private to owning author only.  
- No public routes.  
- No marketplace credentials, cookies, or secrets.  
- Do not store unnecessary third-party copyrighted text.  

---

## 13. AI prompt / agent architecture (conceptual)

```text
src/lib/agents/book-idea-architect/
  types.ts
  validate-inputs.ts
  compliance-guardrails.ts
  build-prompt.ts
  generate-blueprint.ts
  normalize-blueprint.ts
  fiction-schema.ts
  nonfiction-schema.ts
  index.ts
```

Pipeline:

1. Validate inputs + compliance  
2. Optionally load author-owned market report summary (not raw reviews)  
3. Build fiction or nonfiction prompt  
4. Live LLM JSON generation (same env pattern as other agents)  
5. Normalize + output guardrails  
6. Persist READY or FAILED privately  

If no AI provider configured: fail safely; allow draft save of inputs only.

---

## 14. Risk controls

| Risk | Mitigation |
|------|------------|
| Derivative / clone output | Guardrails + “originality” section + comps as context only |
| Over-promise commercial success | Banned phrases + disclaimer |
| Full-book generation expectation | MVP scope = blueprint only |
| Privacy leak | Author-scoped DB; no public pages |
| Copyrighted paste abuse | Cap sizes; store summaries, not bulk third-party text |
| Provider errors | Safe user messages; no secrets/prompts in UI |

---

## 15. MVP acceptance criteria

- Author can create a private book idea blueprint.  
- Author can generate a structured concept from user-provided inputs.  
- Fiction and nonfiction branches produce appropriate sections.  
- Author can list/view saved blueprints.  
- Author can delete a blueprint.  
- Blueprint can optionally link to a Book and/or market research report.  
- No scraping; no public exposure.  
- No bestseller / KDP guarantees in copy or model output.  
- Failed generation shows a safe message and FAILED status.  

---

## 16. Future roadmap

1. Editable blueprint sections in Studio.  
2. “Create Book draft from blueprint” one-click.  
3. Deeper Modern Bestsellers integration (auto-suggest angles from gaps).  
4. Cover Concept Agent handoff (prompts from title/genre).  
5. Manuscript Assistant chapter drafting from approved outline.  
6. Multi-language blueprint generation.  
7. Series bible / multi-book roadmap.  

---

## 17. Relationship to other agents

| Agent | Relationship |
|-------|----------------|
| Modern Bestsellers | Upstream market patterns → optional input |
| Book Blueprint (future name variant) | May merge or specialize structure depth |
| Cover Concept | Downstream visual direction |
| Manuscript Assistant | Downstream drafting from outline |
| Editorial / KDP Readiness | Later quality & disclosure |
| Proof-of-Authorship | After final manuscript exists |
| Launch & Sales | After publish |

---

## 18. Non-goals (MVP)

- Writing the entire book automatically.  
- Guaranteeing sales or marketplace approval.  
- Public sharing of blueprints.  
- Legal copyright filing.  
- Replacing human judgment on originality.  

---

## 19. Suggested homepage / Studio language (when marketing is updated later)

**Do:**

- “Turn a raw idea into a professional book blueprint.”  
- “Original concept, reader promise, outline, and writing plan.”  
- “Market-aware idea development under your creative control.”  

**Don’t:**

- “Guaranteed bestseller generator.”  
- “AI writes a publish-ready book for you.”  
- “Bypass KDP filters.”  

*(This section is documentation only — do not change live marketing copy until
explicitly approved.)*
