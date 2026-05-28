import type { Tool } from "@converto/types";

/**
 * Canonical registry of every tool convertpdfgo offers.
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
    slug: "chat-word",
    name: "Chat with Word",
    description: "Drop a Word doc, ask anything — answers cite the page.",
    category: "ai",
    badge: "new",
  },
  {
    slug: "chat-excel",
    name: "Chat with Excel",
    description: "Query spreadsheets in plain English. Numbers, formulas, totals.",
    category: "ai",
    badge: "new",
  },
  {
    slug: "chat-powerpoint",
    name: "Chat with PowerPoint",
    description: "Summarise decks, pull quotes from slides — citations included.",
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
  // ── Page operations ──────────────────────────────────────────────────────
  {
    slug: "removepage",
    name: "Remove Pages",
    description: "Drop specific pages from a PDF — drag a range, hit go.",
    category: "organize",
  },
  {
    slug: "extract",
    name: "Extract Pages",
    description: "Keep only the pages you want, in their own PDF.",
    category: "organize",
  },
  {
    slug: "rotate",
    name: "Rotate PDF",
    description: "Spin a page or every page by 90°, 180°, 270°.",
    category: "edit",
  },
  {
    slug: "crop",
    name: "Crop PDF",
    description: "Trim margins or focus a region across every page.",
    category: "edit",
  },
  {
    slug: "add-page-numbers",
    name: "Add Page Numbers",
    description: "Sequential numbering with full control over style and position.",
    category: "edit",
  },
  {
    slug: "header-footer",
    name: "Header & Footer",
    description: "Drop a header or footer on every page in seconds.",
    category: "edit",
  },
  {
    slug: "qr-code",
    name: "Add QR Code",
    description: "Embed a QR code anywhere on the page — links, vCards, anything.",
    category: "edit",
  },
  {
    slug: "nup",
    name: "N-up Layout",
    description: "Fit 2, 4, 6, or 9 pages onto a single sheet.",
    category: "edit",
  },
  // ── Analysis ─────────────────────────────────────────────────────────────
  {
    slug: "inspect",
    name: "Inspect PDF",
    description: "Page count, author, title, keywords — instant metadata.",
    category: "edit",
  },
  {
    slug: "detect-blank",
    name: "Detect Blank Pages",
    description: "Find every empty page so you can prune them before printing.",
    category: "edit",
  },
  {
    slug: "metadata",
    name: "Edit Metadata",
    description: "Rewrite title, author, subject, keywords, creator.",
    category: "edit",
  },
  // ── Image conversions ────────────────────────────────────────────────────
  {
    slug: "pdf-to-jpg",
    name: "PDF to JPG",
    description: "Every page as its own JPG — plus a ZIP of all of them.",
    category: "convert",
  },
  // ── Office conversions ───────────────────────────────────────────────────
  {
    slug: "excel-to-pdf",
    name: "Excel to PDF",
    description: "Workbooks to clean PDFs — one sheet per page.",
    category: "convert",
  },
  {
    slug: "ppt-to-pdf",
    name: "PowerPoint to PDF",
    description: "Slides to PDF, one slide per page.",
    category: "convert",
  },
  {
    slug: "pdf-to-excel",
    name: "PDF to Excel",
    description: "Layout-aware text extraction into a workbook.",
    category: "convert",
  },
  {
    slug: "pdf-to-ppt",
    name: "PDF to PowerPoint",
    description: "Page-per-slide deck you can keep editing.",
    category: "convert",
  },
  {
    slug: "html-to-pdf",
    name: "HTML to PDF",
    description: "Paste HTML, get a clean PDF rendered by Chromium.",
    category: "convert",
  },
  {
    slug: "pdf-to-html",
    name: "PDF to HTML",
    description: "Browser-ready HTML out of any PDF.",
    category: "convert",
  },
  {
    slug: "url-to-pdf",
    name: "URL to PDF",
    description: "Snapshot any public web page as a PDF.",
    category: "convert",
  },
  // ── OCR family ───────────────────────────────────────────────────────────
  {
    slug: "scan-to-pdf",
    name: "Scan to PDF",
    description: "Photos of paper documents → one searchable PDF.",
    category: "ai",
  },
  {
    slug: "ocr-extract-text",
    name: "Extract Text (OCR)",
    description: "Pull every word out of a scanned PDF, into plain text.",
    category: "ai",
  },
  {
    slug: "image-to-text",
    name: "Image to Text",
    description: "Read text from any photo or screenshot.",
    category: "ai",
  },
  {
    slug: "ocr-detect-lang",
    name: "Detect Language",
    description: "What language is this document in? Tesseract will tell you.",
    category: "ai",
  },
  {
    slug: "ocr-structured",
    name: "Structured OCR",
    description: "OCR with layout info — headings, columns, tables intact.",
    category: "ai",
  },
  {
    slug: "extract-text",
    name: "Extract Text",
    description: "Plain text out of a PDF that already has a text layer.",
    category: "edit",
  },
  {
    slug: "cv-builder",
    name: "AI Resume Builder",
    description: "Build, redesign, or talk to your CV — in 20 languages.",
    category: "career",
    badge: "new",
  },
  {
    slug: "cv-from-pdf",
    name: "PDF → Resume",
    description: "Scan or upload an existing CV, redesign it with AI.",
    category: "career",
    badge: "new",
  },
  {
    slug: "cv-voice",
    name: "Voice → Resume",
    description: "Talk through your career, AI structures it into a CV.",
    category: "career",
    badge: "new",
  },
  {
    slug: "ats-check",
    name: "ATS Checker",
    description: "Score your CV against any job description.",
    category: "career",
  },
  {
    slug: "resume-translate",
    name: "Resume Translator",
    description: "One CV in 20 languages, native quality.",
    category: "career",
  },
  {
    slug: "cover-letter",
    name: "Cover Letter",
    description: "AI cover letter from your CV + job description.",
    category: "career",
  },
  {
    slug: "resume-to-docx",
    name: "Resume → DOCX",
    description: "Editable Word from your PDF resume.",
    category: "career",
  },
  {
    slug: "chat-with-cv",
    name: "Chat with CV",
    description: "Ask AI about your own resume — reuses the chat pipeline.",
    category: "career",
  },
];

export function getToolBySlug(slug: string): Tool | undefined {
  return tools.find((t) => t.slug === slug);
}

export function getToolsByCategory(category: Tool["category"]): Tool[] {
  return tools.filter((t) => t.category === category);
}
