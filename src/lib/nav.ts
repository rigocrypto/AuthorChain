/** Navigation config shared by the marketing header and dashboard sidebar. */
export type NavItem = {
  label: string;
  href: string;
  /** Phase-2 destinations are shown but disabled in the sidebar. */
  soon?: boolean;
};

/** Top navbar on public/marketing pages. */
export const marketingNav: NavItem[] = [
  { label: "How it works", href: "/#how-it-works" },
  { label: "AI Agents", href: "/#agents" },
  { label: "For Readers", href: "/#readers" },
];

/** Left sidebar inside the author dashboard. */
export const dashboardNav: NavItem[] = [
  { label: "Dashboard", href: "/dashboard" },
  { label: "My Books", href: "/dashboard/books" },
  { label: "Upload", href: "/dashboard/upload" },
  { label: "AI Agents", href: "/dashboard/agents" },
  { label: "Sales", href: "/dashboard/sales" },
  { label: "Analytics", href: "/dashboard/analytics", soon: true },
  { label: "Community", href: "/dashboard/community", soon: true },
  { label: "Royalties", href: "/dashboard/royalties", soon: true },
  { label: "Settings", href: "/dashboard/settings", soon: true },
];
