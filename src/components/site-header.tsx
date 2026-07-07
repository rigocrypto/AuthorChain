import Link from "next/link";
import { marketingNav } from "@/lib/nav";
import { Logo } from "@/components/logo";
import { LandingUserMenu } from "@/components/auth/landing-user-menu";
import { LanguageSwitcher } from "@/components/language-switcher";
import { getDictionary } from "@/i18n/get-dictionary";

export async function SiteHeader() {
  const { dict } = await getDictionary();

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/80 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
        <Logo imgClassName="h-11 w-11" textClassName="text-xl" />

        <nav className="hidden items-center gap-1 md:flex">
          {marketingNav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-lg px-3 py-2 text-sm text-muted transition-colors hover:text-foreground"
            >
              {item.key ? dict.nav[item.key] : item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <LanguageSwitcher />
          <LandingUserMenu />
        </div>
      </div>
    </header>
  );
}
