import { MobileDashboardNav } from "@/components/dashboard/mobile-dashboard-nav";

/**
 * Studio page title bar. Auth (login info / sign out) lives only in the global
 * SiteHeader — this bar is just mobile studio nav + the page title.
 */
export function DashboardHeader({ title }: { title: string }) {
  return (
    <header className="sticky top-0 z-30 flex h-14 items-center gap-3 border-b border-border bg-background/80 px-4 backdrop-blur sm:px-6">
      <div className="flex min-w-0 items-center gap-2">
        <MobileDashboardNav />
        <h1 className="truncate text-lg font-semibold">{title}</h1>
      </div>
    </header>
  );
}
