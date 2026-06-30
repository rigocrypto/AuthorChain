import type { Metadata } from "next";
import { DashboardPage } from "@/components/dashboard/dashboard-page";
import { AgentCard } from "@/components/agent-card";
import { agentRegistry } from "@/lib/ai/agents";

export const metadata: Metadata = { title: "AI agents" };

export default function AgentsPage() {
  return (
    <DashboardPage title="AI agents">
      <p className="mb-6 max-w-2xl text-sm text-muted">
        Generate marketing and community assets from your book. Active agents use mock output
        until an API key is configured (Phase 5). Phase-2 agents are previewed below.
      </p>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {agentRegistry.map((agent) => (
          <AgentCard key={agent.id} agent={agent} />
        ))}
      </div>
    </DashboardPage>
  );
}
