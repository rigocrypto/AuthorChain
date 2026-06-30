import type { ReactNode } from "react";

type Tone = "success" | "warning" | "muted" | "accent";

const tones: Record<Tone, string> = {
  success: "bg-success/15 text-success",
  warning: "bg-warning/15 text-warning",
  muted: "bg-surface-2 text-muted",
  accent: "bg-accent/15 text-accent",
};

export function StatusBadge({
  tone = "muted",
  children,
}: {
  tone?: Tone;
  children: ReactNode;
}) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${tones[tone]}`}
    >
      {children}
    </span>
  );
}

/** Maps a book status to a badge tone + label. */
export function BookStatusBadge({ status }: { status: string }) {
  if (status === "PUBLISHED") return <StatusBadge tone="success">Published</StatusBadge>;
  if (status === "DRAFT") return <StatusBadge tone="warning">Draft</StatusBadge>;
  return <StatusBadge tone="muted">Archived</StatusBadge>;
}
