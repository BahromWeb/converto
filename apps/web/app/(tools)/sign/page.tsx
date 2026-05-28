import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Button } from "@converto/ui/components/button";
import { Card } from "@converto/ui/components/card";
import { ToolPageShell } from "@/components/tools/tool-page-shell";
import { getToolBySlug } from "@converto/data";
import { Pen, Type, Upload } from "lucide-react";

export const metadata: Metadata = {
  title: "Sign PDF",
  description: "Add your signature to any PDF. Draw, type, or upload.",
  alternates: { canonical: "/sign" },
};

const signModes = [
  { icon: Pen, label: "Draw", desc: "Sign with your mouse or finger" },
  { icon: Type, label: "Type", desc: "Generate a typed signature" },
  { icon: Upload, label: "Upload", desc: "Use an image of your signature" },
];

export default function SignPage() {
  const tool = getToolBySlug("sign");
  if (!tool) notFound();

  return (
    <ToolPageShell tool={tool} index="08" variant="draw · type · upload">
      <Card className="p-8">
        <div className="grid gap-8 md:grid-cols-[1fr_280px]">
          {/* Document preview */}
          <div className="flex flex-col gap-4">
            <div className="relative min-h-72 rounded-xl border bg-white p-6 shadow-sm">
              <div className="space-y-2">
                {Array.from({ length: 8 }).map((_, i) => (
                  <div
                    key={i}
                    className="h-2 rounded bg-muted"
                    style={{ width: `${60 + Math.random() * 35}%` }}
                  />
                ))}
              </div>
              <div className="absolute bottom-6 left-6 right-6">
                <div className="mt-4 border-t-2 border-dashed border-muted pt-3">
                  <p className="font-mono text-xs text-muted-foreground">Click to place signature</p>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between rounded-2xl bg-foreground p-4 text-background">
              <p className="text-sm font-medium">Ready to sign</p>
              <Button size="sm">Download signed PDF →</Button>
            </div>
          </div>

          {/* Signature modes */}
          <div className="flex flex-col gap-4">
            <p className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
              Signature type
            </p>
            {signModes.map(({ icon: Icon, label, desc }) => (
              <button
                key={label}
                className="flex items-center gap-4 rounded-xl border bg-card p-4 text-left transition-all hover:border-primary/40 hover:bg-primary/5"
              >
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-amber-50">
                  <Icon className="size-5 text-amber-600" />
                </span>
                <div>
                  <p className="font-semibold text-foreground">{label}</p>
                  <p className="text-xs text-muted-foreground">{desc}</p>
                </div>
              </button>
            ))}

            <div className="mt-2 rounded-xl border-2 border-dashed border-border bg-secondary/30 p-6 text-center">
              <p className="text-xs text-muted-foreground">Signature preview</p>
              <div className="mt-3 h-12 w-full" />
            </div>
          </div>
        </div>
      </Card>
    </ToolPageShell>
  );
}
