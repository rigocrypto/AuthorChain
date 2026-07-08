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
      {/*
        Three zones: brand | nav (center) | actions.
        Full link row only from xl up so labels never collide with logo or auth.
        Below xl, MobileSiteNav owns all destinations.
      */}
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-3 px-3 sm:gap-4 sm:px-4">
        <div className="shrink-0">
          <Logo
            imgClassName="h-9 w-9 sm:h-10 sm:w-10"
            textClassName="text-base sm:text-lg max-[420px]:hidden"
          />
        </div>

        <nav
          className="hidden min-w-0 flex-1 items-center justify-center gap-1 xl:flex"
          aria-label={dict.nav.menu}
        >
          {marketingNav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="shrink-0 whitespace-nowrap rounded-lg px-2.5 py-2 text-sm leading-none text-muted transition-colors hover:bg-surface-2 hover:text-foreground 2xl:px-3"
            >
              {item.key ? dict.nav[item.key] : item.label}
            </Link>
          ))}
        </nav>

        {/* Grow so actions stay right when the center nav is hidden */}
        <div className="min-w-0 flex-1 xl:hidden" aria-hidden />

        <div className="flex shrink-0 items-center gap-1.5 sm:gap-2">
          <LanguageSwitcher />
          <div className="hidden items-center gap-1.5 xl:flex">
            <LandingUserMenu compact />
          </div>
          <MobileSiteNav />
        </div>
      </div>
    </header>
  );
}
