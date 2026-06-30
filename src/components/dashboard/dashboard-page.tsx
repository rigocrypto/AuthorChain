import type { ReactNode } from "react";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";

/** Wraps a dashboard page with the top header bar + padded content area. */
export function DashboardPage({
  title,
  actions,
  children,
}: {
  title: string;
  actions?: ReactNode;
  children: ReactNode;
}) {
  return (
    <>
      <DashboardHeader title={title} />
      <div className="flex-1 overflow-y-auto p-6">
        {actions ? <div className="mb-6 flex justify-end gap-2">{actions}</div> : null}
        {children}
      </div>
    </>
  );
}
