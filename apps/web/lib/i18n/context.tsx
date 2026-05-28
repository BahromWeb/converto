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

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<string>(defaultLocale);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved && translations[saved]) {
      applyLocale(saved);
    }
  }, []);

  function applyLocale(code: string) {
    const localeData = locales.find((l) => l.code === code);
    if (!localeData || !translations[code]) return;

    setLocaleState(code);
    localStorage.setItem(STORAGE_KEY, code);

    document.documentElement.lang = code;
    document.documentElement.dir = localeData.dir;
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
