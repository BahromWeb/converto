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
];

export const defaultLocale = "en";
