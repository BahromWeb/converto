import { NextResponse, type NextRequest } from "next/server";
import { locales, activeLocales, defaultLocale } from "@/lib/i18n/locales";

const allLocaleCodes: string[] = locales.map((l) => l.code);
const activeNonDefault: string[] = activeLocales.filter((c) => c !== defaultLocale);

/**
 * Locale URL strategy ("as-needed" prefixing):
 *  - English (default) is served at the root, unprefixed: `/merge`, `/`.
 *  - Every other active locale is served under a prefix: `/uz/merge`.
 *
 * The default locale is rewritten internally to `/en/...` so the `[locale]`
 * route tree can read `params.locale`, while the visible URL stays clean.
 * The matcher excludes `_next`, `api`, `account`, `auth`, and any file with
 * an extension (sitemap.xml, og.png, …).
 */
export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const firstSeg = pathname.split("/")[1] ?? "";

  // Canonicalize an explicit `/en/...` back to the clean root URL.
  if (firstSeg === defaultLocale) {
    const stripped = pathname.replace(/^\/en(?=\/|$)/, "") || "/";
    const url = req.nextUrl.clone();
    url.pathname = stripped;
    return NextResponse.redirect(url, 308);
  }

  // Active non-default locale (e.g. /uz/...) → serve as-is.
  if (activeNonDefault.includes(firstSeg)) {
    return NextResponse.next();
  }

  // A known-but-inactive locale (e.g. /ru while not yet launched) → let the
  // [locale] segment 404 it rather than rewriting it to English.
  if (allLocaleCodes.includes(firstSeg)) {
    return NextResponse.next();
  }

  // Unprefixed path → English content at the clean URL via internal rewrite.
  const url = req.nextUrl.clone();
  url.pathname = `/${defaultLocale}${pathname === "/" ? "" : pathname}`;
  return NextResponse.rewrite(url);
}

export const config = {
  matcher: ["/((?!_next|api|account|auth|.*\\..*).*)"],
};
