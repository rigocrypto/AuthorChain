import type { Metadata } from "next";

// Auth entry point — basic metadata, kept out of the search index.
// Site header + footer come from the root layout.
export const metadata: Metadata = {
  title: "Sign in",
  robots: { index: false, follow: false },
};

export default function LoginLayout({ children }: { children: React.ReactNode }) {
  return <main className="flex-1">{children}</main>;
}
