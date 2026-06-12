import type { Metadata } from "next";
import { ShieldCheck, Lock, Server, Trash2 } from "lucide-react";


// Marketing pages are mostly static — render at build time and revalidate hourly
// so the next-build picks up locale + tools.length changes within an hour.
export const revalidate = 3600

export const metadata: Metadata = { title: "Security", alternates: { canonical: "/security" } };

const pillars = [
  {
    icon: Lock,
    title: "AES-256 Encryption",
    body: "All files are encrypted in transit (TLS 1.3) and at rest. Your documents are treated as confidential.",
  },
  {
    icon: Server,
    title: "EU-based Infrastructure",
    body: "Data is processed on servers within the EU, complying with GDPR and data residency requirements.",
  },
  {
    icon: Trash2,
    title: "Auto-deletion",
    body: "Every uploaded file is permanently deleted within 1 hour of processing — no backups, no traces.",
  },
  {
    icon: ShieldCheck,
    title: "Zero-knowledge approach",
    body: "We never read the content of your files. Processing is automated and isolated per session.",
  },
];

export default function SecurityPage() {
  return (
    <div className="container py-16">
      <div className="mx-auto max-w-2xl">
        <p className="font-mono text-xs uppercase tracking-widest text-primary">Security</p>
        <h1 className="mt-3 text-4xl font-bold tracking-tight text-foreground">
          Built with security first
        </h1>
        <p className="mt-4 text-muted-foreground">
          Your documents are private. Here's exactly how we protect them.
        </p>

        <div className="mt-12 grid gap-6 sm:grid-cols-2">
          {pillars.map(({ icon: Icon, title, body }) => (
            <div key={title} className="rounded-xl border bg-card p-6">
              <div className="grid h-11 w-11 place-items-center rounded-xl bg-primary/10">
                <Icon className="size-5 text-primary" />
              </div>
              <h2 className="mt-4 font-bold text-foreground">{title}</h2>
              <p className="mt-2 text-sm text-muted-foreground">{body}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
