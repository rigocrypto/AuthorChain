export function SiteFooter() {
  return (
    <footer className="border-t border-border">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-2 px-4 py-8 text-sm text-muted sm:flex-row">
        <p>© {new Date().getFullYear()} AuthorChain — creator-first Web3 publishing.</p>
        <p>AI tools · Instant payments · On-chain proof of authorship</p>
      </div>
    </footer>
  );
}
