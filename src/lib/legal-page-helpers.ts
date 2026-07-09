import type { Dictionary } from "@/i18n/locales/en";
import { defaultPolicyLinks } from "@/components/legal-doc-view";

/** Shared chrome + policy link labels for all legal pages. */
export function legalChrome(dict: Dictionary) {
  return {
    lastUpdatedLabel: dict.legal.lastUpdatedLabel,
    legalLabel: dict.legal.legalLabel,
    updated: dict.legal.updated,
    policyLinkLabels: defaultPolicyLinks({
      privacy: dict.footer.privacy,
      terms: dict.footer.terms,
      cookies: dict.footer.cookies,
      security: dict.footer.securityPolicy,
      acceptableUse: dict.footer.acceptableUse,
    }),
  };
}
