"use client";

import { Suspense, useEffect } from "react";
import { usePrivy } from "@privy-io/react-auth";
import { useRouter, useSearchParams } from "next/navigation";
import { PageShell } from "@/components/page-header";
import { Card, CardTitle, CardDescription } from "@/components/ui/card";
import { Button, ButtonLink } from "@/components/ui/button";
import { useI18n } from "@/i18n/provider";

function shortAddress(a?: string | null): string | null {
  if (!a) return null;
  return a.length > 12 ? `${a.slice(0, 6)}…${a.slice(-4)}` : a;
}

function LoginInner() {
  const { ready, authenticated, login, logout, user } = usePrivy();
  const { dict } = useI18n();
  const router = useRouter();
  const params = useSearchParams();
  const redirectParam = params.get("redirect");

  // Fresh login flow: if a guard sent the user here, return them afterwards.
  useEffect(() => {
    if (ready && authenticated && redirectParam) router.replace(redirectParam);
  }, [ready, authenticated, redirectParam, router]);

  if (!ready) {
    return (
      <Card className="mx-auto mt-10 max-w-md text-center">
        <CardTitle>{dict.login.loading}</CardTitle>
      </Card>
    );
  }

  if (authenticated) {
    if (redirectParam) {
      return (
        <Card className="mx-auto mt-10 max-w-md text-center">
          <CardTitle>{dict.login.signingIn}</CardTitle>
        </Card>
      );
    }
    // Manually visited /login while already signed in.
    const email = user?.email?.address ?? null;
    const addr = shortAddress(user?.wallet?.address ?? null);
    return (
      <Card className="mx-auto mt-10 max-w-md text-center">
        <CardTitle>{dict.login.alreadyTitle}</CardTitle>
        <CardDescription>
          {email ? <span className="block">{email}</span> : null}
          {addr ? (
            <span className="mt-1 block font-mono text-xs">{addr}</span>
          ) : null}
        </CardDescription>
        <div className="mt-6 flex flex-col gap-2">
          <ButtonLink href="/dashboard">{dict.login.goDashboard}</ButtonLink>
          <ButtonLink href="/reader/library" variant="secondary">
            {dict.login.goLibrary}
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
      </Card>
    );
  }

  return (
    <Card className="mx-auto mt-10 max-w-md text-center">
      <CardTitle>{dict.login.signInTitle}</CardTitle>
      <CardDescription>{dict.login.signInDesc}</CardDescription>
      <div className="mt-6">
        <Button onClick={() => login()} className="w-full">
          {dict.login.continueEmail}
        </Button>
      </div>
    </Card>
  );
}

export default function LoginPage() {
  const { dict } = useI18n();
  const configured = Boolean(process.env.NEXT_PUBLIC_PRIVY_APP_ID);

  return (
    <PageShell>
      {configured ? (
        <Suspense fallback={null}>
          <LoginInner />
        </Suspense>
      ) : (
        <Card className="mx-auto mt-10 max-w-md text-center">
          <CardTitle>{dict.login.notConfiguredTitle}</CardTitle>
          <CardDescription>{dict.login.notConfiguredDesc}</CardDescription>
          <div className="mt-6">
            <ButtonLink href="/">{dict.login.backHome}</ButtonLink>
          </div>
        </Card>
      )}
    </PageShell>
  );
}
