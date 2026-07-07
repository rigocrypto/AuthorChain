"use client";

import { createContext, useContext, type ReactNode } from "react";
import type { Locale } from "./config";
import type { Dictionary } from "./locales/en";

type I18nValue = { locale: Locale; dict: Dictionary };

const I18nContext = createContext<I18nValue | null>(null);

/**
 * Makes the server-loaded locale + dictionary available to client components.
 * The active dictionary (only one locale) is passed down from the root layout,
 * so the client bundle never ships all languages.
 */
export function I18nProvider({
  value,
  children,
}: {
  value: I18nValue;
  children: ReactNode;
}) {
  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n(): I18nValue {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error("useI18n must be used within <I18nProvider>");
  return ctx;
}
