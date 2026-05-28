import type { Metadata } from "next";

export const metadata: Metadata = { title: "Privacy Policy", alternates: { canonical: "/privacy" } };

const sections = [
  {
    title: "What we collect",
    body: "We collect only what's necessary to run convertpdfgo: uploaded files (processed in memory and deleted within 1 hour), usage analytics (anonymised), and contact information if you reach out to us.",
  },
  {
    title: "How we use your data",
    body: "Uploaded files are used solely to perform the requested operation. We never read, sell, or share your documents with third parties.",
  },
  {
    title: "File retention",
    body: "All uploaded files are automatically deleted from our servers within 1 hour of processing. We do not keep copies.",
  },
  {
    title: "Cookies",
    body: "We use minimal cookies for language preference and session management. No tracking cookies or advertising pixels.",
  },
  {
    title: "Contact",
    body: "Questions about your privacy? Email us at privacy@convertpdfgo.com and we'll respond within 48 hours.",
  },
];

export default function PrivacyPage() {
  return (
    <div className="container py-16">
      <div className="mx-auto max-w-2xl">
        <p className="font-mono text-xs uppercase tracking-widest text-primary">Legal</p>
        <h1 className="mt-3 text-4xl font-bold tracking-tight text-foreground">Privacy Policy</h1>
        <p className="mt-4 text-sm text-muted-foreground">Last updated: May 2026</p>

        <div className="mt-12 flex flex-col gap-10">
          {sections.map(({ title, body }) => (
            <div key={title}>
              <h2 className="text-xl font-bold text-foreground">{title}</h2>
              <p className="mt-3 text-muted-foreground">{body}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
