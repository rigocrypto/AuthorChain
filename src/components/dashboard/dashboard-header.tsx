export function DashboardHeader({
  title,
  authorName,
}: {
  title: string;
  authorName: string;
}) {
  const initials = authorName
    .split(" ")
    .map((p) => p[0])
    .join("");

  return (
    <header className="flex h-16 items-center justify-between border-b border-border bg-background/80 px-6 backdrop-blur">
      <h1 className="text-lg font-semibold">{title}</h1>

      <div className="flex items-center gap-4">
        <span className="hidden text-xs text-muted sm:inline">
          Mock session — auth lands in Phase 3
        </span>
        <div className="flex items-center gap-2">
          <span className="grid h-8 w-8 place-items-center rounded-full bg-gradient-to-br from-primary to-accent text-xs font-bold text-white">
            {initials}
          </span>
          <div className="hidden leading-tight sm:block">
            <div className="text-sm font-medium">{authorName}</div>
            <div className="text-xs text-muted">Author</div>
          </div>
        </div>
      </div>
    </header>
  );
}
