import type { Locale } from "./config";
import en, { type Dictionary } from "./locales/en";
import es from "./locales/es";
import fr from "./locales/fr";
import it from "./locales/it";
import pt from "./locales/pt";
import de from "./locales/de";
import ru from "./locales/ru";
import arAE from "./locales/ar-AE";

export const dictionaries: Record<Locale, Dictionary> = {
  en,
  es,
  fr,
  it,
  pt,
  de,
  ru,
  "ar-AE": arAE,
};

export type { Dictionary };
