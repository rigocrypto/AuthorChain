"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { dashboardNav } from "@/lib/nav";
import { Logo } from "@/components/logo";

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden w-60 shrink-0 flex-col border-r border-border bg-surface md:flex">
      <div className="flex h-16 flex-col justify-center border-b border-border px-5">
        <Logo href="/dashboard" />
        <span className="mt-0.5 text-[11px] uppercase tracking-wide text-muted">
          AuthorChain Studio
        </span>
      </div>

      <nav className="flex-1 space-y-1 p-3">
        {dashboardNav.map((item) => {
          const active =
            pathname === item.href ||
            (item.href !== "/dashboard" && pathname.startsWith(`${item.href}/`));

          if (item.soon) {
            return (
              <span
                key={item.href}
                className="flex cursor-default items-center justify-between rounded-lg px-3 py-2 text-sm text-muted/60"
                title="Coming soon"
              >
                {item.label}
                <span className="rounded bg-surface-2 px-1.5 py-0.5 text-[10px] uppercase tracking-wide text-muted">
                  Soon
                </span>
              </span>
            );
          }

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`block rounded-lg px-3 py-2 text-sm transition-colors ${
                active
                  ? "bg-surface-2 text-foreground"
                  : "text-muted hover:bg-surface-2 hover:text-foreground"
              }`}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-border p-3 text-xs text-muted">
        <Link href="/" className="hover:text-foreground">
          ← Back to site
        </Link>
      </div>
    </aside>
  );
}
