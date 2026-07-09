import type { Metadata } from "next";
import Link from "next/link";
import { DashboardPage } from "@/components/dashboard/dashboard-page";
import { ModernBestsellersForm } from "@/components/modern-bestsellers/modern-bestsellers-form";
import { getOptionalAuthor } from "@/lib/auth/session";
import { listAuthorBooks } from "@/lib/data/books";
import { listMarketResearchReports } from "@/lib/data/market-research-reports";

export const metadata: Metadata = {
  title: "Modern Bestsellers Agent",
  robots: { index: false, follow: false },
};
export const dynamic = "force-dynamic";

export default async function ModernBestsellersAgentPage() {
  const author = await getOptionalAuthor();
  if (!author) return null;

  const [books, reports] = await Promise.all([
    listAuthorBooks(author.id),
    listMarketResearchReports(author.id, 10),
  ]);

  return (
    <DashboardPage
      title="Modern Bestsellers Agent"
      actions={
        <Link
          href="/dashboard/agents"
          className="text-sm text-muted hover:text-foreground"
        >
          ← All agents
        </Link>
      }
    >
      <ModernBestsellersForm
        books={books.map((b) => ({ id: b.id, title: b.title }))}
        recentReports={reports}
      />
    </DashboardPage>
  );
}
