"use client";

import { Suspense, useEffect } from "react";
import { usePrivy } from "@privy-io/react-auth";
import { useRouter, useSearchParams } from "next/navigation";
import { PageShell } from "@/components/page-header";
import { Card, CardTitle, CardDescription } from "@/components/ui/card";
import { Button, ButtonLink } from "@/components/ui/button";

function LoginInner() {
  const { ready, authenticated, login } = usePrivy();
  const router = useRouter();
  const params = useSearchParams();
  const redirect = params.get("redirect") || "/reader/library";

  useEffect(() => {
    if (ready && authenticated) router.replace(redirect);
  }, [ready, authenticated, redirect, router]);

  return (
    <Card className="mx-auto mt-10 max-w-md text-center">
      <CardTitle>Sign in to AuthorChain</CardTitle>
      <CardDescription>
        Log in with your email — no crypto wallet required. Buyers should use the
        same email they purchased with. A secure wallet is created for you
        automatically.
      </CardDescription>
      <div className="mt-6">
        <Button onClick={() => login()} disabled={!ready} className="w-full">
          {ready ? "Continue with email" : "Loading…"}
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
