"use client";

import { FileText } from "lucide-react";

/**
 * Inline pill rendered in place of "[page N]" inside an assistant
 * message. Clicking it tells the parent to scroll the PDF panel to that
 * page (parent owns the scroll target since the same citation list is
 * shared between message bubbles and the PDF viewer).
 */
export function CitationBadge({
  page,
  onJump,
}: {
  page: number;
  onJump?: (page: number) => void;
}) {
  return (
    <button
      type="button"
      onClick={() => onJump?.(page)}
      className="mx-0.5 inline-flex items-center gap-1 rounded-md bg-primary/10 px-1.5 py-0.5 align-baseline text-[11px] font-semibold text-primary transition-all hover:bg-primary/20 hover:-translate-y-0.5"
      aria-label={`Jump to page ${page} in the document`}
    >
      <FileText className="size-3" />
      page {page}
    </button>
  );
}

/**
 * Splits a message string on "[page N]" tokens and renders each segment.
 * Plain text gets rendered as-is; matches become CitationBadge instances.
 * Kept as a pure renderer (no state) so it works inside streaming and
 * fully-rendered messages alike.
 */
export function renderWithCitations(
  text: string,
  onJump?: (page: number) => void,
): React.ReactNode {
  if (!text) return null;
  // Match "[page N]" or "[Page N]" with optional surrounding whitespace.
  const parts = text.split(/(\[page\s+\d+\])/gi);
  return parts.map((part, i) => {
    const m = part.match(/^\[page\s+(\d+)\]$/i);
    if (m && m[1]) {
      return <CitationBadge key={i} page={parseInt(m[1], 10)} onJump={onJump} />;
    }
    return <span key={i}>{part}</span>;
  });
}
