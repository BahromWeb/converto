import type { Metadata } from "next";

export const metadata: Metadata = { title: "Terms of Service", alternates: { canonical: "/terms" } };

const sections = [
  {
    title: "Acceptance",
    body: "By using convertpdfgo you agree to these terms. If you don't agree, please don't use the service.",
  },
  {
    title: "Permitted use",
    body: "convertpdfgo is for personal and commercial use. You may not use the service to process files you don't own or have the right to modify.",
  },
  {
    title: "File responsibility",
    body: "You are responsible for the content of files you upload. We reserve the right to refuse service for illegal or harmful content.",
  },
  {
    title: "Service availability",
    body: "We aim for 99.9% uptime but don't guarantee it. Planned maintenance is announced on our status page.",
  },
  {
    title: "Changes to terms",
    body: "We may update these terms with notice. Continued use after changes means you accept the new terms.",
  },
];

export default function TermsPage() {
  return (
    <div className="container py-16">
      <div className="mx-auto max-w-2xl">
        <p className="font-mono text-xs uppercase tracking-widest text-primary">Legal</p>
        <h1 className="mt-3 text-4xl font-bold tracking-tight text-foreground">Terms of Service</h1>
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
