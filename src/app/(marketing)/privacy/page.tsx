import type { Metadata } from "next";
import { LegalDocView } from "@/components/legal-doc-view";
import { getDictionary } from "@/i18n/get-dictionary";
import { getLegalDoc } from "@/i18n/legal";
import { legalChrome } from "@/lib/legal-page-helpers";

export async function generateMetadata(): Promise<Metadata> {
  const { dict } = await getDictionary();
  return {
    title: dict.legal.privacyTitle,
    description: dict.legal.privacyDesc,
    alternates: { canonical: "/privacy" },
  };
}

export default async function PrivacyPage() {
  const { locale, dict } = await getDictionary();
  const chrome = legalChrome(dict);
  return (
    <LegalDocView
      title={dict.legal.privacyTitle}
      description={dict.legal.privacyDesc}
      updated={chrome.updated}
      lastUpdatedLabel={chrome.lastUpdatedLabel}
      legalLabel={chrome.legalLabel}
      doc={getLegalDoc(locale, "privacy")}
      policyLinkLabels={chrome.policyLinkLabels}
    />
  );
}
