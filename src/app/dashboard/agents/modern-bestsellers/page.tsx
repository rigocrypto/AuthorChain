import type { Metadata } from "next";
import Link from "next/link";
import { DashboardPage } from "@/components/dashboard/dashboard-page";
import {
  ModernBestsellersForm,
  type ModernBestsellersLabels,
} from "@/components/modern-bestsellers/modern-bestsellers-form";
import { getOptionalAuthor } from "@/lib/auth/session";
import { listAuthorBooks } from "@/lib/data/books";
import { listMarketResearchReports } from "@/lib/data/market-research-reports";
import { isLiveConfigured } from "@/lib/agents";
import { getDictionary } from "@/i18n/get-dictionary";

export const metadata: Metadata = {
  title: "Modern Bestsellers Agent",
  robots: { index: false, follow: false },
};
export const dynamic = "force-dynamic";

export default async function ModernBestsellersAgentPage() {
  const author = await getOptionalAuthor();
  if (!author) return null;

  const { dict } = await getDictionary();
  const t = dict.dashboard.modernBestsellers;
  const labels: ModernBestsellersLabels = {
    title: t.title,
    intro: t.intro,
    compliance: t.compliance,
    genre: t.genre,
    researchModes: t.researchModes,
    sourceUrls: t.sourceUrls,
    sourceUrlsHint: t.sourceUrlsHint,
    marketNotes: t.marketNotes,
    marketNotesPlaceholder: t.marketNotesPlaceholder,
    reviewExcerpts: t.reviewExcerpts,
    reviewExcerptsHint: t.reviewExcerptsHint,
    reviewExcerptsPlaceholder: t.reviewExcerptsPlaceholder,
    optionalIdea: t.optionalIdea,
    optionalIdeaPlaceholder: t.optionalIdeaPlaceholder,
    linkBook: t.linkBook,
    linkBookHint: t.linkBookHint,
    standalone: t.standalone,
    generate: t.generate,
    generating: t.generating,
    saveDraft: t.saveDraft,
    savingDraft: t.savingDraft,
    providerNote: t.providerNote,
    liveReady: t.liveReady,
    mockBlocked: t.mockBlocked,
    recentReports: t.recentReports,
    deleteReport: t.deleteReport,
    standaloneLabel: t.standaloneLabel,
    linkedLabel: t.linkedLabel,
    sectionGenreSnapshot: t.sectionGenreSnapshot,
    sectionSignals: t.sectionSignals,
    sectionExpectations: t.sectionExpectations,
    sectionPraise: t.sectionPraise,
    sectionComplaints: t.sectionComplaints,
    sectionGaps: t.sectionGaps,
    sectionCoverTitle: t.sectionCoverTitle,
    sectionConcepts: t.sectionConcepts,
    sectionPromise: t.sectionPromise,
    sectionOutline: t.sectionOutline,
    sectionKeywords: t.sectionKeywords,
    sectionRisk: t.sectionRisk,
    sectionWarnings: t.sectionWarnings,
    sectionNextSteps: t.sectionNextSteps,
    sectionAvoid: t.sectionAvoid,
    noReports: t.noReports,
  };

  const [books, reports] = await Promise.all([
    listAuthorBooks(author.id),
    listMarketResearchReports(author.id, 10),
  ]);

  return (
    <DashboardPage
      title={t.title}
      actions={
        <Link
          href="/dashboard/agents"
          className="text-sm text-muted hover:text-foreground"
        >
          {t.backToAgents}
        </Link>
      }
    >
      <ModernBestsellersForm
        books={books.map((b) => ({ id: b.id, title: b.title }))}
        recentReports={reports}
        liveConfigured={isLiveConfigured()}
        labels={labels}
      />
    </DashboardPage>
  );
}
