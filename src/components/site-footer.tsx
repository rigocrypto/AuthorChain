import Link from "next/link";
import { Logo } from "@/components/logo";
import { getDictionary } from "@/i18n/get-dictionary";
import { siteContact, type SocialKey } from "@/lib/site-contact";

const productLinks = [
  { href: "/explore", key: "explore" as const },
  { href: "/reader/library", key: "library" as const },
  { href: "/dashboard", key: "studio" as const },
  { href: "/#proof", key: "proof" as const },
];

const legalLinks = [
  { href: "/privacy", key: "privacy" as const },
  { href: "/terms", key: "terms" as const },
  { href: "/cookies", key: "cookies" as const },
  { href: "/copyright", key: "copyright" as const },
  { href: "/acceptable-use", key: "acceptableUse" as const },
];

const trustLinks = [
  { href: "/security", key: "securityPolicy" as const },
  { href: "/privacy#data-protection", key: "dataProtection" as const },
  { href: "/security#uploads", key: "uploadScanning" as const },
  { href: "/terms#disclaimers", key: "disclaimers" as const },
];

const socialLabels: Record<SocialKey, string> = {
  github: "GitHub",
  x: "X (Twitter)",
  linkedin: "LinkedIn",
  discord: "Discord",
  youtube: "YouTube",
};

export async function SiteFooter() {
  const { dict } = await getDictionary();
  const t = dict.footer;
  const year = new Date().getFullYear();

  const socialEntries = (
    Object.entries(siteContact.social) as [SocialKey, string | null][]
  ).filter((entry): entry is [SocialKey, string] => Boolean(entry[1]));

  return (
    <footer className="mt-auto border-t border-border bg-surface/40">
      <div className="mx-auto max-w-6xl px-4 py-12">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div className="sm:col-span-2 lg:col-span-1">
            <Logo imgClassName="h-9 w-9" textClassName="text-lg" />
            <p className="mt-3 max-w-xs text-sm leading-relaxed text-muted">
              {t.tagline}
            </p>
            <p className="mt-3 max-w-sm text-xs leading-relaxed text-muted/90">
              {t.complianceNote}
            </p>
          </div>

          {/* Product */}
          <div>
            <h2 className="text-xs font-semibold uppercase tracking-wider text-foreground">
              {t.product}
            </h2>
            <ul className="mt-3 space-y-2 text-sm">
              {productLinks.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-muted transition-colors hover:text-foreground"
                  >
                    {t[item.key]}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h2 className="text-xs font-semibold uppercase tracking-wider text-foreground">
              {t.legal}
            </h2>
            <ul className="mt-3 space-y-2 text-sm">
              {legalLinks.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-muted transition-colors hover:text-foreground"
                  >
                    {t[item.key]}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Trust + contact */}
          <div>
            <h2 className="text-xs font-semibold uppercase tracking-wider text-foreground">
              {t.trust}
            </h2>
            <ul className="mt-3 space-y-2 text-sm">
              {trustLinks.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-muted transition-colors hover:text-foreground"
                  >
                    {t[item.key]}
                  </Link>
                </li>
              ))}
            </ul>

            <h2 className="mt-6 text-xs font-semibold uppercase tracking-wider text-foreground">
              {t.contact}
            </h2>
            <ul className="mt-3 space-y-2 text-sm">
              <li>
                <a
                  href={`mailto:${siteContact.email}`}
                  className="text-muted transition-colors hover:text-foreground"
                >
                  {siteContact.email}
                </a>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-muted transition-colors hover:text-foreground"
                >
                  {t.contactPage}
                </Link>
              </li>
              {siteContact.formUrl ? (
                <li>
                  <a
                    href={siteContact.formUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted transition-colors hover:text-foreground"
                  >
                    {t.supportForm}
                  </a>
                </li>
              ) : null}
            </ul>

            {socialEntries.length > 0 || siteContact.discordHandle ? (
              <>
                <h2 className="mt-6 text-xs font-semibold uppercase tracking-wider text-foreground">
                  {t.social}
                </h2>
                <ul className="mt-3 flex flex-wrap gap-x-4 gap-y-2 text-sm">
                  {socialEntries.map(([key, href]) => (
                    <li key={key}>
                      <a
                        href={href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-muted transition-colors hover:text-foreground"
                      >
                        {socialLabels[key]}
                      </a>
                    </li>
                  ))}
                  {siteContact.discordHandle && !siteContact.social.discord ? (
                    <li className="text-muted" title="Discord username">
                      Discord: {siteContact.discordHandle}
                    </li>
                  ) : null}
                </ul>
              </>
            ) : null}
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-3 border-t border-border pt-6 text-xs text-muted sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {year} AuthorChain. {t.rights}
          </p>
          <p className="max-w-xl sm:text-end">{t.malwareNote}</p>
        </div>
      </div>
    </footer>
  );
}
