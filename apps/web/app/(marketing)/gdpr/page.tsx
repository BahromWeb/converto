import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = { title: "GDPR" };

const rights = [
  { right: "Right of access", desc: "Request a copy of all personal data we hold about you." },
  { right: "Right to rectification", desc: "Ask us to correct inaccurate or incomplete data." },
  { right: "Right to erasure", desc: "Request deletion of your personal data at any time." },
  { right: "Right to portability", desc: "Receive your data in a portable, machine-readable format." },
  { right: "Right to object", desc: "Object to processing of your data for any reason." },
];

export default function GdprPage() {
  return (
    <div className="container py-16">
      <div className="mx-auto max-w-2xl">
        <p className="font-mono text-xs uppercase tracking-widest text-primary">Legal</p>
        <h1 className="mt-3 text-4xl font-bold tracking-tight text-foreground">GDPR</h1>
        <p className="mt-4 text-muted-foreground">
          Converto is fully GDPR-compliant. We process EU personal data lawfully, fairly, and transparently.
        </p>

        <h2 className="mt-10 text-2xl font-bold text-foreground">Your rights</h2>
        <div className="mt-6 flex flex-col gap-5">
          {rights.map(({ right, desc }) => (
            <div key={right} className="rounded-xl border bg-card p-5">
              <p className="font-bold text-foreground">{right}</p>
              <p className="mt-1 text-sm text-muted-foreground">{desc}</p>
            </div>
          ))}
        </div>

        <p className="mt-10 text-sm text-muted-foreground">
          To exercise any of these rights, email{" "}
          <a href="mailto:privacy@converto.io" className="font-semibold text-primary hover:underline">
            privacy@converto.io
          </a>
          . We'll respond within 30 days as required by law. See our{" "}
          <Link href="/privacy" className="font-semibold text-primary hover:underline">
            Privacy Policy
          </Link>{" "}
          for more detail.
        </p>
      </div>
    </div>
  );
}
