/**
 * Phase 1 mock data. Mirrors the future Prisma models so swapping to a real
 * database (Phase 2) is a drop-in: keep these shapes, change the source.
 * No DB, no network — everything here is static.
 */

export type BookStatus = "DRAFT" | "PUBLISHED" | "ARCHIVED";

export type Book = {
  id: string;
  slug: string;
  title: string;
  subtitle?: string;
  description: string;
  category: string;
  language: string;
  price: number;
  currency: "USD";
  coverColor: string; // placeholder cover gradient until real covers exist
  status: BookStatus;
  rating: number;
  ratingCount: number;
  unitsSold: number;
  earningsUsdc: number;
  createdAt: string;
};

export type Sale = {
  id: string;
  bookTitle: string;
  buyer: string; // truncated wallet/email
  amount: number;
  currency: "USDC" | "USD";
  type: "Sale" | "Royalty";
  date: string;
};

export type AgentActivity = {
  agent: "Copy Agent" | "Launch Agent" | "Community Agent";
  summary: string;
  at: string;
};

export type Author = {
  id: string;
  name: string;
  email: string;
  role: string;
  walletAddress?: string;
  avatarUrl?: string;
};

export const mockAuthor: Author = {
  id: "author_rigo",
  name: "Rigo Vivas",
  email: "rigovivas71@gmail.com",
  role: "Author",
  walletAddress: "0x8a2c...7f3c",
};

export const mockBooks: Book[] = [
  {
    id: "book_quantum",
    slug: "the-quantum-prison",
    title: "The Quantum Prison",
    subtitle: "Escape is only the beginning",
    description:
      "A physicist wakes inside a simulation engineered by her own future self. To break free she must out-think the machine that knows her every move.",
    category: "Sci-Fi",
    language: "English",
    price: 9.99,
    currency: "USD",
    coverColor: "from-indigo-500 to-cyan-400",
    status: "PUBLISHED",
    rating: 4.8,
    ratingCount: 124,
    unitsSold: 632,
    earningsUsdc: 2568,
    createdAt: "2026-04-12",
  },
  {
    id: "book_mind",
    slug: "mind-of-the-future",
    title: "Mind of the Future",
    subtitle: "How tomorrow learns to think",
    description:
      "A grounded look at where artificial and human intelligence converge — and what creators should do about it now.",
    category: "Non-Fiction",
    language: "English",
    price: 9.99,
    currency: "USD",
    coverColor: "from-violet-500 to-fuchsia-400",
    status: "PUBLISHED",
    rating: 4.6,
    ratingCount: 88,
    unitsSold: 341,
    earningsUsdc: 1289,
    createdAt: "2026-03-02",
  },
  {
    id: "book_faith",
    slug: "faith-and-freedom",
    title: "Faith & Freedom",
    subtitle: "Essays on conviction",
    description:
      "A collection of essays on belief, liberty, and living deliberately in a noisy world.",
    category: "Essays",
    language: "English",
    price: 14.99,
    currency: "USD",
    coverColor: "from-amber-500 to-rose-400",
    status: "PUBLISHED",
    rating: 4.7,
    ratingCount: 51,
    unitsSold: 198,
    earningsUsdc: 1633,
    createdAt: "2026-02-18",
  },
  {
    id: "book_playbook",
    slug: "the-ultimate-ai-playbook",
    title: "The Ultimate AI Playbook",
    subtitle: "Ship faster with AI",
    description:
      "Practical patterns for building with AI agents, from prototype to production.",
    category: "Technology",
    language: "English",
    price: 19.0,
    currency: "USD",
    coverColor: "from-emerald-500 to-teal-400",
    status: "DRAFT",
    rating: 0,
    ratingCount: 0,
    unitsSold: 77,
    earningsUsdc: 1463,
    createdAt: "2026-05-20",
  },
];

export const dashboardStats = [
  { label: "Total Sales", value: "$12,540", change: "+18.6%" },
  { label: "Earnings (USDC)", value: "3,256.75", change: "+22.4%" },
  { label: "Books Sold", value: "1,248", change: "+15.3%" },
  { label: "Active Readers", value: "842", change: "+27.1%" },
];

export const mockSales: Sale[] = [
  { id: "s1", bookTitle: "The Quantum Prison", buyer: "0x8a2c...7f3c", amount: 12.0, currency: "USDC", type: "Sale", date: "2026-05-29" },
  { id: "s2", bookTitle: "Mind of the Future", buyer: "0x3b1f...9a7e", amount: 9.99, currency: "USDC", type: "Sale", date: "2026-05-29" },
  { id: "s3", bookTitle: "Faith & Freedom", buyer: "0x7c4a...2b1d", amount: 14.99, currency: "USDC", type: "Sale", date: "2026-05-29" },
  { id: "s4", bookTitle: "The Ultimate AI Playbook", buyer: "0x6d77...e8a1", amount: 19.0, currency: "USDC", type: "Sale", date: "2026-05-28" },
];

export const royaltyStats = [
  { label: "Gross sales", value: "$12,540.00" },
  { label: "Royalties earned", value: "3,256.75 USDC" },
  { label: "Pending payouts", value: "412.00 USDC" },
];

export const agentActivity: AgentActivity[] = [
  { agent: "Copy Agent", summary: "Generated 5 new posts", at: "2h ago" },
  { agent: "Launch Agent", summary: "Updated launch plan", at: "5h ago" },
  { agent: "Community Agent", summary: "Answered 23 reader questions", at: "1d ago" },
];

export function getBookBySlug(slug: string): Book | undefined {
  return mockBooks.find((b) => b.slug === slug);
}

/** Top-selling published book, for the dashboard "Top Book" card. */
export function getTopBook(): Book {
  return [...mockBooks]
    .filter((b) => b.status === "PUBLISHED")
    .sort((a, b) => b.unitsSold - a.unitsSold)[0];
}
