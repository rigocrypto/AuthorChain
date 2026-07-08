import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { UserMenu } from "@/components/auth/user-menu";
import { getPrivyUser } from "@/lib/auth/privy";

// Private reader library/reading area — never index.
// Site header + footer come from the root layout.
export const metadata: Metadata = { robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";

export default async function ReaderLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Require a signed-in user. (Signed in but no purchases → the library page
  // shows its own empty state; entitlement is enforced per-book/download.)
  const privy = await getPrivyUser();
  if (!privy) redirect("/login?redirect=/reader/library");

  return (
    <div className="flex flex-1 flex-col">
      <div className="border-b border-border bg-surface/40">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-2">
          <span className="text-xs uppercase tracking-wide text-muted">
            Reader area
          </span>
          <UserMenu
            email={privy.email}
            walletAddress={privy.walletAddress}
            role="Reader"
          />
        </div>
      </div>
      <main className="flex-1">{children}</main>
    </div>
  );
}
