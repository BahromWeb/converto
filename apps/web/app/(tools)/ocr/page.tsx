import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Button } from "@converto/ui/components/button";
import { Card } from "@converto/ui/components/card";
import { ToolPageShell } from "@/components/tools/tool-page-shell";
import { getToolBySlug } from "@converto/data";
import { Eye, Sparkles, Languages } from "lucide-react";

export const metadata: Metadata = {
  title: "OCR PDF",
  description: "Make scanned PDFs searchable and copy-pasteable with AI OCR.",
};

const languages = ["English", "French", "German", "Spanish", "Arabic", "Chinese", "Japanese"];

export default function OcrPage() {
  const tool = getToolBySlug("ocr");
  if (!tool) notFound();

  return (
    <ToolPageShell tool={tool} index="11" variant="AI-powered">
      <Card className="p-8">
        <div className="grid gap-8 md:grid-cols-2">
          {/* Upload */}
          <div className="flex flex-col gap-6">
            <div className="flex flex-1 flex-col items-center justify-center gap-4 rounded-xl border-2 border-dashed border-border bg-secondary/20 p-10 text-center transition-colors hover:border-primary/40">
              <div className="grid h-14 w-14 place-items-center rounded-xl bg-primary/10">
                <Eye className="size-7 text-primary" />
              </div>
              <div>
                <p className="font-bold text-foreground">Drop your scanned PDF</p>
                <p className="mt-1 text-sm text-muted-foreground">or an image (JPG, PNG, TIFF)</p>
              </div>
              <Button>Select file</Button>
            </div>

            <div>
              <label className="flex items-center gap-2 text-sm font-semibold text-foreground">
                <Languages className="size-4" /> Document language
              </label>
              <select className="mt-2 w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary">
                {languages.map((l) => (
                  <option key={l}>{l}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Preview / result */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2">
              <Sparkles className="size-4 text-primary" />
              <p className="text-sm font-semibold text-foreground">Extracted text preview</p>
            </div>
            <div className="flex-1 rounded-xl border bg-secondary/20 p-5">
              <div className="space-y-2 opacity-40">
                {Array.from({ length: 7 }).map((_, i) => (
                  <div
                    key={i}
                    className="h-2 rounded bg-foreground"
                    style={{ width: `${50 + (i * 13) % 45}%` }}
                  />
                ))}
              </div>
              <p className="mt-6 text-center text-xs text-muted-foreground">
                Upload a file to see the extracted text
              </p>
            </div>

            <Button size="lg" className="w-full">
              Run OCR →
            </Button>
          </div>
        </div>
      </Card>
    </ToolPageShell>
  );
}
