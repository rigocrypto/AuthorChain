import type { Metadata } from "next";
import Link from "next/link";
import { LegalPage, LegalSection, LegalList } from "@/components/legal-page";
import { getDictionary } from "@/i18n/get-dictionary";
import { siteContact } from "@/lib/site-contact";

export async function generateMetadata(): Promise<Metadata> {
  const { dict } = await getDictionary();
  return {
    title: dict.legal.copyrightTitle,
    description: dict.legal.copyrightDesc,
    alternates: { canonical: "/copyright" },
  };
}

export default async function CopyrightPage() {
  const { dict } = await getDictionary();
  return (
    <LegalPage
      title={dict.legal.copyrightTitle}
      description={dict.legal.copyrightDesc}
      updated={dict.legal.updated}
    >
      <LegalSection title="1. Respect for intellectual property">
        <p>
          Authors must only upload and sell works they own or are licensed to
          distribute. Infringing content is prohibited. See also our{" "}
          <Link className="text-foreground underline-offset-2 hover:underline" href="/acceptable-use">
            Acceptable Use
          </Link>{" "}
          policy.
        </p>
      </LegalSection>

      <LegalSection title="2. On-chain proof is not copyright registration">
        <p>
          AuthorChain’s proof-of-authorship feature records a technical hash of a
          manuscript (and related transaction metadata) on a public blockchain.
          It is not a filing with a government copyright office, not legal advice,
          and not a guarantee of enforceability in any jurisdiction.
        </p>
      </LegalSection>

      <LegalSection title="3. Reporting infringement (DMCA-style notice)">
        <p>
          If you believe content on AuthorChain infringes your copyright, send a
          notice to{" "}
          <a className="text-foreground underline-offset-2 hover:underline" href={`mailto:${siteContact.email}`}>
            {siteContact.email}
          </a>{" "}
          including:
        </p>
        <LegalList
          items={[
            "Your contact name, address, phone, and email.",
            "Identification of the copyrighted work claimed to be infringed.",
            "The URL or exact location of the allegedly infringing material on AuthorChain.",
            "A statement that you have a good-faith belief the use is not authorized.",
            "A statement, under penalty of perjury, that the information is accurate and that you are the owner or authorized to act.",
            "Your physical or electronic signature.",
          ]}
        />
        <p>
          We may remove or disable access to material and notify the uploader. We
          may terminate repeat infringers where appropriate.
        </p>
      </LegalSection>

      <LegalSection title="4. Counter-notice">
        <p>
          If your material was removed and you believe it was a mistake or
          misidentification, you may send a counter-notice to the same address
          with the information required under applicable law (including
          consent to jurisdiction of an appropriate court).
        </p>
      </LegalSection>

      <LegalSection title="5. Trademarks">
        <p>
          AuthorChain and ReaderChain names and logos are our marks. Do not use
          them in a way that confuses users about affiliation or endorsement.
        </p>
      </LegalSection>
    </LegalPage>
  );
}
