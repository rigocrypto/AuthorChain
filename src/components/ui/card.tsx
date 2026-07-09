import type { ReactNode } from "react";

const interactiveClasses =
  "cursor-pointer transition-all duration-200 ease-out " +
  "hover:-translate-y-0.5 hover:border-primary/50 hover:bg-surface-2 " +
  "hover:shadow-[0_16px_40px_-18px_rgba(124,92,255,0.55)] " +
  "focus-within:border-primary/50 focus-within:ring-2 focus-within:ring-primary/30";

export function Card({
  children,
  className = "",
  interactive = false,
}: {
  children: ReactNode;
  className?: string;
  /** Lift + border glow on hover (dashboard tiles, clickable surfaces). */
  interactive?: boolean;
}) {
  return (
    <div
      className={`rounded-xl border border-border bg-surface p-6 ${
        interactive ? interactiveClasses : ""
      } ${className}`}
    >
      {children}
    </div>
  );
}

export function CardTitle({
  children,
  as = "h3",
}: {
  children: ReactNode;
  /** Use `div` for decorative labels that should not inflate heading counts. */
  as?: "h3" | "div";
}) {
  const Tag = as;
  return (
    <Tag className="text-base font-semibold text-foreground">{children}</Tag>
  );
}

export function CardDescription({ children }: { children: ReactNode }) {
  return <p className="mt-1 text-sm text-muted">{children}</p>;
}
