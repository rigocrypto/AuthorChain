import { redirect } from "next/navigation";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { getPrivyUser } from "@/lib/auth/privy";

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
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1">{children}</main>
      <SiteFooter />
    </div>
  );
}
