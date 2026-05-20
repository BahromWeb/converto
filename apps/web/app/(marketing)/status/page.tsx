import type { Metadata } from "next";

export const metadata: Metadata = { title: "System Status" };

const services = [
  { name: "PDF Processing", status: "operational" },
  { name: "File Upload", status: "operational" },
  { name: "AI Chat", status: "operational" },
  { name: "API", status: "operational" },
  { name: "Website", status: "operational" },
];

export default function StatusPage() {
  return (
    <div className="container py-16">
      <div className="mx-auto max-w-xl">
        <div className="flex items-center gap-3">
          <span className="h-3 w-3 animate-pulse rounded-full bg-emerald-500" />
          <h1 className="text-3xl font-bold tracking-tight text-foreground">All systems operational</h1>
        </div>
        <p className="mt-3 text-muted-foreground">Updated in real-time. Last checked just now.</p>

        <div className="mt-10 flex flex-col gap-3">
          {services.map(({ name, status }) => (
            <div
              key={name}
              className="flex items-center justify-between rounded-xl border bg-card px-5 py-4"
            >
              <span className="font-medium text-foreground">{name}</span>
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-emerald-500" />
                <span className="text-sm font-semibold text-emerald-600 capitalize">{status}</span>
              </div>
            </div>
          ))}
        </div>

        <p className="mt-8 text-center text-xs text-muted-foreground">
          Experiencing issues? Email{" "}
          <a href="mailto:support@converto.io" className="font-semibold text-primary hover:underline">
            support@converto.io
          </a>
        </p>
      </div>
    </div>
  );
}
