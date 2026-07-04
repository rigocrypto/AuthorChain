"use client";

import { Suspense, useEffect } from "react";
import { usePrivy } from "@privy-io/react-auth";
import { useRouter, useSearchParams } from "next/navigation";
import { PageShell } from "@/components/page-header";
import { Card, CardTitle, CardDescription } from "@/components/ui/card";
import { Button, ButtonLink } from "@/components/ui/button";

function shortAddress(a?: string | null): string | null {
  if (!a) return null;
  return a.length > 12 ? `${a.slice(0, 6)}…${a.slice(-4)}` : a;
}

function LoginInner() {
  const { ready, authenticated, login, logout, user } = usePrivy();
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
        <CardTitle>Loading…</CardTitle>
      </Card>
    );
  }

  if (authenticated) {
    if (redirectParam) {
      return (
        <Card className="mx-auto mt-10 max-w-md text-center">
          <CardTitle>Signing you in…</CardTitle>
        </Card>
      );
    }
    // Manually visited /login while already signed in.
    const email = user?.email?.address ?? null;
    const addr = shortAddress(user?.wallet?.address ?? null);
    return (
      <Card className="mx-auto mt-10 max-w-md text-center">
        <CardTitle>You are already signed in</CardTitle>
        <CardDescription>
          {email ? <span className="block">{email}</span> : null}
          {addr ? (
            <span className="mt-1 block font-mono text-xs">{addr}</span>
          ) : null}
        </CardDescription>
        <div className="mt-6 flex flex-col gap-2">
          <ButtonLink href="/dashboard">Go to author dashboard →</ButtonLink>
          <ButtonLink href="/reader/library" variant="secondary">
            Go to reader library →
          </ButtonLink>
          <Button
            variant="ghost"
            onClick={async () => {
              await logout();
              router.refresh();
            }}
          >
            Sign out
          </Button>
        </div>
      </Card>
    );
  }

  return (
    <Card className="mx-auto mt-10 max-w-md text-center">
      <CardTitle>Sign in to AuthorChain</CardTitle>
      <CardDescription>
        Log in with your email — no crypto wallet required. Buyers should use the
        same email they purchased with. A secure wallet is created for you
        automatically.
      </CardDescription>
      <div className="mt-6">
        <Button onClick={() => login()} className="w-full">
          Continue with email
        </Button>
      </div>
    </Card>
  );
}

export default function LoginPage() {
  const configured = Boolean(process.env.NEXT_PUBLIC_PRIVY_APP_ID);

  return (
    <PageShell>
      {configured ? (
        <Suspense fallback={null}>
          <LoginInner />
        </Suspense>
      ) : (
        <Card className="mx-auto mt-10 max-w-md text-center">
          <CardTitle>Sign-in not configured</CardTitle>
          <CardDescription>
            Authentication isn&apos;t set up in this environment. Set
            <code> NEXT_PUBLIC_PRIVY_APP_ID</code> and <code>PRIVY_APP_SECRET</code>
            to enable login.
          </CardDescription>
          <div className="mt-6">
            <ButtonLink href="/">Back to home</ButtonLink>
          </div>
        </Card>
      )}
    </PageShell>
  );
}
