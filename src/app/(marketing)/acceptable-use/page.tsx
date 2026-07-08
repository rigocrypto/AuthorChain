import type { Metadata } from "next";
import Link from "next/link";
import { LegalPage, LegalSection, LegalList } from "@/components/legal-page";
import { getDictionary } from "@/i18n/get-dictionary";

export async function generateMetadata(): Promise<Metadata> {
  const { dict } = await getDictionary();
  return {
    title: dict.legal.acceptableUseTitle,
    description: dict.legal.acceptableUseDesc,
    alternates: { canonical: "/acceptable-use" },
  };
}

export default async function AcceptableUsePage() {
  const { dict } = await getDictionary();
  return (
    <LegalPage
      title={dict.legal.acceptableUseTitle}
      description={dict.legal.acceptableUseDesc}
      updated={dict.legal.updated}
    >
      <LegalSection title="1. Purpose">
        <p>
          These rules keep AuthorChain and ReaderChain safe for authors,
          readers, and partners. Violations may lead to content removal, account
          suspension, or legal action.
        </p>
      </LegalSection>

      <LegalSection title="2. Prohibited content">
        <LegalList
          items={[
            "Malware, exploits, phishing kits, or files designed to harm systems or steal data.",
            "Infringing copyrighted works, trademark abuse, or unauthorized personal data dumps.",
            "Child sexual abuse material or any exploitation of minors.",
            "Terrorist content, credible threats of violence, or instructions for violent crime.",
            "Illegal goods/services facilitation, fraud schemes, or clear scams.",
            "Non-consensual intimate imagery or doxxing.",
            "Spam, deceptive metadata, or manipulative SEO/storefront practices.",
          ]}
        />
      </LegalSection>

      <LegalSection title="3. Prohibited conduct">
        <LegalList
          items={[
            "Attempting to bypass authentication, entitlement checks, or malware scanning.",
            "Scraping private libraries, bulk-harvesting personal data, or abusing APIs.",
            "Interfering with other users’ access or the integrity of proofs and sales records.",
            "Misrepresenting government affiliation, licenses, or copyright status.",
          ]}
        />
      </LegalSection>

      <LegalSection title="4. Publishing integrity">
        <p>
          Authors should accurately describe books, pricing, and rights. AI-assisted
          tools may help with marketing copy, but you remain responsible for
          accuracy and compliance with third-party store rules when you export
          elsewhere.
        </p>
      </LegalSection>

      <LegalSection title="5. Enforcement">
        <p>
          We may investigate reports, remove content, and cooperate with law
          enforcement when required. Questions: see{" "}
          <Link className="text-foreground underline-offset-2 hover:underline" href="/contact">
            Contact
          </Link>
          .
        </p>
      </LegalSection>
    </LegalPage>
  );
}
