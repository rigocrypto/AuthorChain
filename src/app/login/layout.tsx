import type { Metadata } from "next";

// Auth entry point — basic metadata, kept out of the search index.
export const metadata: Metadata = {
  title: "Sign in",
  robots: { index: false, follow: false },
};

export default function LoginLayout({ children }: { children: React.ReactNode }) {
  return children;
}
