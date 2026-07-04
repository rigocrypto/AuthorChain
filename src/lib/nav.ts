/** Navigation config shared by the marketing header and dashboard sidebar. */
export type NavItem = {
  label: string;
  href: string;
  /** Phase-2 destinations are shown but disabled in the sidebar. */
  soon?: boolean;
};

/** Top navbar on public/marketing pages. */
export const marketingNav: NavItem[] = [
  { label: "ReaderChain", href: "/explore" },
  { label: "Reader Library", href: "/reader/library" },
  { label: "AuthorChain Studio", href: "/dashboard" },
  { label: "Proof of Authorship", href: "/#proof" },
];

/** Left sidebar inside AuthorChain Studio (the author dashboard). */
export const dashboardNav: NavItem[] = [
  { label: "Dashboard", href: "/dashboard" },
  { label: "Books", href: "/dashboard/books" },
  { label: "Upload", href: "/dashboard/upload" },
  { label: "AI Tools", href: "/dashboard/agents" },
  { label: "Sales", href: "/dashboard/sales" },
  { label: "Proofs", href: "/dashboard/proofs", soon: true },
  { label: "Royalties", href: "/dashboard/royalties", soon: true },
  { label: "Audience Analytics", href: "/dashboard/audience", soon: true },
  { label: "Revenue Analytics", href: "/dashboard/revenue", soon: true },
  { label: "Community", href: "/dashboard/community", soon: true },
  { label: "Settings", href: "/dashboard/settings", soon: true },
];
