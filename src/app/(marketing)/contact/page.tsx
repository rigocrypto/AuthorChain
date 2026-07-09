import type { Metadata } from "next";
import { LegalDocView } from "@/components/legal-doc-view";
import { LegalSection } from "@/components/legal-page";
import { getDictionary } from "@/i18n/get-dictionary";
import { getLegalDoc } from "@/i18n/legal";
import { legalChrome } from "@/lib/legal-page-helpers";
import { siteContact } from "@/lib/site-contact";
import { absoluteUrl } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  const { dict } = await getDictionary();
  return {
    title: dict.legal.contactTitle,
    description: dict.legal.contactDesc,
    alternates: { canonical: absoluteUrl("/contact") },
  };
}

export default async function ContactPage() {
  const { locale, dict } = await getDictionary();
  const chrome = legalChrome(dict);
  const social = (
    Object.entries(siteContact.social) as [string, string | null][]
  ).filter((e): e is [string, string] => Boolean(e[1]));

  const socialExtra =
    social.length > 0 || siteContact.discordHandle ? (
      <LegalSection title={dict.legal.socialTitle}>
        <ul className="space-y-2">
          {social.map(([key, href]) => (
            <li key={key}>
              <a
                className="text-foreground underline-offset-2 hover:underline"
                href={href}
                target="_blank"
                rel="noopener noreferrer"
              >
                {key === "x"
                  ? "X (Twitter)"
                  : key.charAt(0).toUpperCase() + key.slice(1)}
              </a>
            </li>
          ))}
          {siteContact.discordHandle && !siteContact.social.discord ? (
            <li className="text-muted">
              {dict.legal.discordLabel}:{" "}
              <span className="text-foreground">{siteContact.discordHandle}</span>
            </li>
          ) : null}
        </ul>
      </LegalSection>
    ) : null;

  return (
    <LegalDocView
      title={dict.legal.contactTitle}
      description={dict.legal.contactDesc}
      updated={chrome.updated}
      lastUpdatedLabel={chrome.lastUpdatedLabel}
      legalLabel={chrome.legalLabel}
      doc={getLegalDoc(locale, "contact")}
      policyLinkLabels={chrome.policyLinkLabels}
      extra={socialExtra}
    />
  );
}
