import type { Locale } from "@/i18n/config";
import type { LegalBundle, LegalDocId } from "./types";
import en from "./en";
import es from "./es";
import de from "./de";
import fr from "./fr";
import it from "./it";
import pt from "./pt";
import ru from "./ru";
import arAE from "./ar-AE";

const bundles: Record<Locale, LegalBundle> = {
  en,
  es,
  de,
  fr,
  it,
  pt,
  ru,
  "ar-AE": arAE,
};

/** Resolve a full legal document body for the active locale (falls back to EN). */
export function getLegalDoc(locale: Locale, id: LegalDocId) {
  return bundles[locale]?.[id] ?? en[id];
}

export type { LegalBundle, LegalDocId, LegalDocContent, LegalBlock } from "./types";
