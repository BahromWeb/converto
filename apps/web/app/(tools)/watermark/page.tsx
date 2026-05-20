import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Button } from "@converto/ui/components/button";
import { Card } from "@converto/ui/components/card";
import { ToolPageShell } from "@/components/tools/tool-page-shell";
import { getToolBySlug } from "@converto/data";
import { Layers, Type, Image } from "lucide-react";

export const metadata: Metadata = {
  title: "Watermark PDF",
  description: "Add a custom text or image watermark to any PDF page.",
};

export default function WatermarkPage() {
  const tool = getToolBySlug("watermark");
  if (!tool) notFound();

  return (
    <ToolPageShell tool={tool} index="12" variant="text · image">
      <Card className="p-8">
        <div className="grid gap-8 md:grid-cols-[1fr_300px]">
          {/* Preview */}
          <div className="relative min-h-80 overflow-hidden rounded-xl border bg-white p-6 shadow-sm">
            <div className="space-y-2">
              {Array.from({ length: 10 }).map((_, i) => (
                <div
                  key={i}
                  className="h-2 rounded bg-muted"
                  style={{ width: `${60 + (i * 7) % 35}%` }}
                />
              ))}
            </div>
            {/* Watermark overlay */}
            <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
              <p
                className="select-none text-5xl font-black uppercase tracking-widest text-foreground/10"
                style={{ transform: "rotate(-35deg)" }}
              >
                CONFIDENTIAL
              </p>
            </div>
          </div>

          {/* Controls */}
          <div className="flex flex-col gap-5">
            <div className="flex gap-2">
              <button className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-primary bg-primary/5 px-4 py-2.5 text-sm font-semibold text-primary">
                <Type className="size-4" /> Text
              </button>
              <button className="flex flex-1 items-center justify-center gap-2 rounded-lg border bg-card px-4 py-2.5 text-sm font-semibold text-foreground/70 hover:border-primary/40">
                <Image className="size-4" /> Image
              </button>
            </div>

            <div>
              <label className="block text-sm font-semibold text-foreground">Watermark text</label>
              <input
                defaultValue="CONFIDENTIAL"
                className="mt-2 w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-foreground">Opacity</label>
              <div className="mt-2 flex items-center gap-3">
                <input type="range" min={5} max={100} defaultValue={15} className="flex-1" />
                <span className="font-mono text-sm font-semibold text-primary">15%</span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-foreground">Rotation</label>
              <div className="mt-2 flex items-center gap-3">
                <input type="range" min={-90} max={90} defaultValue={-35} className="flex-1" />
                <span className="font-mono text-sm font-semibold text-primary">−35°</span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-foreground">Apply to</label>
              <select className="mt-2 w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary">
                <option>All pages</option>
                <option>First page only</option>
                <option>Custom range</option>
              </select>
            </div>

            <Button size="lg" className="w-full">
              <Layers className="size-4" />
              Apply watermark →
            </Button>
          </div>
        </div>
      </Card>
    </ToolPageShell>
  );
}
