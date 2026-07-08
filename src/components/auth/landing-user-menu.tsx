"use client";

import { usePrivy } from "@privy-io/react-auth";
import { useRouter } from "next/navigation";
import { Button, ButtonLink } from "@/components/ui/button";
import { useI18n } from "@/i18n/provider";

function shortAddress(a?: string | null): string | null {
  if (!a) return null;
  return a.length > 12 ? `${a.slice(0, 6)}…${a.slice(-4)}` : a;
}

function Inner() {
  const { ready, authenticated, logout, user } = usePrivy();
  const router = useRouter();
  const { dict } = useI18n();

  // Before Privy resolves, show a neutral CTA (the dashboard guard handles auth).
  if (!ready) {
    return (
      <ButtonLink href="/dashboard" variant="primary">
        {dict.common.openApp}
      </ButtonLink>
    );
  }

  if (!authenticated) {
    return (
      <>
        <ButtonLink href="/login" variant="ghost">
          {dict.common.login}
        </ButtonLink>
        <ButtonLink href="/login?redirect=/dashboard" variant="primary">
          {dict.common.startPublishing}
        </ButtonLink>
      </>
    );
  }

  const email = user?.email?.address ?? null;
  const addr = shortAddress(user?.wallet?.address ?? null);

  return (
    <div className="flex items-center gap-2">
      {email || addr ? (
        <div className="hidden rounded-lg border border-border bg-surface px-3 py-1.5 text-right leading-tight xl:block">
          {email ? <div className="text-xs text-foreground">{email}</div> : null}
          {addr ? (
            <div className="font-mono text-[11px] text-muted">{addr}</div>
          ) : null}
        </div>
      ) : null}
      <ButtonLink href="/dashboard" variant="primary">
        {dict.nav.dashboard}
      </ButtonLink>
      <ButtonLink href="/reader/library" variant="secondary">
        {dict.nav.readerLibrary}
      </ButtonLink>
      <Button
        variant="ghost"
        onClick={async () => {
          await logout();
          router.refresh();
        }}
      >
        {dict.common.logout}
      </Button>
    </div>
  );
}

/**
 * Auth-aware navbar controls for the public/marketing header. Falls back to a
 * plain "Open App" link when Privy isn't configured (so usePrivy is only called
 * inside a PrivyProvider). Desktop-only in the header shell; mobile uses the
 * hamburger drawer (MobileSiteNav).
 */
export function LandingUserMenu() {
  const { dict } = useI18n();
  if (!process.env.NEXT_PUBLIC_PRIVY_APP_ID) {
    return (
      <ButtonLink href="/dashboard" variant="primary">
        {dict.common.openApp}
      </ButtonLink>
    );
  }
  return <Inner />;
}
