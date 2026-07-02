"use client";

import { usePrivy } from "@privy-io/react-auth";
import { useRouter } from "next/navigation";

/**
 * Sign-out control. Only rendered inside authenticated (Privy-configured) areas
 * such as the dashboard and reader library, so usePrivy always has a provider.
 */
export function SignOutButton({ className = "" }: { className?: string }) {
  const { logout, authenticated } = usePrivy();
  const router = useRouter();
  if (!authenticated) return null;

  return (
    <button
      type="button"
      onClick={async () => {
        await logout();
        router.replace("/");
      }}
      className={`text-sm text-muted transition-colors hover:text-foreground ${className}`}
    >
      Sign out
    </button>
  );
}
