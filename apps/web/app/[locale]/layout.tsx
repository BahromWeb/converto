import type { Metadata, Viewport } from "next";
import { notFound } from "next/navigation";
import { siteConfig } from "@converto/data";
import { AppShell } from "@/components/layout/app-shell";
import { activeLocales, isActiveLocale } from "@/lib/i18n/locales";

// Pre-render one document per active locale. Adding a language to
// `activeLocales` is all it takes to publish its whole tree.
export function generateStaticParams() {
  return activeLocales.map((locale) => ({ locale }));
}

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
  // so a root canonical would silently bleed to every child page. Each
  // tool/marketing page provides its own canonical + hreflang.
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

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isActiveLocale(locale)) notFound();

  return <AppShell locale={locale}>{children}</AppShell>;
}
