import type { Metadata } from "next";
import { Button } from "@converto/ui/components/button";
import { Card } from "@converto/ui/components/card";
import { ToolPageShell } from "@/components/tools/tool-page-shell";
import { getToolBySlug } from "@converto/data";
import { notFound } from "next/navigation";

export const metadata: Metadata = {
  title: "Merge PDF",
  description: "Combine PDFs in the order you want. Drag, drop, done. No watermark.",
};

export default function MergePage() {
  const tool = getToolBySlug("merge");
  if (!tool) notFound();

  return (
    <ToolPageShell tool={tool} index="01" variant="drag-to-reorder">
      <Card className="p-8">
        <div className="grid grid-cols-2 gap-4 md:grid-cols-6">
          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className="relative aspect-[3/4] rounded-lg border bg-background p-3 text-xs"
            >
              <span className="absolute -left-2 -top-2 grid h-6 w-6 place-items-center rounded-full bg-foreground font-mono text-[10px] text-background">
                {i + 1}
              </span>
              <div className="mt-4 h-1 w-full rounded bg-muted" />
              <div className="mt-1 h-1 w-3/4 rounded bg-muted" />
              <div className="mt-1 h-1 w-5/6 rounded bg-muted" />
            </div>
          ))}
          <div className="grid aspect-[3/4] place-items-center rounded-lg border-2 border-dashed text-sm text-muted-foreground">
            + Add more
          </div>
        </div>

        <div className="mt-8 flex flex-col items-start justify-between gap-4 rounded-2xl bg-foreground p-5 text-background md:flex-row md:items-center">
          <div className="flex flex-wrap gap-x-6 gap-y-1 font-mono text-xs uppercase tracking-wider">
            <span>
              <span className="text-primary">5</span> files
            </span>
            <span>
              <span className="text-primary">24</span> pages
            </span>
            <span>
              <span className="text-primary">~6.5MB</span> output
            </span>
            <span>
              <span className="text-primary">~3s</span> estimated
            </span>
          </div>
          <Button size="lg">Merge now →</Button>
        </div>
      </Card>
    </ToolPageShell>
  );
}
