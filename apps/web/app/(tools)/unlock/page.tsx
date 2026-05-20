import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Button } from "@converto/ui/components/button";
import { Card } from "@converto/ui/components/card";
import { ToolPageShell } from "@/components/tools/tool-page-shell";
import { getToolBySlug } from "@converto/data";
import { Unlock, ShieldOff } from "lucide-react";

export const metadata: Metadata = {
  title: "Unlock PDF",
  description: "Remove the password from a PDF you own. Fast and secure.",
};

export default function UnlockPage() {
  const tool = getToolBySlug("unlock");
  if (!tool) notFound();

  return (
    <ToolPageShell tool={tool} index="10" variant="password removal">
      <Card className="p-8">
        <div className="mx-auto max-w-md">
          <div className="flex flex-col items-center gap-6 text-center">
            <div className="grid h-20 w-20 place-items-center rounded-2xl bg-amber-50">
              <Unlock className="size-10 text-amber-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-foreground">Upload your protected PDF</h2>
              <p className="mt-2 text-sm text-muted-foreground">
                Enter the password and we'll strip the lock so you can work freely.
              </p>
            </div>

            <div className="w-full rounded-xl border-2 border-dashed border-border bg-secondary/30 p-8 text-center transition-colors hover:border-primary/40">
              <p className="text-sm font-medium text-muted-foreground">Drop your PDF here or</p>
              <Button size="sm" className="mt-3">
                Choose file
              </Button>
            </div>

            <div className="w-full">
              <label className="block text-left text-sm font-semibold text-foreground">
                PDF Password
              </label>
              <input
                type="password"
                placeholder="Enter the document password"
                className="mt-2 w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm outline-none ring-0 transition-colors focus:border-primary focus:ring-1 focus:ring-primary"
              />
            </div>

            <div className="flex w-full items-center gap-2 rounded-xl bg-amber-50 p-4 text-left">
              <ShieldOff className="size-4 shrink-0 text-amber-600" />
              <p className="text-xs text-amber-800">
                Only unlock PDFs you own or have explicit permission to modify.
              </p>
            </div>

            <Button size="lg" className="w-full">
              Unlock PDF →
            </Button>
          </div>
        </div>
      </Card>
    </ToolPageShell>
  );
}
