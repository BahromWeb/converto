import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { Button } from "@converto/ui/components/button";
import { Card } from "@converto/ui/components/card";
import { ToolPageShell } from "@/components/tools/tool-page-shell";
import { getToolBySlug } from "@converto/data";

export const metadata: Metadata = {
  title: "Compress PDF",
  description: "Smaller PDFs, same quality. Live preview of file size as you adjust.",
};

const presets = [
  { name: "Light", desc: "~30% smaller" },
  { name: "Recommended", desc: "~75% smaller", active: true },
  { name: "Extreme", desc: "~92% smaller" },
];

export default function CompressPage() {
  const tool = getToolBySlug("compress");
  if (!tool) notFound();

  return (
    <ToolPageShell tool={tool} index="03" variant="live quality">
      <Card className="grid gap-8 p-8 md:grid-cols-2">
        <div>
          <p className="font-mono text-xs uppercase tracking-wider text-muted-foreground">
            → output quality
          </p>
          <div className="mt-2 flex items-baseline gap-1">
            <span className="font-serif text-6xl text-primary">62</span>
            <span className="font-serif text-2xl text-primary">%</span>
          </div>
          <p className="mt-1 text-sm text-muted-foreground">
            Selected: <span className="font-medium text-foreground">Recommended</span>
          </p>

          <div className="mt-6 h-1 w-full overflow-hidden rounded-full bg-secondary">
            <div className="h-full w-[62%] rounded-full bg-primary" />
          </div>

          <div className="mt-6 grid grid-cols-3 gap-3">
            {presets.map((p) => (
              <Button
                key={p.name}
                variant={p.active ? "default" : "outline"}
                size="sm"
                className="flex h-auto flex-col gap-0.5 rounded-xl py-3"
              >
                <span className="text-sm font-semibold">{p.name}</span>
                <span className="text-[11px] opacity-70">{p.desc}</span>
              </Button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-3 items-center gap-6 rounded-2xl bg-foreground p-6 text-background">
          <div>
            <p className="font-mono text-xs uppercase text-background/60">→ original</p>
            <p className="mt-2 font-serif text-4xl">
              24.6<span className="text-base">MB</span>
            </p>
          </div>
          <div className="text-center">
            <span className="grid h-9 w-9 place-items-center rounded-full border border-background/30">
              <ArrowRight className="size-4" />
            </span>
            <p className="mt-2 font-serif text-lg text-primary">−81%</p>
            <p className="font-mono text-[10px] uppercase text-background/60">reduction</p>
          </div>
          <div>
            <p className="font-mono text-xs uppercase text-background/60">→ after</p>
            <p className="mt-2 font-serif text-4xl text-primary">
              4.7<span className="text-base">MB</span>
            </p>
          </div>
        </div>
      </Card>
    </ToolPageShell>
  );
}
