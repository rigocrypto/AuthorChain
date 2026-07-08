import Link from "next/link";
import { marketingNav } from "@/lib/nav";
import { Logo } from "@/components/logo";
import { LandingUserMenu } from "@/components/auth/landing-user-menu";
import { LanguageSwitcher } from "@/components/language-switcher";
import { MobileSiteNav } from "@/components/mobile-site-nav";
import { getDictionary } from "@/i18n/get-dictionary";

export async function SiteHeader() {
  const { dict } = await getDictionary();

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/80 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-2 px-4">
        <div className="min-w-0 shrink">
          <Logo
            imgClassName="h-9 w-9 sm:h-11 sm:w-11"
            textClassName="text-lg sm:text-xl max-[360px]:hidden"
          />
        </div>

        {/* Desktop / large tablet: full nav. Hidden below lg so labels never clip. */}
        <nav
          className="hidden items-center gap-0.5 lg:flex"
          aria-label={dict.nav.menu}
        >
          {marketingNav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-lg px-2.5 py-2 text-sm text-muted transition-colors hover:text-foreground xl:px-3"
            >
              {item.key ? dict.nav[item.key] : item.label}
            </Link>
          ))}
        </nav>

        <div className="flex shrink-0 items-center gap-1.5 sm:gap-2">
          <LanguageSwitcher />
          <div className="hidden items-center gap-2 lg:flex">
            <LandingUserMenu />
          </div>
          <MobileSiteNav />
        </div>
      </div>
    </header>
  );
}
