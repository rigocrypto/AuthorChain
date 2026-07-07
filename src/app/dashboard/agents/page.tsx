import type { Metadata } from "next";
import { DashboardPage } from "@/components/dashboard/dashboard-page";
import { AgentStudio, type StudioBook } from "@/components/agent-studio";
import { AgentCard } from "@/components/agent-card";
import { Card } from "@/components/ui/card";
import { StatusBadge } from "@/components/ui/status-badge";
import { getOptionalAuthor } from "@/lib/auth/session";
import { listAuthorBooks } from "@/lib/data/books";
import { listAgentOutputs } from "@/lib/data/agent-outputs";
import { getAgentMeta, previewAgents, isLiveConfigured } from "@/lib/agents";
import { getDictionary } from "@/i18n/get-dictionary";

export const metadata: Metadata = { title: "AI agents" };
export const dynamic = "force-dynamic";

export default async function AgentsPage() {
  // Layout guard owns the unauthenticated redirect; bail quietly to avoid a
  // redundant "Unauthorized" throw during parallel render.
  const author = await getOptionalAuthor();
  if (!author) return null;

  const { dict } = await getDictionary();
  const t = dict.dashboard;
  const [books, history] = await Promise.all([
    listAuthorBooks(author.id),
    listAgentOutputs(author.id, 10),
  ]);

  const studioBooks: StudioBook[] = books.map((b) => ({
    id: b.id,
    title: b.title,
    subtitle: b.subtitle,
    description: b.description,
    category: b.category,
  }));

  const live = isLiveConfigured();

  return (
    <DashboardPage title={t.titleAgents}>
      <div className="mb-6 flex flex-wrap items-center gap-3">
        <p className="max-w-2xl text-sm text-muted">{t.agentsIntro}</p>
        <StatusBadge tone={live ? "success" : "warning"}>
          {live ? t.liveConfigured : t.mockMode}
        </StatusBadge>
      </div>

      <AgentStudio agents={getAgentMeta()} books={studioBooks} />

      {/* Previous outputs */}
      <section className="mt-10">
        <h2 className="mb-3 text-lg font-semibold">{t.previousOutputs}</h2>
        {history.length === 0 ? (
          <Card>
            <p className="text-sm text-muted">{t.noOutputsYet}</p>
          </Card>
        ) : (
          <div className="space-y-3">
            {history.map((h) => (
              <Card key={h.id}>
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="text-sm">
                    <span className="font-medium">{h.agentType}</span>
                    <span className="text-muted"> · {h.bookTitle}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <StatusBadge tone={h.mocked ? "warning" : "success"}>
                      {h.providerName}
                    </StatusBadge>
                    <span className="text-xs text-muted">{h.createdAt}</span>
                  </div>
                </div>
                <details className="mt-2">
                  <summary className="cursor-pointer text-sm text-accent">
                    {t.viewAssets} ({h.assets.length})
                  </summary>
                  <div className="mt-2 space-y-2">
                    {h.assets.map((a) => (
                      <div key={a.key}>
                        <div className="text-xs font-medium text-muted">{a.label}</div>
                        <pre className="whitespace-pre-wrap rounded-lg border border-border bg-surface-2 p-2 text-sm">
                          {a.content}
                        </pre>
                      </div>
                    ))}
                  </div>
                </details>
              </Card>
            ))}
          </div>
        )}
      </section>

      {/* Phase-2 previews */}
      <section className="mt-10">
        <h2 className="mb-3 text-lg font-semibold">{t.comingPhase2}</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          {previewAgents.map((a) => (
            <AgentCard
              key={a.id}
              name={a.name}
              description={a.description}
              badge="Phase 2"
            />
          ))}
        </div>
      </section>
    </DashboardPage>
  );
}
