import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { Sidebar } from "@/components/dashboard/sidebar";
import { getOptionalAuthor } from "@/lib/auth/session";
import { getPrivyUser } from "@/lib/auth/privy";

// Private author area — never index. Titles/files stay out of search results.
export const metadata: Metadata = { robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Author-only. Not signed in → login; signed in but not an author → reader area.
  const author = await getOptionalAuthor();
  if (!author) {
    const privy = await getPrivyUser();
    redirect(privy ? "/reader/library" : "/login?redirect=/dashboard");
  }

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex min-w-0 flex-1 flex-col">{children}</div>
    </div>
  );
}
