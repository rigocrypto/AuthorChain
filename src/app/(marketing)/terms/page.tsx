import type { Metadata } from "next";
import { LegalDocView } from "@/components/legal-doc-view";
import { getDictionary } from "@/i18n/get-dictionary";
import { getLegalDoc } from "@/i18n/legal";
import { legalChrome } from "@/lib/legal-page-helpers";

export async function generateMetadata(): Promise<Metadata> {
  const { dict } = await getDictionary();
  return {
    title: dict.legal.termsTitle,
    description: dict.legal.termsDesc,
    alternates: { canonical: "/terms" },
  };
}

export default async function TermsPage() {
  const { locale, dict } = await getDictionary();
  const chrome = legalChrome(dict);
  return (
    <LegalDocView
      title={dict.legal.termsTitle}
      description={dict.legal.termsDesc}
      updated={chrome.updated}
      lastUpdatedLabel={chrome.lastUpdatedLabel}
      legalLabel={chrome.legalLabel}
      doc={getLegalDoc(locale, "terms")}
      policyLinkLabels={chrome.policyLinkLabels}
    />
  );
}
