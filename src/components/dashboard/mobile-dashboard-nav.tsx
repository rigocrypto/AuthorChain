"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { dashboardNav } from "@/lib/nav";
import { Logo } from "@/components/logo";

/**
 * Mobile-only navigation for AuthorChain Studio. The desktop <Sidebar> is
 * hidden below `md`, so this renders a hamburger button in the dashboard header
 * that opens a slide-out drawer with the same nav links. Hidden on `md+`.
 */
export function MobileDashboardNav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  // While open: lock body scroll, close on Escape, focus the close button.
  // On close/unmount, restore scroll and return focus to the trigger. Nav-link
  // clicks close via their own onClick, and this component remounts per route.
  useEffect(() => {
    if (!open) return;
    const trigger = triggerRef.current;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
      trigger?.focus();
    };
  }, [open]);

  const isActive = (href: string) =>
    pathname === href || (href !== "/dashboard" && pathname.startsWith(`${href}/`));

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Open navigation menu"
        aria-expanded={open}
        aria-controls="mobile-dashboard-drawer"
        className="grid h-10 w-10 shrink-0 place-items-center rounded-lg border border-border text-foreground transition-colors hover:bg-surface-2 md:hidden"
      >
        <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <path d="M3 6h18M3 12h18M3 18h18" />
        </svg>
      </button>

      {/* Overlay + drawer. Kept mounted for smooth transitions; `inert` when
          closed removes it from tab order + assistive tech. Hidden on md+. */}
      <div className="md:hidden" aria-hidden={!open} inert={!open}>
        <button
          type="button"
          tabIndex={-1}
          aria-label="Close navigation menu"
          onClick={() => setOpen(false)}
          className={`fixed inset-0 z-40 bg-black/60 backdrop-blur-sm transition-opacity duration-200 ${
            open ? "opacity-100" : "pointer-events-none opacity-0"
          }`}
        />

        <div
          id="mobile-dashboard-drawer"
          role="dialog"
          aria-modal="true"
          aria-label="AuthorChain Studio navigation"
          className={`fixed inset-y-0 left-0 z-50 flex w-72 max-w-[85%] flex-col border-r border-border bg-surface/95 backdrop-blur transition-transform duration-200 ease-out ${
            open ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <div className="flex h-16 items-center justify-between border-b border-border px-4">
            <div className="flex flex-col justify-center">
              <Logo href="/dashboard" />
              <span className="mt-0.5 text-[11px] uppercase tracking-wide text-muted">
                AuthorChain Studio
              </span>
            </div>
            <button
              ref={closeRef}
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Close navigation menu"
              className="grid h-9 w-9 shrink-0 place-items-center rounded-lg text-muted transition-colors hover:bg-surface-2 hover:text-foreground"
            >
              <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <path d="M6 6l12 12M18 6L6 18" />
              </svg>
            </button>
          </div>

          <nav className="flex-1 space-y-1 overflow-y-auto p-3">
            {dashboardNav.map((item) =>
              item.soon ? (
                <span
                  key={item.href}
                  className="flex cursor-default items-center justify-between rounded-lg px-3 py-2.5 text-sm text-muted/60"
                  title="Coming soon"
                >
                  {item.label}
                  <span className="rounded bg-surface-2 px-1.5 py-0.5 text-[10px] uppercase tracking-wide text-muted">
                    Soon
                  </span>
                </span>
              ) : (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  aria-current={isActive(item.href) ? "page" : undefined}
                  className={`block rounded-lg px-3 py-2.5 text-sm transition-colors ${
                    isActive(item.href)
                      ? "bg-surface-2 text-foreground"
                      : "text-muted hover:bg-surface-2 hover:text-foreground"
                  }`}
                >
                  {item.label}
                </Link>
              ),
            )}
          </nav>

          <div className="border-t border-border p-3 text-sm text-muted">
            <Link
              href="/"
              onClick={() => setOpen(false)}
              className="block rounded-lg px-3 py-2.5 transition-colors hover:bg-surface-2 hover:text-foreground"
            >
              ← Back to site
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
