"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { usePrivy } from "@privy-io/react-auth";
import { marketingNav } from "@/lib/nav";
import { Logo } from "@/components/logo";
import { LanguageSwitcher } from "@/components/language-switcher";
import { Button, ButtonLink } from "@/components/ui/button";
import { useI18n } from "@/i18n/provider";

/**
 * Mobile/tablet site navigation. Desktop nav is `lg+`; below that the header
 * only shows logo + language + this hamburger so labels never clip off-screen.
 * Drawer is portalled to <body> so sticky header backdrop-filter cannot clamp it.
 */
function NavInner({ onClose }: { onClose: () => void }) {
  const pathname = usePathname();
  const { dict } = useI18n();
  const privyConfigured = Boolean(process.env.NEXT_PUBLIC_PRIVY_APP_ID);
  const privy = usePrivy();
  // Hooks must run unconditionally; ignore privy state when not configured.
  const ready = privyConfigured ? privy.ready : true;
  const authenticated = privyConfigured ? privy.authenticated : false;

  const isActive = (href: string) => {
    if (href.startsWith("/#")) return pathname === "/";
    if (href === "/") return pathname === "/";
    return pathname === href || pathname.startsWith(`${href}/`);
  };

  return (
    <>
      <nav className="flex-1 space-y-1 overflow-y-auto p-3">
        {marketingNav.map((item) => {
          const label = item.key ? dict.nav[item.key] : item.label;
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onClose}
              aria-current={isActive(item.href) ? "page" : undefined}
              className={`block rounded-lg px-3 py-3 text-sm transition-colors ${
                isActive(item.href)
                  ? "bg-surface-2 text-foreground"
                  : "text-muted hover:bg-surface-2 hover:text-foreground"
              }`}
            >
              {label}
            </Link>
          );
        })}
      </nav>

      <div className="space-y-3 border-t border-border p-3">
        <LanguageSwitcher className="w-full [&_button]:w-full [&_button]:justify-center" />

        {!privyConfigured ? (
          <ButtonLink href="/dashboard" variant="primary" className="w-full">
            {dict.common.openApp}
          </ButtonLink>
        ) : !ready ? (
          <ButtonLink href="/dashboard" variant="primary" className="w-full">
            {dict.common.openApp}
          </ButtonLink>
        ) : authenticated ? (
          <div className="flex flex-col gap-2">
            <ButtonLink href="/dashboard" variant="primary" className="w-full">
              {dict.nav.dashboard}
            </ButtonLink>
            <ButtonLink href="/reader/library" variant="secondary" className="w-full">
              {dict.nav.readerLibrary}
            </ButtonLink>
            <Button
              variant="ghost"
              className="w-full"
              onClick={async () => {
                await privy.logout();
                onClose();
              }}
            >
              {dict.common.logout}
            </Button>
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            <ButtonLink href="/login" variant="ghost" className="w-full">
              {dict.common.login}
            </ButtonLink>
            <ButtonLink
              href="/login?redirect=/dashboard"
              variant="primary"
              className="w-full"
            >
              {dict.common.startPublishing}
            </ButtonLink>
          </div>
        )}
      </div>
    </>
  );
}

/** Same as NavInner but without calling usePrivy when Privy is not configured. */
function NavWithoutPrivy({ onClose }: { onClose: () => void }) {
  const pathname = usePathname();
  const { dict } = useI18n();

  const isActive = (href: string) => {
    if (href.startsWith("/#")) return pathname === "/";
    if (href === "/") return pathname === "/";
    return pathname === href || pathname.startsWith(`${href}/`);
  };

  return (
    <>
      <nav className="flex-1 space-y-1 overflow-y-auto p-3">
        {marketingNav.map((item) => {
          const label = item.key ? dict.nav[item.key] : item.label;
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onClose}
              aria-current={isActive(item.href) ? "page" : undefined}
              className={`block rounded-lg px-3 py-3 text-sm transition-colors ${
                isActive(item.href)
                  ? "bg-surface-2 text-foreground"
                  : "text-muted hover:bg-surface-2 hover:text-foreground"
              }`}
            >
              {label}
            </Link>
          );
        })}
      </nav>
      <div className="space-y-3 border-t border-border p-3">
        <LanguageSwitcher className="w-full [&_button]:w-full [&_button]:justify-center" />
        <ButtonLink href="/dashboard" variant="primary" className="w-full">
          {dict.common.openApp}
        </ButtonLink>
      </div>
    </>
  );
}

export function MobileSiteNav() {
  const { dict } = useI18n();
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const privyConfigured = Boolean(process.env.NEXT_PUBLIC_PRIVY_APP_ID);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

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

  const close = () => setOpen(false);

  const drawer = (
    <div className="xl:hidden" aria-hidden={!open} inert={!open}>
      <button
        type="button"
        tabIndex={-1}
        aria-label={dict.nav.closeMenu}
        onClick={close}
        className={`fixed inset-0 z-40 bg-black/60 backdrop-blur-sm transition-opacity duration-200 ${
          open ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      />

      <div
        id="mobile-site-drawer"
        role="dialog"
        aria-modal="true"
        aria-label={dict.nav.menu}
        className={`fixed inset-y-0 end-0 z-50 flex w-80 max-w-[88%] flex-col border-s border-border bg-surface/95 backdrop-blur transition-transform duration-200 ease-out ${
          open
            ? "translate-x-0"
            : "translate-x-full rtl:-translate-x-full"
        }`}
      >
        <div className="flex h-16 items-center justify-between border-b border-border px-4">
          <Logo href="/" imgClassName="h-9 w-9" textClassName="text-lg" />
          <button
            ref={closeRef}
            type="button"
            onClick={close}
            aria-label={dict.nav.closeMenu}
            className="grid h-10 w-10 shrink-0 place-items-center rounded-lg text-muted transition-colors hover:bg-surface-2 hover:text-foreground"
          >
            <svg
              aria-hidden="true"
              viewBox="0 0 24 24"
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            >
              <path d="M6 6l12 12M18 6L6 18" />
            </svg>
          </button>
        </div>

        {privyConfigured ? (
          <NavInner onClose={close} />
        ) : (
          <NavWithoutPrivy onClose={close} />
        )}
      </div>
    </div>
  );

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setOpen(true)}
        aria-label={dict.nav.openMenu}
        aria-expanded={open}
        aria-controls="mobile-site-drawer"
        className="grid h-10 w-10 shrink-0 place-items-center rounded-lg border border-border text-foreground transition-colors hover:bg-surface-2 xl:hidden"
      >
        <svg
          aria-hidden="true"
          viewBox="0 0 24 24"
          className="h-5 w-5"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        >
          <path d="M3 6h18M3 12h18M3 18h18" />
        </svg>
      </button>

      {mounted ? createPortal(drawer, document.body) : null}
    </>
  );
}
