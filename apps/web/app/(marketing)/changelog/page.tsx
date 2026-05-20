import type { Metadata } from "next";

export const metadata: Metadata = { title: "Changelog" };

const entries = [
  {
    version: "v0.3.0",
    date: "May 2026",
    changes: [
      "Added OCR tool with multi-language support",
      "Watermark tool: image watermarks now supported",
      "Chat with PDF: citation highlighting",
    ],
  },
  {
    version: "v0.2.0",
    date: "April 2026",
    changes: [
      "Sign PDF: draw, type, and upload signature modes",
      "Protect & Unlock PDF with AES-256",
      "Language switcher — 12 languages",
    ],
  },
  {
    version: "v0.1.0",
    date: "March 2026",
    changes: [
      "Merge, Split, and Compress PDF",
      "PDF ↔ Word and JPG to PDF conversions",
      "Initial release",
    ],
  },
];

export default function ChangelogPage() {
  return (
    <div className="container py-16">
      <div className="mx-auto max-w-2xl">
        <p className="font-mono text-xs uppercase tracking-widest text-primary">What's new</p>
        <h1 className="mt-3 text-4xl font-bold tracking-tight text-foreground">Changelog</h1>
        <p className="mt-4 text-muted-foreground">Every release, every improvement, all in one place.</p>

        <div className="mt-12 space-y-12">
          {entries.map((entry) => (
            <div key={entry.version} className="relative pl-6">
              <span className="absolute left-0 top-1.5 h-2 w-2 rounded-full bg-primary" />
              <div className="flex items-baseline gap-3">
                <span className="font-mono text-sm font-bold text-foreground">{entry.version}</span>
                <span className="text-xs text-muted-foreground">{entry.date}</span>
              </div>
              <ul className="mt-4 space-y-2">
                {entry.changes.map((c) => (
                  <li key={c} className="flex items-start gap-2 text-sm text-muted-foreground">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-muted-foreground/40" />
                    {c}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
