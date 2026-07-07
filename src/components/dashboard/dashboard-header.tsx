import { UserMenu } from "@/components/auth/user-menu";
import { MobileDashboardNav } from "@/components/dashboard/mobile-dashboard-nav";
import { LanguageSwitcher } from "@/components/language-switcher";

export function DashboardHeader({
  title,
  authorName,
  email,
  walletAddress,
}: {
  title: string;
  authorName: string;
  email?: string | null;
  walletAddress?: string | null;
}) {
  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between gap-3 border-b border-border bg-background/80 px-4 backdrop-blur sm:px-6">
      <div className="flex min-w-0 items-center gap-2">
        <MobileDashboardNav />
        <h1 className="truncate text-lg font-semibold">{title}</h1>
      </div>
      <div className="flex items-center gap-2">
        <LanguageSwitcher className="hidden md:block" />
        <UserMenu
          name={authorName}
          email={email}
          walletAddress={walletAddress}
          role="Author"
        />
      </div>
    </header>
  );
}
