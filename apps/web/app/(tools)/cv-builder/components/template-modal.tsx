"use client";

import { useEffect, useState } from "react";
import { X, CheckCircle2, Loader2 } from "lucide-react";
import { listCVTemplates } from "@/lib/cv/api";
import type { CVTemplate } from "@/lib/cv/types";

export function TemplateModal({
  currentID,
  onPick,
  onClose,
}: {
  currentID: string;
  onPick: (id: string) => void;
  onClose: () => void;
}) {
  const [templates, setTemplates] = useState<CVTemplate[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    listCVTemplates()
      .then(setTemplates)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/50 p-4 backdrop-blur-sm">
      <div className="w-full max-w-4xl overflow-hidden rounded-2xl border bg-card shadow-2xl">
        <div className="flex items-center justify-between border-b p-4">
          <div>
            <h2 className="text-lg font-bold">Choose a template</h2>
            <p className="text-xs text-muted-foreground">
              All ATS-friendly options keep keyword scanners happy.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="grid size-8 place-items-center rounded-lg text-muted-foreground hover:bg-accent hover:text-foreground"
          >
            <X className="size-4" />
          </button>
        </div>
        <div className="max-h-[70vh] overflow-y-auto p-6">
          {loading && (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="size-5 animate-spin text-muted-foreground" />
            </div>
          )}
          <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-5">
            {templates.map((t) => {
              const active = t.id === currentID;
              return (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => onPick(t.id)}
                  className={`group flex flex-col gap-2 rounded-xl border-2 p-3 text-left transition-all hover:-translate-y-0.5 ${
                    active
                      ? "border-primary bg-primary/5"
                      : "border-border bg-card hover:border-primary/40"
                  }`}
                >
                  <div className="aspect-[3/4] rounded-lg bg-gradient-to-br from-muted to-secondary p-3">
                    {/* Placeholder visual — real previews land in Sprint 2 */}
                    <div className="space-y-1.5">
                      <div className="h-2 w-2/3 rounded bg-foreground/30" />
                      <div className="h-1.5 w-1/2 rounded bg-foreground/15" />
                    </div>
                    <div className="mt-3 space-y-1">
                      <div className="h-1.5 w-full rounded bg-foreground/10" />
                      <div className="h-1.5 w-5/6 rounded bg-foreground/10" />
                      <div className="h-1.5 w-4/6 rounded bg-foreground/10" />
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-bold">{t.name}</p>
                    {active && <CheckCircle2 className="size-4 text-primary" />}
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {t.is_ats_friendly && (
                      <span className="rounded-full bg-emerald-500/10 px-1.5 py-0.5 text-[9px] font-semibold uppercase text-emerald-700">
                        ATS
                      </span>
                    )}
                    {t.category && (
                      <span className="rounded-full bg-muted px-1.5 py-0.5 text-[9px] font-semibold uppercase text-muted-foreground">
                        {t.category}
                      </span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
