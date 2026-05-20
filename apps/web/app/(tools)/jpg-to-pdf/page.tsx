import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Button } from "@converto/ui/components/button";
import { Card } from "@converto/ui/components/card";
import { ToolPageShell } from "@/components/tools/tool-page-shell";
import { getToolBySlug } from "@converto/data";
import { Image, ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "JPG to PDF",
  description: "Bundle photos and scans into a single clean PDF.",
};

export default function JpgToPdfPage() {
  const tool = getToolBySlug("jpg-to-pdf");
  if (!tool) notFound();

  return (
    <ToolPageShell tool={tool} index="07" variant="multi-image">
      <Card className="p-8">
        <div className="flex flex-col items-center justify-center gap-4 rounded-xl border-2 border-dashed border-border bg-secondary/20 p-10 text-center transition-colors hover:border-primary/40">
          <div className="grid h-14 w-14 place-items-center rounded-xl bg-emerald-50">
            <Image className="size-7 text-emerald-600" />
          </div>
          <div>
            <p className="font-bold text-foreground">Drop your images here</p>
            <p className="mt-1 text-sm text-muted-foreground">
              JPG, PNG, WEBP — up to 20 images at once
            </p>
          </div>
          <Button>Select images</Button>
        </div>

        <div className="mt-8 grid grid-cols-4 gap-3 md:grid-cols-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="relative aspect-square overflow-hidden rounded-lg border bg-secondary"
            >
              <div className="absolute inset-0 flex items-center justify-center">
                <Image className="size-6 text-muted-foreground/40" />
              </div>
              <span className="absolute bottom-1 right-1 rounded bg-foreground/70 px-1.5 py-0.5 font-mono text-[10px] text-background">
                {i + 1}
              </span>
            </div>
          ))}
          <div className="grid aspect-square place-items-center rounded-lg border-2 border-dashed text-xs text-muted-foreground">
            + Add
          </div>
        </div>

        <div className="mt-8 flex flex-col items-start justify-between gap-4 rounded-2xl bg-foreground p-5 text-background md:flex-row md:items-center">
          <div className="flex flex-wrap gap-x-6 gap-y-1 font-mono text-xs uppercase tracking-wider">
            <span>
              <span className="text-primary">4</span> images
            </span>
            <span className="flex items-center gap-2">
              <ArrowRight className="size-3" />
              <span className="text-primary">1</span> PDF
            </span>
          </div>
          <Button size="lg">Create PDF →</Button>
        </div>
      </Card>
    </ToolPageShell>
  );
}
