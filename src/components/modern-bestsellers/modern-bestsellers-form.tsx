"use client";

import { useActionState } from "react";
import {
  saveModernBestsellersDraftAction,
  type ModernBestsellersActionState,
} from "@/app/dashboard/agents/modern-bestsellers/actions";
import {
  COMPLIANCE_UI_COPY,
  DEFAULT_GENRE,
  MODERN_BESTSELLERS_GENRES,
  RESEARCH_MODES,
} from "@/lib/agents/modern-bestsellers";
import type { MarketResearchReportDTO } from "@/lib/data/market-research-reports";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/ui/status-badge";

export type FormBookOption = { id: string; title: string };

const field =
  "w-full rounded-lg border border-border bg-surface-2 px-3 py-2 text-sm text-foreground placeholder:text-muted focus:border-primary/60 focus:outline-none";

const initial: ModernBestsellersActionState = {};

function ReportPreview({ report }: { report: MarketResearchReportDTO }) {
  const body = report.report as {
    genreSnapshot?: string;
    bestsellerSignalSummary?: string;
    originalConceptOpportunities?: {
      title: string;
      angle: string;
      readerPromise: string;
    }[];
    recommendedReaderPromise?: string;
    avoidList?: string[];
    suggestedOutlineDirection?: string;
    complianceDisclaimer?: string;
    pipelinePhase?: string;
    riskLevel?: string;
  } | null;

  const warnings = Array.isArray(report.warnings)
    ? (report.warnings as string[])
    : [];

  return (
    <Card className="mt-6">
      <div className="mb-3 flex flex-wrap items-center gap-2">
        <CardTitle>Saved draft</CardTitle>
        <StatusBadge tone="warning">{report.status}</StatusBadge>
        {body?.pipelinePhase === "scaffold" ? (
          <StatusBadge tone="accent">Scaffold</StatusBadge>
        ) : null}
        <span className="text-xs text-muted">
          {report.createdAt.slice(0, 16).replace("T", " ")}
        </span>
      </div>
      <CardDescription>
        {report.genre}
        {report.bookTitle ? ` · linked: ${report.bookTitle}` : " · standalone"}
      </CardDescription>
      {report.inputSummary ? (
        <p className="mt-2 text-xs text-muted">{report.inputSummary}</p>
      ) : null}

      {warnings.length > 0 ? (
        <ul className="mt-4 list-disc space-y-1 pl-5 text-sm text-warning">
          {warnings.map((w) => (
            <li key={w}>{w}</li>
          ))}
        </ul>
      ) : null}

      {body ? (
        <div className="mt-4 space-y-3 text-sm">
          <section>
            <h3 className="font-medium">Genre snapshot</h3>
            <p className="text-muted">{body.genreSnapshot}</p>
          </section>
          <section>
            <h3 className="font-medium">Bestseller signal summary</h3>
            <p className="text-muted">{body.bestsellerSignalSummary}</p>
          </section>
          <section>
            <h3 className="font-medium">Original concept opportunities</h3>
            <ul className="mt-1 space-y-2">
              {(body.originalConceptOpportunities ?? []).map((c) => (
                <li
                  key={c.title}
                  className="rounded-lg border border-border bg-surface-2 p-3"
                >
                  <div className="font-medium">{c.title}</div>
                  <p className="text-muted">{c.angle}</p>
                  <p className="mt-1 text-xs text-muted">
                    Reader promise: {c.readerPromise}
                  </p>
                </li>
              ))}
            </ul>
          </section>
          <section>
            <h3 className="font-medium">Recommended reader promise</h3>
            <p className="text-muted">{body.recommendedReaderPromise}</p>
          </section>
          <section>
            <h3 className="font-medium">Outline direction</h3>
            <p className="text-muted">{body.suggestedOutlineDirection}</p>
          </section>
          <section>
            <h3 className="font-medium">Avoid-list / market warnings</h3>
            <ul className="list-disc pl-5 text-muted">
              {(body.avoidList ?? []).map((a) => (
                <li key={a}>{a}</li>
              ))}
            </ul>
          </section>
          <p className="rounded-lg border border-border bg-surface-2 p-3 text-xs text-muted">
            {body.complianceDisclaimer}
          </p>
        </div>
      ) : null}
    </Card>
  );
}

export function ModernBestsellersForm({
  books,
  recentReports,
}: {
  books: FormBookOption[];
  recentReports: MarketResearchReportDTO[];
}) {
  const [state, formAction, pending] = useActionState(
    saveModernBestsellersDraftAction,
    initial,
  );

  return (
    <div className="space-y-6">
      <Card>
        <CardTitle>Modern Bestsellers Agent</CardTitle>
        <CardDescription>{COMPLIANCE_UI_COPY}</CardDescription>
        <p className="mt-2 text-xs text-muted">
          Phase 1: save a private research draft from content you paste. AI
          opportunity generation comes next — no automatic Amazon scraping.
        </p>
      </Card>

      <Card>
        <form action={formAction} className="space-y-4">
          <div>
            <label htmlFor="genre" className="mb-1 block text-sm font-medium">
              Genre
            </label>
            <select
              id="genre"
              name="genre"
              className={field}
              defaultValue={DEFAULT_GENRE}
              required
            >
              {MODERN_BESTSELLERS_GENRES.map((g) => (
                <option key={g} value={g}>
                  {g}
                </option>
              ))}
            </select>
          </div>

          <fieldset>
            <legend className="mb-2 text-sm font-medium">Research modes</legend>
            <div className="grid gap-2 sm:grid-cols-2">
              {RESEARCH_MODES.map((m) => (
                <label
                  key={m.id}
                  className="flex items-start gap-2 text-sm text-muted"
                >
                  <input
                    type="checkbox"
                    name="modes"
                    value={m.id}
                    defaultChecked={
                      m.id === "competitors" || m.id === "opportunities"
                    }
                    className="mt-1"
                  />
                  <span>{m.label}</span>
                </label>
              ))}
            </div>
          </fieldset>

          <div>
            <label
              htmlFor="sourceUrls"
              className="mb-1 block text-sm font-medium"
            >
              Source URLs{" "}
              <span className="font-normal text-muted">
                (optional, https only — not auto-fetched)
              </span>
            </label>
            <textarea
              id="sourceUrls"
              name="sourceUrls"
              rows={3}
              className={field}
              placeholder={
                "One URL per line, e.g.\nhttps://www.amazon.com/best-sellers-books-..."
              }
            />
          </div>

          <div>
            <label
              htmlFor="marketNotes"
              className="mb-1 block text-sm font-medium"
            >
              Book descriptions / market notes
            </label>
            <textarea
              id="marketNotes"
              name="marketNotes"
              rows={6}
              className={field}
              placeholder="Paste bestseller blurbs, category notes, or competitor descriptions you collected yourself…"
            />
          </div>

          <div>
            <label
              htmlFor="reviewExcerpts"
              className="mb-1 block text-sm font-medium"
            >
              Review excerpts{" "}
              <span className="font-normal text-muted">
                (short excerpts; patterns only — full text not stored)
              </span>
            </label>
            <textarea
              id="reviewExcerpts"
              name="reviewExcerpts"
              rows={5}
              className={field}
              placeholder="Paste short review snippets that show praise or complaints…"
            />
          </div>

          <div>
            <label
              htmlFor="optionalIdea"
              className="mb-1 block text-sm font-medium"
            >
              Your book idea{" "}
              <span className="font-normal text-muted">(optional)</span>
            </label>
            <textarea
              id="optionalIdea"
              name="optionalIdea"
              rows={3}
              className={field}
              placeholder="Optional concept to compare against market demand later…"
            />
          </div>

          <div>
            <label htmlFor="bookId" className="mb-1 block text-sm font-medium">
              Link to existing book{" "}
              <span className="font-normal text-muted">
                (optional — standalone reports allowed)
              </span>
            </label>
            <select id="bookId" name="bookId" className={field} defaultValue="">
              <option value="">— Standalone report (no book) —</option>
              {books.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.title}
                </option>
              ))}
            </select>
          </div>

          {state.error ? (
            <p className="rounded-lg border border-warning/40 bg-warning/10 px-3 py-2 text-sm text-warning">
              {state.error}
            </p>
          ) : null}
          {state.success ? (
            <p className="rounded-lg border border-primary/30 bg-primary/10 px-3 py-2 text-sm">
              {state.success}
            </p>
          ) : null}

          <Button type="submit" disabled={pending}>
            {pending ? "Saving draft…" : "Save research draft"}
          </Button>
          <p className="text-xs text-muted">
            Generate full opportunity report with AI is Phase 2. This step
            validates inputs and stores a private scaffold draft.
          </p>
        </form>
      </Card>

      {state.report ? <ReportPreview report={state.report} /> : null}

      {recentReports.length > 0 ? (
        <section>
          <h2 className="mb-3 text-lg font-semibold">Your recent reports</h2>
          <div className="space-y-3">
            {recentReports.map((r) => (
              <Card key={r.id}>
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="text-sm">
                    <span className="font-medium">{r.genre}</span>
                    <span className="text-muted">
                      {" "}
                      · {r.bookTitle ?? "standalone"} ·{" "}
                      {r.createdAt.slice(0, 16).replace("T", " ")}
                    </span>
                  </div>
                  <StatusBadge
                    tone={r.status === "READY" ? "success" : "warning"}
                  >
                    {r.status}
                  </StatusBadge>
                </div>
                {r.inputSummary ? (
                  <p className="mt-2 text-xs text-muted">{r.inputSummary}</p>
                ) : null}
              </Card>
            ))}
          </div>
        </section>
      ) : null}
    </div>
  );
}
