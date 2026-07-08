import type { Metadata } from "next";
import Link from "next/link";
import { LegalPage, LegalSection, LegalList } from "@/components/legal-page";
import { getDictionary } from "@/i18n/get-dictionary";
import { siteContact } from "@/lib/site-contact";

export async function generateMetadata(): Promise<Metadata> {
  const { dict } = await getDictionary();
  return {
    title: dict.legal.privacyTitle,
    description: dict.legal.privacyDesc,
    alternates: { canonical: "/privacy" },
  };
}

export default async function PrivacyPage() {
  const { dict } = await getDictionary();
  return (
    <LegalPage
      title={dict.legal.privacyTitle}
      description={dict.legal.privacyDesc}
      updated={dict.legal.updated}
    >
      <LegalSection title="1. Who we are">
        <p>
          AuthorChain (“we”, “us”) operates the AuthorChain publishing platform
          and the ReaderChain reader experience. Contact:{" "}
          <a className="text-foreground underline-offset-2 hover:underline" href={`mailto:${siteContact.email}`}>
            {siteContact.email}
          </a>
          . See also our{" "}
          <Link className="text-foreground underline-offset-2 hover:underline" href="/contact">
            contact page
          </Link>
          .
        </p>
      </LegalSection>

      <LegalSection id="data-protection" title="2. Data we collect">
        <p>Depending on how you use the service, we may process:</p>
        <LegalList
          items={[
            "Account data (email, wallet address, display name, authentication identifiers from our identity provider).",
            "Publishing data (book metadata, covers, manuscripts, previews, pricing, ISBNs, and related assets you upload).",
            "Transaction data (purchases, refunds where applicable, and payment processor references — not full card numbers).",
            "Technical data (IP address, device/browser type, approximate location derived from IP, logs, and security signals).",
            "Support communications you send us.",
          ]}
        />
      </LegalSection>

      <LegalSection title="3. How we use data">
        <LegalList
          items={[
            "Provide, secure, and improve AuthorChain and ReaderChain.",
            "Authenticate users, prevent abuse, and malware-scan uploads before storage.",
            "Process sales, deliver purchased books to the reader library, and support authors.",
            "Register on-chain authorship proofs when you request them (public blockchain networks may store hashes and related transaction data permanently).",
            "Comply with law and respond to lawful requests.",
          ]}
        />
      </LegalSection>

      <LegalSection title="4. Legal bases (where GDPR/UK GDPR applies)">
        <p>
          We process personal data where necessary to perform a contract with
          you, for our legitimate interests (security, product improvement,
          fraud prevention), with consent where required (certain cookies or
          marketing), and to meet legal obligations.
        </p>
      </LegalSection>

      <LegalSection title="5. Sharing">
        <p>
          We use processors such as hosting, storage, authentication, payment,
          email, and analytics providers under contractual safeguards. We do not
          sell personal information. We may disclose data if required by law or
          to protect rights, safety, and the integrity of the platform.
        </p>
      </LegalSection>

      <LegalSection title="6. International transfers">
        <p>
          Our infrastructure and vendors may process data in the United States
          and other countries. Where required, we use appropriate transfer
          mechanisms (such as standard contractual clauses).
        </p>
      </LegalSection>

      <LegalSection title="7. Retention">
        <p>
          We retain account and publishing data while your account is active and
          as needed for legal, tax, security, and dispute purposes. On-chain
          records are public and cannot be erased by us.
        </p>
      </LegalSection>

      <LegalSection title="8. Your rights">
        <p>
          Depending on your location, you may have rights to access, correct,
          delete, restrict, or port personal data, and to object to certain
          processing or withdraw consent. Contact us to exercise rights. You may
          also lodge a complaint with a supervisory authority.
        </p>
      </LegalSection>

      <LegalSection title="9. Children">
        <p>
          The service is not directed to children under 16 (or the higher age
          required in your region). We do not knowingly collect their data.
        </p>
      </LegalSection>

      <LegalSection title="10. Changes">
        <p>
          We may update this policy. Material changes will be reflected by the
          “Last updated” date and, where appropriate, additional notice.
        </p>
      </LegalSection>
    </LegalPage>
  );
}
