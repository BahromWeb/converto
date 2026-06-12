// Root layout is intentionally a pass-through. The `<html>`/`<body>` document
// is owned by each top-level segment that needs one — the localized SEO tree
// (`app/[locale]`), the authed app group (`app/(app)`), and `not-found` — so
// that `<html lang>` can be set per-URL-locale for crawlers. This is the
// standard Next.js App Router i18n pattern.
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return children;
}
