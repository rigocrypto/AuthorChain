import { cookies } from "next/headers";
import { defaultLocale, isLocale, LOCALE_COOKIE, type Locale } from "./config";
import { dictionaries, type Dictionary } from "./dictionaries";

/**
 * Read the active locale from the cookie (server-side). `cookies()` is a
 * server-only API, so this helper can only run in Server Components / route
 * handlers. Falls back to English when unset or invalid.
 */
export async function getLocale(): Promise<Locale> {
  const store = await cookies();
  const value = store.get(LOCALE_COOKIE)?.value;
  return isLocale(value) ? value : defaultLocale;
}

export async function getDictionary(): Promise<{ locale: Locale; dict: Dictionary }> {
  const locale = await getLocale();
  return { locale, dict: dictionaries[locale] };
}
