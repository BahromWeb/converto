export interface Locale {
  code: string;
  nativeName: string;
  flag: string;
  dir: "ltr" | "rtl";
}

export const locales: Locale[] = [
  { code: "en", nativeName: "English", flag: "🇺🇸", dir: "ltr" },
  { code: "uz", nativeName: "O'zbek", flag: "🇺🇿", dir: "ltr" },
  { code: "ru", nativeName: "Русский", flag: "🇷🇺", dir: "ltr" },
  { code: "es", nativeName: "Español", flag: "🇪🇸", dir: "ltr" },
  { code: "zh", nativeName: "中文", flag: "🇨🇳", dir: "ltr" },
  { code: "ar", nativeName: "العربية", flag: "🇸🇦", dir: "rtl" },
  { code: "hi", nativeName: "हिन्दी", flag: "🇮🇳", dir: "ltr" },
  { code: "pt", nativeName: "Português", flag: "🇧🇷", dir: "ltr" },
  { code: "de", nativeName: "Deutsch", flag: "🇩🇪", dir: "ltr" },
  { code: "fr", nativeName: "Français", flag: "🇫🇷", dir: "ltr" },
  { code: "ja", nativeName: "日本語", flag: "🇯🇵", dir: "ltr" },
  { code: "ko", nativeName: "한국어", flag: "🇰🇷", dir: "ltr" },
  { code: "tr", nativeName: "Türkçe", flag: "🇹🇷", dir: "ltr" },
  { code: "it", nativeName: "Italiano", flag: "🇮🇹", dir: "ltr" },
  { code: "id", nativeName: "Indonesia", flag: "🇮🇩", dir: "ltr" },
  { code: "pl", nativeName: "Polski", flag: "🇵🇱", dir: "ltr" },
  { code: "vi", nativeName: "Tiếng Việt", flag: "🇻🇳", dir: "ltr" },
  { code: "nl", nativeName: "Nederlands", flag: "🇳🇱", dir: "ltr" },
  { code: "th", nativeName: "ไทย", flag: "🇹🇭", dir: "ltr" },
  { code: "uk", nativeName: "Українська", flag: "🇺🇦", dir: "ltr" },
  { code: "zh-tw", nativeName: "中文（繁體）", flag: "🇹🇼", dir: "ltr" },
  { code: "bg", nativeName: "Български", flag: "🇧🇬", dir: "ltr" },
  { code: "ca", nativeName: "Català", flag: "🇦🇩", dir: "ltr" },
  { code: "el", nativeName: "Ελληνικά", flag: "🇬🇷", dir: "ltr" },
  { code: "ms", nativeName: "Bahasa Melayu", flag: "🇲🇾", dir: "ltr" },
  { code: "sv", nativeName: "Svenska", flag: "🇸🇪", dir: "ltr" },
  { code: "sw", nativeName: "Kiswahili", flag: "🇹🇿", dir: "ltr" },
];

export const defaultLocale = "en";

/**
 * Locales that have fully localized, SEO-ready content and therefore get
 * their own public URLs, sitemap entries, and hreflang alternates.
 * `en` lives at the root (no prefix); every other active locale is served
 * under a `/{code}` path prefix. Roll a language out by adding it here once
 * its `tool-seo/{code}.ts` content exists.
 */
export const activeLocales = ["en", "uz", "ru", "es", "zh", "ar", "hi", "pt", "de", "fr", "ja", "ko", "tr", "it", "id", "pl", "vi", "nl", "th", "uk", "zh-tw", "bg", "ca", "el", "ms", "sv", "sw"] as const;

export function isActiveLocale(code: string): boolean {
  return (activeLocales as readonly string[]).includes(code);
}

/** Look up a locale's metadata (native name, flag, text direction). */
export function getLocale(code: string): Locale {
  return locales.find((l) => l.code === code) ?? locales[0]!;
}

const localeCodeSet = new Set(locales.map((l) => l.code));

/** Strip a leading `/{locale}` prefix, returning the locale-agnostic path. */
export function stripLocalePrefix(pathname: string): string {
  const seg = pathname.split("/")[1] ?? "";
  if (localeCodeSet.has(seg)) {
    const rest = pathname.slice(seg.length + 1);
    return rest === "" ? "/" : rest;
  }
  return pathname || "/";
}

/**
 * Build the public path for a locale: en → `/foo`, others → `/{code}/foo`.
 * Preserves a leading hash/query (`/#how` → `/uz#how`).
 */
const UNLOCALIZED_PREFIXES = ["/account", "/auth", "/api"];

export function localizePath(path: string, code: string): string {
  const clean = path.startsWith("/") ? path : `/${path}`;
  if (code === defaultLocale) return clean;
  // The authed / non-SEO surface lives outside the [locale] tree.
  if (UNLOCALIZED_PREFIXES.some((p) => clean === p || clean.startsWith(`${p}/`))) {
    return clean;
  }
  if (clean === "/") return `/${code}`;
  // "/#anchor" or "/?q=" → keep "/uz" joined directly to the # or ?
  if (clean.startsWith("/#") || clean.startsWith("/?")) return `/${code}${clean.slice(1)}`;
  return `/${code}${clean}`;
}
