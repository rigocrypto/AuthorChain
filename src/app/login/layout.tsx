import type { Metadata } from "next";
import { absoluteUrl } from "@/lib/seo";
import { getDictionary } from "@/i18n/get-dictionary";

// Auth entry point — kept out of the search index.
// Site header + footer come from the root layout.
export async function generateMetadata(): Promise<Metadata> {
  const { dict } = await getDictionary();
  return {
    title: dict.login.metaTitle,
    description: dict.login.metaDescription,
    alternates: { canonical: absoluteUrl("/login") },
    robots: { index: false, follow: false },
    openGraph: {
      title: dict.login.metaTitle,
      description: dict.login.metaDescription,
      url: absoluteUrl("/login"),
    },
  };
}

export default function LoginLayout({ children }: { children: React.ReactNode }) {
  return <main className="flex-1">{children}</main>;
}
