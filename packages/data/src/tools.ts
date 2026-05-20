import type { Tool } from "@converto/types";

/**
 * Canonical registry of every tool Converto offers.
 * Both `apps/web` and `apps/admin` read from this list — never duplicate.
 */
export const tools: Tool[] = [
  {
    slug: "merge",
    name: "Merge PDF",
    description: "Combine PDFs in the order you want. Drag, drop, done.",
    category: "organize",
    badge: "popular",
  },
  {
    slug: "split",
    name: "Split PDF",
    description: "Extract pages or chop a doc into pieces.",
    category: "organize",
  },
  {
    slug: "compress",
    name: "Compress PDF",
    description: "Smaller files, same quality. Or smaller-still.",
    category: "edit",
  },
  {
    slug: "chat",
    name: "Chat with PDF",
    description: "Ask questions. Get answers, with citations.",
    category: "ai",
    badge: "new",
  },
  {
    slug: "pdf-to-word",
    name: "PDF to Word",
    description: "Editable .docx with formatting intact.",
    category: "convert",
  },
  {
    slug: "word-to-pdf",
    name: "Word to PDF",
    description: "Pristine output, every font preserved.",
    category: "convert",
  },
  {
    slug: "jpg-to-pdf",
    name: "JPG to PDF",
    description: "Photos and scans, neatly bundled.",
    category: "convert",
  },
  {
    slug: "sign",
    name: "Sign PDF",
    description: "Drop a signature, send it back, done.",
    category: "secure",
  },
  {
    slug: "protect",
    name: "Protect PDF",
    description: "Password-lock a file in one click.",
    category: "secure",
  },
  {
    slug: "unlock",
    name: "Unlock PDF",
    description: "Remove the password (if you've got the rights).",
    category: "secure",
  },
  {
    slug: "ocr",
    name: "OCR PDF",
    description: "Make scanned PDFs searchable and copy-pasteable.",
    category: "ai",
  },
  {
    slug: "watermark",
    name: "Watermark PDF",
    description: "Add (your own) watermark to any page.",
    category: "edit",
  },
];

export function getToolBySlug(slug: string): Tool | undefined {
  return tools.find((t) => t.slug === slug);
}

export function getToolsByCategory(category: Tool["category"]): Tool[] {
  return tools.filter((t) => t.category === category);
}
