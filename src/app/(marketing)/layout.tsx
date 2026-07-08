export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Site header + footer live in the root layout so they appear on every page.
  return <main className="flex-1">{children}</main>;
}
