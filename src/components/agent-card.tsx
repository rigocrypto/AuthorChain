import { Card, CardTitle, CardDescription } from "@/components/ui/card";
import { StatusBadge } from "@/components/ui/status-badge";

/** Display-only agent card (landing + Phase-2 previews). */
export function AgentCard({
  name,
  description,
  badge,
}: {
  name: string;
  description: string;
  badge?: "Active" | "Phase 2";
}) {
  return (
    <Card>
      <div className="flex items-start justify-between gap-2">
        <CardTitle>{name}</CardTitle>
        {badge ? (
          <StatusBadge tone={badge === "Active" ? "success" : "accent"}>
            {badge}
          </StatusBadge>
        ) : null}
      </div>
      <CardDescription>{description}</CardDescription>
    </Card>
  );
}
