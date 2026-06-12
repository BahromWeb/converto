"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { locales, defaultLocale, type Locale } from "./locales";
import { translations, type TranslationMap } from "./translations";

interface I18nContextValue {
  locale: string;
  localeData: Locale;
  setLocale: (code: string) => void;
  t: TranslationMap;
}

const I18nContext = createContext<I18nContextValue | null>(null);

const STORAGE_KEY = "convertpdfgo-locale";

export function LanguageProvider({
  children,
  initialLocale = defaultLocale,
}: {
  children: React.ReactNode;
  /** Locale resolved from the URL on the server, so SSR text matches the
   *  first client render (no hydration mismatch). The URL is now the source
   *  of truth for language; localStorage is only a return-visit hint that
   *  middleware reads at the bare "/" entry point. */
  initialLocale?: string;
}) {
  const [locale, setLocaleState] = useState<string>(initialLocale);

  // Re-sync whenever the route's locale changes (client navigation between
  // /merge and /uz/merge re-renders this provider with a new initialLocale).
  useEffect(() => {
    setLocaleState(initialLocale);
    const localeData = locales.find((l) => l.code === initialLocale);
    if (localeData) {
      document.documentElement.lang = initialLocale;
      document.documentElement.dir = localeData.dir;
    }
    try {
      localStorage.setItem(STORAGE_KEY, initialLocale);
    } catch {
      /* private mode — ignore */
    }
  }, [initialLocale]);

  // Kept for the language switcher's optimistic UI; the actual language
  // change is a URL navigation handled by the switcher itself.
  function applyLocale(code: string) {
    const localeData = locales.find((l) => l.code === code);
    if (!localeData || !translations[code]) return;
    setLocaleState(code);
  }

  const localeData = locales.find((l) => l.code === locale) ?? locales[0]!;
  const t = (translations[locale] ?? translations[defaultLocale]) as TranslationMap;

  return (
    <I18nContext.Provider value={{ locale, localeData, setLocale: applyLocale, t }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error("useI18n must be used inside <LanguageProvider>");
  return ctx;
}

export function useT() {
  return useI18n().t;
}
