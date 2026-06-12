"use client";

import Link from "next/link";
import { forwardRef, type ComponentProps } from "react";
import { useI18n } from "@/lib/i18n/context";
import { localizePath } from "@/lib/i18n/locales";

type LocaleLinkProps = ComponentProps<typeof Link>;

/**
 * Drop-in replacement for next/link that prefixes internal absolute paths
 * with the active locale (`/merge` → `/uz/merge` when browsing in Uzbek),
 * so users and crawlers stay within the same language. External URLs and
 * non-absolute hrefs pass through untouched.
 */
export const LocaleLink = forwardRef<HTMLAnchorElement, LocaleLinkProps>(
  function LocaleLink({ href, ...props }, ref) {
    const { locale } = useI18n();
    const localized =
      typeof href === "string" && href.startsWith("/")
        ? localizePath(href, locale)
        : href;
    return <Link ref={ref} href={localized} {...props} />;
  },
);
