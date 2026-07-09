import type { Metadata } from "next";
import { LegalDocView } from "@/components/legal-doc-view";
import { getDictionary } from "@/i18n/get-dictionary";
import { getLegalDoc } from "@/i18n/legal";
import { legalChrome } from "@/lib/legal-page-helpers";

export async function generateMetadata(): Promise<Metadata> {
  const { dict } = await getDictionary();
  return {
    title: dict.legal.copyrightTitle,
    description: dict.legal.copyrightDesc,
    alternates: { canonical: "/copyright" },
  };
}

export default async function CopyrightPage() {
  const { locale, dict } = await getDictionary();
  const chrome = legalChrome(dict);
  return (
    <LegalDocView
      title={dict.legal.copyrightTitle}
      description={dict.legal.copyrightDesc}
      updated={chrome.updated}
      lastUpdatedLabel={chrome.lastUpdatedLabel}
      legalLabel={chrome.legalLabel}
      doc={getLegalDoc(locale, "copyright")}
      policyLinkLabels={chrome.policyLinkLabels}
    />
  );
}
