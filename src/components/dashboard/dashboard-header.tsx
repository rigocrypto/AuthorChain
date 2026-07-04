import { UserMenu } from "@/components/auth/user-menu";

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
    <header className="flex h-16 items-center justify-between border-b border-border bg-background/80 px-6 backdrop-blur">
      <h1 className="text-lg font-semibold">{title}</h1>
      <UserMenu
        name={authorName}
        email={email}
        walletAddress={walletAddress}
        role="Author"
      />
    </header>
  );
}
