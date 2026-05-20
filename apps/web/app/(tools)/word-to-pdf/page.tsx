import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Button } from "@converto/ui/components/button";
import { Card } from "@converto/ui/components/card";
import { ToolPageShell } from "@/components/tools/tool-page-shell";
import { getToolBySlug } from "@converto/data";
import { FileText, ArrowRight, CheckCircle2 } from "lucide-react";

export const metadata: Metadata = {
  title: "Word to PDF",
  description: "Convert Word documents to PDF. Pristine output, every font preserved.",
};

const features = [
  "Every font and image preserved",
  "Pixel-perfect layout",
  "Universal .pdf output",
];

export default function WordToPdfPage() {
  const tool = getToolBySlug("word-to-pdf");
  if (!tool) notFound();

  return (
    <ToolPageShell tool={tool} index="06" variant="font-perfect">
      <Card className="p-8">
        <div className="grid gap-10 md:grid-cols-2">
          <div className="flex flex-col gap-4">
            <div className="flex flex-1 flex-col items-center justify-center gap-4 rounded-xl border-2 border-dashed border-border bg-secondary/20 p-10 text-center transition-colors hover:border-primary/40">
              <div className="grid h-14 w-14 place-items-center rounded-xl bg-blue-50">
                <FileText className="size-7 text-blue-600" />
              </div>
              <div>
                <p className="font-bold text-foreground">Drop your .docx here</p>
                <p className="mt-1 text-sm text-muted-foreground">or click to browse</p>
              </div>
              <Button>Select Word file</Button>
            </div>
          </div>

          <div className="flex flex-col justify-center gap-6">
            <div>
              <p className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
                What you get
              </p>
              <div className="mt-4 flex flex-col gap-3">
                {features.map((f) => (
                  <div key={f} className="flex items-center gap-3">
                    <CheckCircle2 className="size-5 shrink-0 text-blue-500" />
                    <span className="text-sm font-medium text-foreground">{f}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-6 rounded-2xl bg-foreground p-5 text-background">
              <div className="text-center">
                <p className="font-mono text-xs uppercase text-background/60">Input</p>
                <p className="mt-1 font-bold">.DOCX</p>
              </div>
              <ArrowRight className="size-5 text-primary" />
              <div className="text-center">
                <p className="font-mono text-xs uppercase text-background/60">Output</p>
                <p className="mt-1 font-bold text-primary">.PDF</p>
              </div>
            </div>

            <Button size="lg" className="w-full">
              Convert to PDF →
            </Button>
          </div>
        </div>
      </Card>
    </ToolPageShell>
  );
}
