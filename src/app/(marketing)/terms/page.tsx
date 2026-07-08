import type { Metadata } from "next";
import Link from "next/link";
import { LegalPage, LegalSection, LegalList } from "@/components/legal-page";
import { getDictionary } from "@/i18n/get-dictionary";
import { siteContact } from "@/lib/site-contact";

export async function generateMetadata(): Promise<Metadata> {
  const { dict } = await getDictionary();
  return {
    title: dict.legal.termsTitle,
    description: dict.legal.termsDesc,
    alternates: { canonical: "/terms" },
  };
}

export default async function TermsPage() {
  const { dict } = await getDictionary();
  return (
    <LegalPage
      title={dict.legal.termsTitle}
      description={dict.legal.termsDesc}
      updated={dict.legal.updated}
    >
      <LegalSection title="1. Agreement">
        <p>
          By accessing or using AuthorChain or ReaderChain you agree to these
          Terms and our{" "}
          <Link className="text-foreground underline-offset-2 hover:underline" href="/privacy">
            Privacy Policy
          </Link>
          ,{" "}
          <Link className="text-foreground underline-offset-2 hover:underline" href="/acceptable-use">
            Acceptable Use
          </Link>
          , and related policies. If you do not agree, do not use the service.
        </p>
      </LegalSection>

      <LegalSection title="2. The service">
        <p>
          AuthorChain provides tools for authors to upload, prepare, prove
          authorship of, and sell digital books. ReaderChain provides discovery,
          purchase, and library access for readers. Features may change, be
          limited by region, or require configuration (payments, chain, storage).
        </p>
      </LegalSection>

      <LegalSection title="3. Accounts">
        <LegalList
          items={[
            "You must provide accurate information and keep credentials secure.",
            "You are responsible for activity under your account.",
            "We may suspend or terminate accounts that violate these Terms or create security risk.",
          ]}
        />
      </LegalSection>

      <LegalSection title="4. Author content & licenses">
        <p>
          You retain ownership of manuscripts and materials you upload, subject
          to third-party rights. You grant AuthorChain a limited license to host,
          process, display, deliver, and promote your content as needed to
          operate the service (including malware scanning, format handling, and
          storefront display when published).
        </p>
        <p>
          You represent that you have all rights needed to publish and sell the
          content and that it does not infringe others’ rights or applicable law.
        </p>
      </LegalSection>

      <LegalSection title="5. On-chain proof">
        <p>
          Authorship proofs are technical records (for example a content hash
          registered on a public blockchain). They are not a government copyright
          registration, trademark filing, or legal title certificate. Blockchain
          transactions may be irreversible and public.
        </p>
      </LegalSection>

      <LegalSection title="6. Payments">
        <p>
          Prices are set by authors where the product allows. Payment processors
          (e.g. Stripe) handle card payments under their terms. Fees, taxes, and
          chargebacks may apply. Crypto payment options, when available, depend
          on network conditions and configuration.
        </p>
      </LegalSection>

      <LegalSection id="disclaimers" title="7. Disclaimers">
        <p>
          THE SERVICE IS PROVIDED “AS IS” AND “AS AVAILABLE”. TO THE MAXIMUM
          EXTENT PERMITTED BY LAW, WE DISCLAIM WARRANTIES OF MERCHANTABILITY,
          FITNESS FOR A PARTICULAR PURPOSE, AND NON-INFRINGEMENT. We do not
          guarantee uninterrupted availability, sales outcomes, AI output
          accuracy, or that on-chain proofs will be accepted by any third party
          or court.
        </p>
      </LegalSection>

      <LegalSection title="8. Limitation of liability">
        <p>
          TO THE MAXIMUM EXTENT PERMITTED BY LAW, AUTHORCHAIN AND ITS OPERATORS
          ARE NOT LIABLE FOR INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR
          PUNITIVE DAMAGES, OR LOST PROFITS, DATA, OR GOODWILL. OUR AGGREGATE
          LIABILITY FOR CLAIMS RELATING TO THE SERVICE IS LIMITED TO THE GREATER
          OF (A) AMOUNTS YOU PAID US FOR THE SERVICE IN THE 12 MONTHS BEFORE THE
          CLAIM OR (B) USD $100.
        </p>
      </LegalSection>

      <LegalSection title="9. Indemnity">
        <p>
          You will defend and indemnify AuthorChain against claims arising from
          your content, your use of the service, or your violation of these Terms
          or law.
        </p>
      </LegalSection>

      <LegalSection title="10. Changes & contact">
        <p>
          We may update these Terms. Continued use after changes constitutes
          acceptance. Questions:{" "}
          <a className="text-foreground underline-offset-2 hover:underline" href={`mailto:${siteContact.email}`}>
            {siteContact.email}
          </a>
          .
        </p>
      </LegalSection>
    </LegalPage>
  );
}
