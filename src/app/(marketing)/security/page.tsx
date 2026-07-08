import type { Metadata } from "next";
import Link from "next/link";
import { LegalPage, LegalSection, LegalList } from "@/components/legal-page";
import { getDictionary } from "@/i18n/get-dictionary";
import { siteContact } from "@/lib/site-contact";

export async function generateMetadata(): Promise<Metadata> {
  const { dict } = await getDictionary();
  return {
    title: dict.legal.securityTitle,
    description: dict.legal.securityDesc,
    alternates: { canonical: "/security" },
  };
}

export default async function SecurityPage() {
  const { dict } = await getDictionary();
  return (
    <LegalPage
      title={dict.legal.securityTitle}
      description={dict.legal.securityDesc}
      updated={dict.legal.updated}
    >
      <LegalSection title="1. Our posture">
        <p>
          AuthorChain is built with a defense-in-depth approach: least-privilege
          access, fail-closed security defaults for uploads, and careful
          separation of public marketing surfaces from private author and reader
          areas.
        </p>
      </LegalSection>

      <LegalSection id="uploads" title="2. Upload scanning">
        <LegalList
          items={[
            "Manuscripts, covers, and previews are scanned for malware before durable storage when scanning is configured.",
            "Infected or unscannable files are rejected with safe user-facing messages — no raw scanner output, internal paths, storage keys, or signed URLs are shown in the UI.",
            "If the scanner is unavailable, new uploads fail closed rather than storing unchecked files.",
          ]}
        />
      </LegalSection>

      <LegalSection title="3. Access control">
        <LegalList
          items={[
            "Author Studio and reader library routes require authentication.",
            "Book assets and downloads are authorized per user and purchase entitlement.",
            "Dashboard and private APIs are excluded from search indexing.",
          ]}
        />
      </LegalSection>

      <LegalSection title="4. Payments & secrets">
        <p>
          Card payments are handled by Stripe (or similar processors). Secrets
          and tokens live in environment configuration — never in client bundles
          or public pages. Webhooks verify signatures before updating state.
        </p>
      </LegalSection>

      <LegalSection title="5. Blockchain proofs">
        <p>
          On-chain authorship records use content hashes. They provide public
          verifiability of a manuscript fingerprint; they do not replace secure
          private storage of full files.
        </p>
      </LegalSection>

      <LegalSection title="6. Responsible disclosure">
        <p>
          If you believe you found a vulnerability, email{" "}
          <a className="text-foreground underline-offset-2 hover:underline" href={`mailto:${siteContact.email}`}>
            {siteContact.email}
          </a>{" "}
          with a clear description. Please avoid privacy-invasive testing,
          social engineering, or disruption of production systems.
        </p>
      </LegalSection>

      <LegalSection title="7. Related policies">
        <p>
          <Link className="text-foreground underline-offset-2 hover:underline" href="/privacy">
            Privacy
          </Link>
          {" · "}
          <Link className="text-foreground underline-offset-2 hover:underline" href="/terms">
            Terms
          </Link>
          {" · "}
          <Link className="text-foreground underline-offset-2 hover:underline" href="/acceptable-use">
            Acceptable use
          </Link>
        </p>
      </LegalSection>
    </LegalPage>
  );
}
