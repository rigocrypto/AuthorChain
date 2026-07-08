import type { Metadata } from "next";
import Link from "next/link";
import { LegalPage, LegalSection } from "@/components/legal-page";
import { getDictionary } from "@/i18n/get-dictionary";
import { siteContact } from "@/lib/site-contact";

export async function generateMetadata(): Promise<Metadata> {
  const { dict } = await getDictionary();
  return {
    title: dict.legal.contactTitle,
    description: dict.legal.contactDesc,
    alternates: { canonical: "/contact" },
  };
}

export default async function ContactPage() {
  const { dict } = await getDictionary();
  const social = (
    Object.entries(siteContact.social) as [string, string | null][]
  ).filter((e): e is [string, string] => Boolean(e[1]));

  return (
    <LegalPage
      title={dict.legal.contactTitle}
      description={dict.legal.contactDesc}
      updated={dict.legal.updated}
    >
      <LegalSection title="Support & general inquiries">
        <p>
          Email{" "}
          <a
            className="text-foreground underline-offset-2 hover:underline"
            href={`mailto:${siteContact.email}`}
          >
            {siteContact.email}
          </a>
          . We aim to respond as soon as practical.
        </p>
        {siteContact.formUrl ? (
          <p>
            Or use our{" "}
            <a
              className="text-foreground underline-offset-2 hover:underline"
              href={siteContact.formUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              support form
            </a>
            .
          </p>
        ) : null}
      </LegalSection>

      <LegalSection title="Privacy, legal & copyright">
        <p>
          For privacy requests, legal notices, and copyright reports, use the
          same email and include enough detail for us to act (see{" "}
          <Link className="text-foreground underline-offset-2 hover:underline" href="/copyright">
            Copyright & DMCA
          </Link>
          ).
        </p>
      </LegalSection>

      <LegalSection title="Security reports">
        <p>
          Suspected vulnerabilities: email{" "}
          <a
            className="text-foreground underline-offset-2 hover:underline"
            href={`mailto:${siteContact.email}`}
          >
            {siteContact.email}
          </a>{" "}
          with “Security” in the subject. Details:{" "}
          <Link className="text-foreground underline-offset-2 hover:underline" href="/security">
            Security
          </Link>
          .
        </p>
      </LegalSection>

      {social.length > 0 || siteContact.discordHandle ? (
        <LegalSection title="Social">
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
                Discord: <span className="text-foreground">{siteContact.discordHandle}</span>
              </li>
            ) : null}
          </ul>
        </LegalSection>
      ) : null}

      <LegalSection title="Policies">
        <p className="flex flex-wrap gap-x-3 gap-y-1">
          <Link className="text-foreground underline-offset-2 hover:underline" href="/privacy">
            Privacy
          </Link>
          <Link className="text-foreground underline-offset-2 hover:underline" href="/terms">
            Terms
          </Link>
          <Link className="text-foreground underline-offset-2 hover:underline" href="/cookies">
            Cookies
          </Link>
          <Link className="text-foreground underline-offset-2 hover:underline" href="/security">
            Security
          </Link>
          <Link className="text-foreground underline-offset-2 hover:underline" href="/acceptable-use">
            Acceptable use
          </Link>
        </p>
      </LegalSection>
    </LegalPage>
  );
}
