import type { Metadata } from "next";
import { Card } from "@converto/ui/components/card";
import { tools } from "@converto/data";
import type { ToolCategory } from "@converto/types";
import { Topbar } from "@/components/layout/topbar";

export const metadata: Metadata = { title: "Tools" };

const categoryMeta: Record<ToolCategory, { label: string }> = {
  organize: { label: "Organize" },
  convert: { label: "Convert" },
  edit: { label: "Edit" },
  secure: { label: "Secure" },
  ai: { label: "AI" },
  career: { label: "Career" },
};

// Real product catalog from the shared @converto/data registry — the same
// source the public site and sitemap read. No usage numbers are shown
// because the backend does not track per-tool counters.
export default function ToolsPage() {
  const total = tools.length;
  const live = tools.filter((t) => !t.comingSoon).length;
  const soon = total - live;

  const byCategory = (Object.keys(categoryMeta) as ToolCategory[])
    .map((cat) => ({ cat, items: tools.filter((t) => t.category === cat) }))
    .filter((g) => g.items.length > 0);

  return (
    <>
      <Topbar title="Tools" description={`${live} live · ${soon} coming soon`} crumbs={["Platform", "Tools"]} />

      <div className="space-y-6 p-8">
        <section className="grid grid-cols-3 gap-4">
          {[
            { label: "Total tools", value: total },
            { label: "Live", value: live },
            { label: "Coming soon", value: soon },
          ].map((s) => (
            <Card key={s.label} className="p-5">
              <p className="text-xs font-medium text-muted-foreground">{s.label}</p>
              <p className="mt-1 text-2xl font-bold tabular-nums text-foreground">{s.value}</p>
            </Card>
          ))}
        </section>

        {byCategory.map(({ cat, items }) => (
          <div key={cat}>
            <h3 className="mb-2 text-xs font-bold uppercase tracking-widest text-muted-foreground">
              {categoryMeta[cat].label} · {items.length}
            </h3>
            <Card className="divide-y divide-border">
              {items.map((t) => (
                <div key={t.slug} className="flex items-center justify-between gap-3 px-5 py-3">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-foreground">{t.name}</p>
                    <p className="truncate text-xs text-muted-foreground">/{t.slug}</p>
                  </div>
                  <div className="flex shrink-0 items-center gap-2">
                    {t.badge ? (
                      <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-primary">
                        {t.badge}
                      </span>
                    ) : null}
                    <span
                      className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide ${
                        t.comingSoon
                          ? "bg-amber-50 text-amber-700"
                          : "bg-emerald-50 text-emerald-700"
                      }`}
                    >
                      {t.comingSoon ? "Soon" : "Live"}
                    </span>
                  </div>
                </div>
              ))}
            </Card>
          </div>
        ))}
      </div>
    </>
  );
}
