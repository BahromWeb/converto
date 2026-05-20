const RELATIVE_THRESHOLDS = [
  { limit: 60, divisor: 1, unit: "second" },
  { limit: 3600, divisor: 60, unit: "minute" },
  { limit: 86400, divisor: 3600, unit: "hour" },
  { limit: 604800, divisor: 86400, unit: "day" },
  { limit: 2629800, divisor: 604800, unit: "week" },
  { limit: 31557600, divisor: 2629800, unit: "month" },
  { limit: Infinity, divisor: 31557600, unit: "year" },
] as const;

/**
 * Returns a short, localized relative timestamp ("3 minutes ago", "in 2 days").
 * Always anchors against `now` (defaults to `Date.now()`) so callers can supply
 * a fixed timestamp for deterministic rendering on the server.
 */
export function formatRelativeTime(
  value: string | number | Date,
  now: number = Date.now(),
  locale = "en-US",
): string {
  const target = new Date(value).getTime();
  const diffSeconds = (target - now) / 1000;
  const absDiff = Math.abs(diffSeconds);

  const threshold = RELATIVE_THRESHOLDS.find((t) => absDiff < t.limit);
  if (!threshold) return new Date(value).toLocaleDateString(locale);

  const value_ = Math.round(diffSeconds / threshold.divisor);
  return new Intl.RelativeTimeFormat(locale, { numeric: "auto" }).format(
    value_,
    threshold.unit as Intl.RelativeTimeFormatUnit,
  );
}

/** Compact date format suitable for dense tables — e.g. "May 19, 08:14". */
export function formatTableDate(value: string | number | Date, locale = "en-US"): string {
  return new Date(value).toLocaleString(locale, {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
}
