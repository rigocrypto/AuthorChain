import type { Metadata } from "next";
import Link from "next/link";
import { LegalPage, LegalSection, LegalList } from "@/components/legal-page";
import { getDictionary } from "@/i18n/get-dictionary";

export async function generateMetadata(): Promise<Metadata> {
  const { dict } = await getDictionary();
  return {
    title: dict.legal.cookiesTitle,
    description: dict.legal.cookiesDesc,
    alternates: { canonical: "/cookies" },
  };
}

export default async function CookiesPage() {
  const { dict } = await getDictionary();
  return (
    <LegalPage
      title={dict.legal.cookiesTitle}
      description={dict.legal.cookiesDesc}
      updated={dict.legal.updated}
    >
      <LegalSection title="1. What cookies are">
        <p>
          Cookies and similar technologies (local storage, pixels) help sites
          remember preferences, keep you signed in, and understand usage.
        </p>
      </LegalSection>

      <LegalSection title="2. How we use them">
        <LegalList
          items={[
            "Essential: authentication sessions (e.g. Privy), security, load balancing, and core app function.",
            "Preferences: language selection and similar UI choices.",
            "Analytics (if enabled): aggregate traffic and product improvement — never used to sell personal data.",
            "Payments: processors may set their own cookies when you complete checkout.",
          ]}
        />
      </LegalSection>

      <LegalSection title="3. Your choices">
        <p>
          You can control cookies in your browser settings. Blocking essential
          cookies may prevent sign-in or purchases. Where required by law we will
          request consent for non-essential cookies.
        </p>
      </LegalSection>

      <LegalSection title="4. More information">
        <p>
          See our{" "}
          <Link className="text-foreground underline-offset-2 hover:underline" href="/privacy">
            Privacy Policy
          </Link>{" "}
          for broader data practices, or{" "}
          <Link className="text-foreground underline-offset-2 hover:underline" href="/contact">
            contact us
          </Link>
          .
        </p>
      </LegalSection>
    </LegalPage>
  );
}
