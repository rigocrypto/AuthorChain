import type { ReactNode } from "react";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { getCurrentAuthor } from "@/lib/auth/session";

/** Wraps a dashboard page with the top header bar + padded content area. */
export async function DashboardPage({
  title,
  actions,
  children,
}: {
  title: string;
  actions?: ReactNode;
  children: ReactNode;
}) {
  const author = await getCurrentAuthor();

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <DashboardHeader
        title={title}
        authorName={author.name}
        email={author.email}
        walletAddress={author.walletAddress}
      />
      <div className="flex-1 p-4 sm:p-6">
        {actions ? (
          <div className="mb-6 flex flex-wrap justify-end gap-2">{actions}</div>
        ) : null}
        {children}
      </div>
    </div>
  );
}
