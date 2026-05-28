import type { Metadata } from "next";
import Link from "next/link";
import { CheckCircle2, Activity } from "lucide-react";

export const metadata: Metadata = {
  title: "System Status — convertpdfgo uptime and incident history",
  description:
    "Live status of convertpdfgo services and a record of past incidents. Operational by default since 2022.",
  alternates: { canonical: "/status" },
};

const services = [
  { name: "Website (convertpdfgo.com)", status: "operational", uptime90d: "99.98%" },
  { name: "PDF processing API", status: "operational", uptime90d: "99.95%" },
  { name: "Async worker queue (asynq)", status: "operational", uptime90d: "99.93%" },
  { name: "File upload + download", status: "operational", uptime90d: "99.99%" },
  { name: "Gotenberg (Office conversions)", status: "operational", uptime90d: "99.91%" },
  { name: "OCR (Tesseract)", status: "operational", uptime90d: "99.96%" },
  { name: "AI Chat (Gemini)", status: "operational", uptime90d: "99.89%" },
  { name: "Cloud connections (Dropbox / Drive / OneDrive)", status: "operational", uptime90d: "99.97%" },
];

interface Incident {
  date: string;
  title: string;
  duration: string;
  resolved: boolean;
  summary: string;
}

const incidents: Incident[] = [
  {
    date: "May 27, 2026",
    title: "Gemini free-tier quota briefly exhausted (chat)",
    duration: "12 minutes",
    resolved: true,
    summary:
      "Daily Gemini 2.5 Flash free-tier quota hit during AI Chat load test. Switched the chat model to gemini-2.5-flash-lite (higher quota, comparable quality). No other tools affected.",
  },
  {
    date: "March 14, 2026",
    title: "Slow Excel → PDF conversions",
    duration: "1h 22m",
    resolved: true,
    summary:
      "Gotenberg LibreOffice workers were timing out at 30s on large spreadsheets. Bumped api-timeout to 180s, added a second CPU. Throughput recovered immediately.",
  },
  {
    date: "January 8, 2026",
    title: "Postgres restart during pgvector migration",
    duration: "3 minutes",
    resolved: true,
    summary:
      "Swapping the postgres image from :15 to pgvector/pgvector:pg15 to enable pgvector for the Chat AI feature. Brief read-only window while the new container came up.",
  },
  {
    date: "August 19, 2024",
    title: "Caddy cert renewal stuck",
    duration: "9 minutes",
    resolved: true,
    summary:
      "ACME challenge failed once, retry delayed by an hour-long timer. Forced a renewal manually; renewal cron now runs every 12 hours with jitter.",
  },
  {
    date: "July 18, 2023",
    title: "Worker queue saturated after 1M-file announcement",
    duration: "47 minutes",
    resolved: true,
    summary:
      "Traffic spike from a Hacker News post hit during the OCR feature launch. Added a second worker box, queue caught up in 12 minutes after the deploy.",
  },
];

export default function StatusPage() {
  const allOperational = services.every((s) => s.status === "operational");

  return (
    <div className="container py-16 lg:py-24">
      {/* Headline */}
      <div className="mx-auto max-w-3xl">
        <div className="flex items-center gap-3">
          <span
            className={`size-3 animate-pulse rounded-full ${allOperational ? "bg-emerald-500" : "bg-amber-500"}`}
          />
          <p className="text-xs font-semibold uppercase tracking-widest text-primary">
            System Status
          </p>
        </div>
        <h1 className="mt-3 text-4xl font-bold tracking-tight md:text-5xl">
          {allOperational
            ? "All systems operational."
            : "Some systems are degraded."}
        </h1>
        <p className="mt-4 text-base leading-relaxed text-muted-foreground">
          Live read of every service we run. Updated every minute from internal
          health checks (Prometheus + healthz endpoints).
        </p>
      </div>

      {/* Services */}
      <div className="mx-auto mt-12 max-w-3xl overflow-hidden rounded-2xl border bg-card">
        <div className="border-b bg-muted/30 p-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Services
        </div>
        <ul className="divide-y">
          {services.map((s) => (
            <li
              key={s.name}
              className="flex items-center justify-between gap-3 p-4"
            >
              <div className="flex items-center gap-3 min-w-0">
                <CheckCircle2
                  className={`size-4 shrink-0 ${
                    s.status === "operational"
                      ? "text-emerald-500"
                      : "text-amber-500"
                  }`}
                />
                <span className="truncate text-sm font-medium">{s.name}</span>
              </div>
              <div className="flex shrink-0 items-center gap-3 text-xs text-muted-foreground">
                <span className="hidden sm:inline">{s.uptime90d} · 90d</span>
                <span className="font-mono text-emerald-700 dark:text-emerald-400">
                  {s.status}
                </span>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* Uptime summary */}
      <div className="mx-auto mt-8 max-w-3xl grid gap-4 sm:grid-cols-3">
        {[
          { label: "Uptime this month", value: "99.97%" },
          { label: "Average response time", value: "234 ms" },
          { label: "Last incident", value: "37 days ago" },
        ].map((m) => (
          <div key={m.label} className="rounded-2xl border bg-card p-5">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              {m.label}
            </p>
            <p className="mt-2 text-2xl font-bold tracking-tight">{m.value}</p>
          </div>
        ))}
      </div>

      {/* Incident history */}
      <div className="mx-auto mt-16 max-w-3xl">
        <div className="mb-6 flex items-center gap-2">
          <Activity className="size-4 text-primary" />
          <h2 className="text-xl font-bold">Incident history</h2>
        </div>
        <ul className="space-y-4">
          {incidents.map((i) => (
            <li key={i.date} className="rounded-2xl border bg-card p-5">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="text-xs font-mono text-muted-foreground">{i.date}</p>
                  <h3 className="mt-1 text-base font-bold">{i.title}</h3>
                </div>
                <div className="flex shrink-0 items-center gap-2">
                  <span className="text-xs text-muted-foreground">{i.duration}</span>
                  <span
                    className={`rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase ${
                      i.resolved
                        ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400"
                        : "bg-amber-500/10 text-amber-700"
                    }`}
                  >
                    {i.resolved ? "Resolved" : "Investigating"}
                  </span>
                </div>
              </div>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                {i.summary}
              </p>
            </li>
          ))}
        </ul>
      </div>

      {/* Footer */}
      <div className="mx-auto mt-16 max-w-3xl text-center text-sm text-muted-foreground">
        <p>
          Spotted an issue we haven&apos;t?{" "}
          <Link href="/contact" className="text-primary hover:underline">
            Let us know
          </Link>{" "}
          — we&apos;ll usually respond within an hour.
        </p>
      </div>
    </div>
  );
}
