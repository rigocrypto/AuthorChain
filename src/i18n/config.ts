/**
 * i18n configuration. Phase 1: cookie-based locale (no URL prefixes) so existing
 * URLs, referral links, and Stripe redirects stay stable. Only UI copy is
 * translated — author-entered book content is never machine-translated.
 */

export const locales = ["en", "es", "fr", "it", "pt", "de", "ru", "ar-AE"] as const;

export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "en";

/** Cookie that stores the reader's chosen locale (public, non-secret). */
export const LOCALE_COOKIE = "authorchain_locale";

/** Right-to-left locales. */
const rtlLocales: readonly Locale[] = ["ar-AE"];

/** Native display names for the language switcher. */
export const localeNames: Record<Locale, string> = {
  en: "English",
  es: "Español",
  fr: "Français",
  it: "Italiano",
  pt: "Português",
  de: "Deutsch",
  ru: "Русский",
  "ar-AE": "العربية",
};

/** Short label shown on the compact switcher trigger. */
export const localeShort: Record<Locale, string> = {
  en: "EN",
  es: "ES",
  fr: "FR",
  it: "IT",
  pt: "PT",
  de: "DE",
  ru: "RU",
  "ar-AE": "ع",
};

export function isLocale(value: string | undefined | null): value is Locale {
  return typeof value === "string" && (locales as readonly string[]).includes(value);
}

export function dir(locale: Locale): "rtl" | "ltr" {
  return rtlLocales.includes(locale) ? "rtl" : "ltr";
}
