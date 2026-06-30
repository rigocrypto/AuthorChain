import type { Agent } from "@/lib/ai/agents";
import { Card, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/ui/status-badge";

export function AgentCard({ agent }: { agent: Agent }) {
  return (
    <Card className="flex flex-col">
      <div className="flex items-start justify-between gap-2">
        <CardTitle>{agent.name}</CardTitle>
        {agent.comingSoon ? (
          <StatusBadge tone="accent">Phase 2</StatusBadge>
        ) : (
          <StatusBadge tone="success">Active</StatusBadge>
        )}
      </div>
      <CardDescription>{agent.description}</CardDescription>

      <ul className="mt-3 flex-1 space-y-1 text-sm text-muted">
        {agent.outputs.map((o) => (
          <li key={o}>• {o}</li>
        ))}
      </ul>

      <div className="mt-4">
        {/* TODO Phase 5: POST /api/agents/[id] for a selected book. */}
        <Button variant="secondary" disabled className="w-full">
          {agent.comingSoon ? "Coming soon" : "Run agent"}
        </Button>
      </div>
    </Card>
  );
}
