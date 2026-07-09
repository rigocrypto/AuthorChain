"use client";

import { useActionState, useState, useTransition } from "react";
import {
  generateModernBestsellersReportAction,
  saveModernBestsellersDraftAction,
  deleteModernBestsellersReportAction,
  type ModernBestsellersActionState,
} from "@/app/dashboard/agents/modern-bestsellers/actions";
import {
  COMPLIANCE_UI_COPY,
  DEFAULT_GENRE,
  MODERN_BESTSELLERS_GENRES,
  RESEARCH_MODES,
  type ModernBestsellerOpportunityReport,
} from "@/lib/agents/modern-bestsellers";
import type { MarketResearchReportDTO } from "@/lib/data/market-research-reports";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/ui/status-badge";

export type FormBookOption = { id: string; title: string };

export type ModernBestsellersLabels = {
  title: string;
  intro: string;
  compliance: string;
  genre: string;
  researchModes: string;
  sourceUrls: string;
  sourceUrlsHint: string;
  marketNotes: string;
  marketNotesPlaceholder: string;
  reviewExcerpts: string;
  reviewExcerptsHint: string;
  reviewExcerptsPlaceholder: string;
  optionalIdea: string;
  optionalIdeaPlaceholder: string;
  linkBook: string;
  linkBookHint: string;
  standalone: string;
  generate: string;
  generating: string;
  saveDraft: string;
  savingDraft: string;
  providerNote: string;
  liveReady: string;
  mockBlocked: string;
  recentReports: string;
  deleteReport: string;
  standaloneLabel: string;
  linkedLabel: string;
  sectionGenreSnapshot: string;
  sectionSignals: string;
  sectionExpectations: string;
  sectionPraise: string;
  sectionComplaints: string;
  sectionGaps: string;
  sectionCoverTitle: string;
  sectionConcepts: string;
  sectionPromise: string;
  sectionOutline: string;
  sectionKeywords: string;
  sectionRisk: string;
  sectionWarnings: string;
  sectionNextSteps: string;
  sectionAvoid: string;
  noReports: string;
};

const field =
  "w-full rounded-lg border border-border bg-surface-2 px-3 py-2 text-sm text-foreground placeholder:text-muted focus:border-primary/60 focus:outline-none";

const initial: ModernBestsellersActionState = {};

function statusTone(
  status: string,
): "success" | "warning" | "muted" | "accent" {
  if (status === "READY") return "success";
  if (status === "FAILED") return "warning";
  if (status === "DRAFT") return "accent";
  return "muted";
}

function asReportBody(
  report: MarketResearchReportDTO,
): Partial<ModernBestsellerOpportunityReport> & { error?: string } {
  if (!report.report || typeof report.report !== "object") return {};
  return report.report as Partial<ModernBestsellerOpportunityReport> & {
    error?: string;
  };
}

function ReportView({
  report,
  labels,
  onDeleted,
}: {
  report: MarketResearchReportDTO;
  labels: ModernBestsellersLabels;
  onDeleted?: () => void;
}) {
  const body = asReportBody(report);
  const warnings = Array.isArray(report.warnings)
    ? (report.warnings as string[])
    : [];
  const [pending, startTransition] = useTransition();
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const list = (items: string[] | undefined) =>
    items && items.length > 0 ? (
      <ul className="mt-1 list-disc space-y-1 pl-5 text-muted">
        {items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    ) : null;

  return (
    <Card className="mt-4">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <div className="flex flex-wrap items-center gap-2">
          <CardTitle as="div">{report.genre}</CardTitle>
          <StatusBadge tone={statusTone(report.status)}>
            {report.status}
          </StatusBadge>
          {body.pipelinePhase === "scaffold" ? (
            <StatusBadge tone="accent">Scaffold</StatusBadge>
          ) : null}
          {body.pipelinePhase === "full" && report.status === "READY" ? (
            <StatusBadge tone="success">AI</StatusBadge>
          ) : null}
          <span className="text-xs text-muted">
            {report.createdAt.slice(0, 16).replace("T", " ")}
          </span>
        </div>
        <Button
          type="button"
          variant="ghost"
          disabled={pending}
          onClick={() => {
            setDeleteError(null);
            startTransition(async () => {
              const res = await deleteModernBestsellersReportAction(report.id);
              if (res.error) setDeleteError(res.error);
              else onDeleted?.();
            });
          }}
        >
          {pending ? "…" : labels.deleteReport}
        </Button>
      </div>
      <CardDescription>
        {report.bookTitle
          ? `${labels.linkedLabel}: ${report.bookTitle}`
          : labels.standaloneLabel}
        {body.providerName ? ` · ${body.providerName}` : ""}
      </CardDescription>
      {report.inputSummary ? (
        <p className="mt-2 text-xs text-muted">{report.inputSummary}</p>
      ) : null}
      {deleteError ? (
        <p className="mt-2 text-sm text-warning">{deleteError}</p>
      ) : null}

      {report.status === "FAILED" ? (
        <p className="mt-4 rounded-lg border border-warning/40 bg-warning/10 px-3 py-2 text-sm text-warning">
          {body.error ||
            (warnings[0] ?? "Generation failed. Please try again.")}
        </p>
      ) : null}

      {warnings.length > 0 && report.status !== "FAILED" ? (
        <div className="mt-4">
          <h3 className="text-sm font-medium">{labels.sectionWarnings}</h3>
          {list(warnings)}
        </div>
      ) : null}

      {report.status !== "FAILED" && body.genreSnapshot ? (
        <div className="mt-4 space-y-4 text-sm">
          <section>
            <h3 className="font-medium">{labels.sectionGenreSnapshot}</h3>
            <p className="text-muted">{body.genreSnapshot}</p>
          </section>
          <section>
            <h3 className="font-medium">{labels.sectionSignals}</h3>
            <p className="text-muted">{body.bestsellerSignalSummary}</p>
          </section>
          <section>
            <h3 className="font-medium">{labels.sectionExpectations}</h3>
            {list(body.readerExpectations)}
          </section>
          <section>
            <h3 className="font-medium">{labels.sectionPraise}</h3>
            {list(body.commonPraisePatterns)}
          </section>
          <section>
            <h3 className="font-medium">{labels.sectionComplaints}</h3>
            {list(body.commonComplaintPatterns)}
          </section>
          <section>
            <h3 className="font-medium">{labels.sectionGaps}</h3>
            {list(body.marketGaps)}
          </section>
          <section>
            <h3 className="font-medium">{labels.sectionCoverTitle}</h3>
            {list(body.coverTitlePositioning)}
          </section>
          <section>
            <h3 className="font-medium">{labels.sectionConcepts}</h3>
            <ul className="mt-2 space-y-2">
              {(body.originalConceptOpportunities ?? []).map((c) => (
                <li
                  key={`${c.title}-${c.angle.slice(0, 24)}`}
                  className="rounded-lg border border-border bg-surface-2 p-3"
                >
                  <div className="font-medium">{c.title}</div>
                  <p className="text-muted">{c.angle}</p>
                  <p className="mt-1 text-xs text-muted">
                    {labels.sectionPromise}: {c.readerPromise}
                  </p>
                </li>
              ))}
            </ul>
          </section>
          <section>
            <h3 className="font-medium">{labels.sectionPromise}</h3>
            <p className="text-muted">{body.readerPromise}</p>
          </section>
          <section>
            <h3 className="font-medium">{labels.sectionOutline}</h3>
            <p className="text-muted">{body.suggestedOutlineDirection}</p>
          </section>
          <section>
            <h3 className="font-medium">{labels.sectionKeywords}</h3>
            {list(body.marketingKeywordIdeas)}
          </section>
          <section>
            <h3 className="font-medium">{labels.sectionRisk}</h3>
            <p className="text-muted">
              {body.saturationRiskLevel ?? "unknown"}
            </p>
          </section>
          <section>
            <h3 className="font-medium">{labels.sectionNextSteps}</h3>
            {list(body.nextSteps)}
          </section>
          <section>
            <h3 className="font-medium">{labels.sectionAvoid}</h3>
            {list(body.avoidList)}
          </section>
          {body.complianceDisclaimer ? (
            <p className="rounded-lg border border-border bg-surface-2 p-3 text-xs text-muted">
              {body.complianceDisclaimer}
            </p>
          ) : null}
        </div>
      ) : null}
    </Card>
  );
}

export function ModernBestsellersForm({
  books,
  recentReports,
  liveConfigured,
  labels,
}: {
  books: FormBookOption[];
  recentReports: MarketResearchReportDTO[];
  liveConfigured: boolean;
  labels: ModernBestsellersLabels;
}) {
  const [genState, genAction, genPending] = useActionState(
    generateModernBestsellersReportAction,
    initial,
  );
  const [draftState, draftAction, draftPending] = useActionState(
    saveModernBestsellersDraftAction,
    initial,
  );
  const [history, setHistory] = useState(recentReports);

  const pending = genPending || draftPending;
  const state: ModernBestsellersActionState = genPending
    ? genState
    : draftPending
      ? draftState
      : genState.report || genState.error || genState.success
        ? genState
        : draftState.report || draftState.error || draftState.success
          ? draftState
          : genState;

  const displayReport = state.report;
  const showHistory = history.filter((r) => r.id !== displayReport?.id);

  return (
    <div className="space-y-6">
      <Card>
        <CardTitle>{labels.title}</CardTitle>
        <CardDescription>{labels.compliance}</CardDescription>
        <p className="mt-2 text-sm text-muted">{labels.intro}</p>
        <div className="mt-3">
          <StatusBadge tone={liveConfigured ? "success" : "warning"}>
            {liveConfigured ? labels.liveReady : labels.mockBlocked}
          </StatusBadge>
        </div>
      </Card>

      <Card>
        <form action={genAction} className="space-y-4">
          <div>
            <label htmlFor="genre" className="mb-1 block text-sm font-medium">
              {labels.genre}
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
            <legend className="mb-2 text-sm font-medium">
              {labels.researchModes}
            </legend>
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
              {labels.sourceUrls}{" "}
              <span className="font-normal text-muted">
                ({labels.sourceUrlsHint})
              </span>
            </label>
            <textarea
              id="sourceUrls"
              name="sourceUrls"
              rows={3}
              className={field}
              placeholder="https://…"
            />
          </div>

          <div>
            <label
              htmlFor="marketNotes"
              className="mb-1 block text-sm font-medium"
            >
              {labels.marketNotes}
            </label>
            <textarea
              id="marketNotes"
              name="marketNotes"
              rows={6}
              className={field}
              placeholder={labels.marketNotesPlaceholder}
            />
          </div>

          <div>
            <label
              htmlFor="reviewExcerpts"
              className="mb-1 block text-sm font-medium"
            >
              {labels.reviewExcerpts}{" "}
              <span className="font-normal text-muted">
                ({labels.reviewExcerptsHint})
              </span>
            </label>
            <textarea
              id="reviewExcerpts"
              name="reviewExcerpts"
              rows={5}
              className={field}
              placeholder={labels.reviewExcerptsPlaceholder}
            />
          </div>

          <div>
            <label
              htmlFor="optionalIdea"
              className="mb-1 block text-sm font-medium"
            >
              {labels.optionalIdea}
            </label>
            <textarea
              id="optionalIdea"
              name="optionalIdea"
              rows={3}
              className={field}
              placeholder={labels.optionalIdeaPlaceholder}
            />
          </div>

          <div>
            <label htmlFor="bookId" className="mb-1 block text-sm font-medium">
              {labels.linkBook}{" "}
              <span className="font-normal text-muted">
                ({labels.linkBookHint})
              </span>
            </label>
            <select id="bookId" name="bookId" className={field} defaultValue="">
              <option value="">{labels.standalone}</option>
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

          <div className="flex flex-wrap gap-3">
            <Button type="submit" disabled={pending || !liveConfigured}>
              {genPending ? labels.generating : labels.generate}
            </Button>
            <Button
              type="submit"
              variant="secondary"
              disabled={pending}
              formAction={draftAction}
            >
              {draftPending ? labels.savingDraft : labels.saveDraft}
            </Button>
          </div>
          <p className="text-xs text-muted">{labels.providerNote}</p>
          <p className="text-xs text-muted">{COMPLIANCE_UI_COPY}</p>
        </form>
      </Card>

      {displayReport ? (
        <ReportView
          report={displayReport}
          labels={labels}
          onDeleted={() => {
            setHistory((h) => h.filter((r) => r.id !== displayReport.id));
          }}
        />
      ) : null}

      <section>
        <h2 className="mb-3 text-lg font-semibold">{labels.recentReports}</h2>
        {showHistory.length === 0 && !displayReport ? (
          <Card>
            <p className="text-sm text-muted">{labels.noReports}</p>
          </Card>
        ) : (
          <div className="space-y-3">
            {showHistory.map((r) => (
              <ReportView
                key={r.id}
                report={r}
                labels={labels}
                onDeleted={() =>
                  setHistory((h) => h.filter((x) => x.id !== r.id))
                }
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
