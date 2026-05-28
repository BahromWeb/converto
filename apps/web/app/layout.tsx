import type { Metadata, Viewport } from "next";
import { Inter, Instrument_Serif, JetBrains_Mono } from "next/font/google";
import "@converto/ui/globals.css";
import { siteConfig } from "@converto/data";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { LanguageProvider } from "@/lib/i18n/context";
import { Providers } from "./providers";

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

// One sentence on each block:
//  - default title carries the brand + the highest-intent keyword cluster so
//    queries like "merge pdf online" don't have to fight an empty page title;
//  - tool pages override `title` via their own metadata export and the
//    template wraps them with the brand for breadcrumb trust;
//  - keywords are out of fashion but cost nothing — Bing/Yandex still read
//    them and a few smaller engines bias relevance off them.
const defaultTitle =
  "convertpdfgo — Free online PDF tools: merge, split, compress, convert, OCR";
const defaultKeywords = [
  "pdf tools",
  "merge pdf",
  "split pdf",
  "compress pdf",
  "pdf to word",
  "word to pdf",
  "pdf to excel",
  "pdf to jpg",
  "jpg to pdf",
  "ocr pdf",
  "unlock pdf",
  "protect pdf",
  "watermark pdf",
  "rotate pdf",
  "crop pdf",
  "edit pdf",
  "free pdf converter",
  "online pdf editor",
  "no watermark pdf",
];

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: defaultTitle,
    template: `%s · ${siteConfig.name}`,
  },
  description: siteConfig.description,
  keywords: defaultKeywords,
  applicationName: siteConfig.name,
  authors: [{ name: siteConfig.name, url: siteConfig.url }],
  creator: siteConfig.name,
  publisher: siteConfig.name,
  category: "productivity",
  // No root-level `alternates.canonical` — Next.js merges by replacement,
  // so a root canonical would silently bleed to every child page that
  // doesn't set its own. Each tool/marketing page provides its own
  // canonical via its `metadata` export.
  // Explicit robots block — defaults already let crawlers in, but spelling
  // it out unblocks rich snippets (max-image-preview:large) that Google
  // otherwise withholds for unverified sites.
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-snippet": -1,
      "max-image-preview": "large",
      "max-video-preview": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteConfig.url,
    title: defaultTitle,
    description: siteConfig.description,
    siteName: siteConfig.name,
    images: [
      {
        url: siteConfig.ogImage,
        width: 1200,
        height: 630,
        alt: `${siteConfig.name} — free online PDF tools`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: defaultTitle,
    description: siteConfig.description,
    images: [siteConfig.ogImage],
    site: "@convertpdfgo",
    creator: "@convertpdfgo",
  },
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/favicon.ico", sizes: "any" },
    ],
    apple: "/apple-touch-icon.png",
    shortcut: "/favicon.ico",
  },
  manifest: "/site.webmanifest",
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#FAF6EE" },
    { media: "(prefers-color-scheme: dark)", color: "#0F0E0C" },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${fontSans.variable} ${fontSerif.variable} ${fontMono.variable} bg-paper font-sans`}
      >
        <Providers>
          <LanguageProvider>
            <div className="flex min-h-screen flex-col">
              <SiteHeader />
              <main className="flex-1">{children}</main>
              <SiteFooter />
            </div>
          </LanguageProvider>
        </Providers>
      </body>
    </html>
  );
}
