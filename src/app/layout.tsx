import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers";
import { siteConfig, siteUrl } from "@/lib/seo";
import { dir } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";
import { I18nProvider } from "@/i18n/provider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Public, non-secret token from Google Search Console. Configured per
// environment via Vercel (never hardcoded); the verification meta tag is only
// emitted when it is set.
const googleSiteVerification = process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION;

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "AuthorChain — AI-powered Web3 publishing for authors",
    template: "%s | AuthorChain",
  },
  description: siteConfig.description,
  applicationName: siteConfig.name,
  keywords: siteConfig.keywords,
  authors: [{ name: siteConfig.name, url: siteUrl }],
  creator: siteConfig.name,
  publisher: siteConfig.name,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    siteName: siteConfig.name,
    title: "AuthorChain — AI-powered Web3 publishing for authors",
    description: siteConfig.description,
    url: siteUrl,
    locale: "en_US",
  },
  twitter: {
    card: siteConfig.twitterCard,
    title: "AuthorChain — AI-powered Web3 publishing for authors",
    description: siteConfig.description,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
  // Renders <meta name="google-site-verification" …> only when configured.
  verification: googleSiteVerification ? { google: googleSiteVerification } : undefined,
};

export const viewport: Viewport = {
  themeColor: "#7c5cff",
  colorScheme: "dark",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { locale, dict } = await getDictionary();

  return (
    <html
      lang={locale}
      dir={dir(locale)}
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full">
        <I18nProvider value={{ locale, dict }}>
          <Providers>{children}</Providers>
        </I18nProvider>
      </body>
    </html>
  );
}
