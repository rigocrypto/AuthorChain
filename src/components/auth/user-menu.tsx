import { StatusBadge } from "@/components/ui/status-badge";
import { SignOutButton } from "@/components/sign-out-button";

/** Compact wallet address, e.g. 0x1234…abcd. */
function shortAddress(a?: string | null): string | null {
  if (!a) return null;
  return a.length > 12 ? `${a.slice(0, 6)}…${a.slice(-4)}` : a;
}

function initials(name?: string | null, email?: string | null): string {
  if (name) {
    return name
      .split(" ")
      .map((p) => p[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();
  }
  return (email ?? "?").slice(0, 2).toUpperCase();
}

/**
 * Authenticated user profile + sign-out. Presentational (server-renderable);
 * the sign-out control is the only client piece. Reused in the dashboard header
 * and the reader area.
 */
export function UserMenu({
  name,
  email,
  walletAddress,
  role,
}: {
  name?: string | null;
  email?: string | null;
  walletAddress?: string | null;
  role: "Author" | "Reader";
}) {
  const addr = shortAddress(walletAddress);

  return (
    <div className="flex items-center gap-3 rounded-xl border border-border bg-surface px-3 py-1.5">
      <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-gradient-to-br from-primary to-accent text-xs font-bold text-white">
        {initials(name, email)}
      </span>
      <div className="hidden min-w-0 leading-tight sm:block">
        <div className="flex items-center gap-2">
          {name ? (
            <span className="truncate text-sm font-medium">{name}</span>
          ) : null}
          <StatusBadge tone="accent">{role}</StatusBadge>
        </div>
        {email ? (
          <div className="truncate text-xs text-muted">{email}</div>
        ) : null}
        {addr ? (
          <div className="font-mono text-[11px] text-muted">{addr}</div>
        ) : null}
      </div>
      <SignOutButton className="ml-1 whitespace-nowrap" />
    </div>
  );
}
