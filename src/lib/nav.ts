import type { Dictionary } from "@/i18n/locales/en";

/** Navigation config shared by the marketing header and dashboard sidebar. */
export type NavKey = keyof Dictionary["nav"];

export type NavItem = {
  label: string;
  href: string;
  /** i18n key into `dict.nav`. When set, the label is translated; otherwise the
   *  English `label` is used (e.g. for phase-2 "Soon" placeholders). */
  key?: NavKey;
  /** Phase-2 destinations are shown but disabled in the sidebar. */
  soon?: boolean;
};

/** Top navbar on public/marketing pages. */
export const marketingNav: NavItem[] = [
  { label: "ReaderChain", href: "/explore", key: "readerchain" },
  { label: "Reader Library", href: "/reader/library", key: "readerLibrary" },
  { label: "AuthorChain Studio", href: "/dashboard", key: "studio" },
  { label: "Proof of Authorship", href: "/#proof", key: "proof" },
];

/** Left sidebar inside AuthorChain Studio (the author dashboard). */
export const dashboardNav: NavItem[] = [
  { label: "Dashboard", href: "/dashboard", key: "dashboard" },
  { label: "Books", href: "/dashboard/books", key: "books" },
  { label: "Upload", href: "/dashboard/upload", key: "upload" },
  { label: "AI Tools", href: "/dashboard/agents", key: "aiTools" },
  { label: "Sales", href: "/dashboard/sales", key: "sales" },
  { label: "Proofs", href: "/dashboard/proofs", soon: true },
  { label: "Royalties", href: "/dashboard/royalties", soon: true },
  { label: "Audience Analytics", href: "/dashboard/audience", soon: true },
  { label: "Revenue Analytics", href: "/dashboard/revenue", soon: true },
  { label: "Community", href: "/dashboard/community", soon: true },
  { label: "Settings", href: "/dashboard/settings", soon: true },
];
