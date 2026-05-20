import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Button } from "@converto/ui/components/button";
import { Card } from "@converto/ui/components/card";
import { ToolPageShell } from "@/components/tools/tool-page-shell";
import { getToolBySlug } from "@converto/data";

export const metadata: Metadata = {
  title: "Split PDF",
  description: "Extract pages or chop a doc into pieces. Visual page picker.",
};

export default function SplitPage() {
  const tool = getToolBySlug("split");
  if (!tool) notFound();

  return (
    <ToolPageShell tool={tool} index="02" variant="visual picker">
      <Card className="p-8">
        <div className="flex flex-wrap gap-2">
          {["Extract pages", "Split by ranges", "Split every N"].map((tab, i) => (
            <Button
              key={tab}
              variant={i === 0 ? "default" : "outline"}
              size="sm"
              className="rounded-full"
            >
              <span className="mr-1 font-mono text-[10px] opacity-60">0{i + 1}</span> {tab}
            </Button>
          ))}
        </div>

        <div className="mt-8 grid grid-cols-4 gap-3 md:grid-cols-8">
          {Array.from({ length: 16 }).map((_, i) => (
            <div
              key={i}
              className="relative aspect-[3/4] rounded-md border-2 border-primary/30 bg-primary/5"
            >
              <span className="absolute right-1 top-1 grid h-5 w-5 place-items-center rounded-full bg-primary text-[10px] text-primary-foreground">
                ✓
              </span>
              <span className="absolute bottom-1 left-1 font-mono text-[10px] text-primary">
                {String(i + 1).padStart(2, "0")}
              </span>
            </div>
          ))}
        </div>

        <div className="mt-8 flex flex-col items-start justify-between gap-4 rounded-2xl border bg-secondary p-5 md:flex-row md:items-center">
          <div className="text-sm">
            <span className="text-primary">7</span> of 16 pages selected · Output:{" "}
            <strong>1 file, ~2.4 MB</strong>
          </div>
          <Button size="lg">Extract pages →</Button>
        </div>
      </Card>
    </ToolPageShell>
  );
}
