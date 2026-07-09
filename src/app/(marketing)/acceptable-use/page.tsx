import type { Metadata } from "next";
import { LegalDocView } from "@/components/legal-doc-view";
import { getDictionary } from "@/i18n/get-dictionary";
import { getLegalDoc } from "@/i18n/legal";
import { legalChrome } from "@/lib/legal-page-helpers";

export async function generateMetadata(): Promise<Metadata> {
  const { dict } = await getDictionary();
  return {
    title: dict.legal.acceptableUseTitle,
    description: dict.legal.acceptableUseDesc,
    alternates: { canonical: "/acceptable-use" },
  };
}

export default async function AcceptableUsePage() {
  const { locale, dict } = await getDictionary();
  const chrome = legalChrome(dict);
  return (
    <LegalDocView
      title={dict.legal.acceptableUseTitle}
      description={dict.legal.acceptableUseDesc}
      updated={chrome.updated}
      lastUpdatedLabel={chrome.lastUpdatedLabel}
      legalLabel={chrome.legalLabel}
      doc={getLegalDoc(locale, "acceptableUse")}
      policyLinkLabels={chrome.policyLinkLabels}
    />
  );
}
