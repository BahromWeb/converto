import { Inter, Instrument_Serif, JetBrains_Mono } from "next/font/google";
import "@converto/ui/globals.css";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { LanguageProvider } from "@/lib/i18n/context";
import { Providers } from "@/app/providers";
import { getLocale } from "@/lib/i18n/locales";

const fontSans = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const fontSerif = Instrument_Serif({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-serif",
  display: "swap",
});

const fontMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

/**
 * The single source of `<html>`/`<body>` + global chrome. Rendered by every
 * top-level segment that owns a document — the localized SEO tree
 * (`app/[locale]`), the authed app group (`app/(app)`), and the root
 * not-found. `lang`/`dir` come from the URL locale so server-rendered HTML
 * carries the correct language for crawlers (no client-only lang swap).
 */
export function AppShell({
  locale,
  children,
  chrome = true,
}: {
  locale: string;
  children: React.ReactNode;
  /** When false, render the bare document without header/footer (auth flows). */
  chrome?: boolean;
}) {
  const { dir } = getLocale(locale);
  return (
    <html lang={locale} dir={dir} suppressHydrationWarning>
      <body
        className={`${fontSans.variable} ${fontSerif.variable} ${fontMono.variable} bg-paper font-sans`}
      >
        <Providers>
          <LanguageProvider initialLocale={locale}>
            {chrome ? (
              <div className="flex min-h-screen flex-col">
                <SiteHeader />
                <main className="flex-1">{children}</main>
                <SiteFooter />
              </div>
            ) : (
              children
            )}
          </LanguageProvider>
        </Providers>
      </body>
    </html>
  );
}
