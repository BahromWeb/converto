import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Button } from "@converto/ui/components/button";
import { Card } from "@converto/ui/components/card";
import { ToolPageShell } from "@/components/tools/tool-page-shell";
import { getToolBySlug } from "@converto/data";
import { Lock, Eye, EyeOff, ShieldCheck } from "lucide-react";

export const metadata: Metadata = {
  title: "Protect PDF",
  description: "Password-lock your PDF with AES-256 encryption.",
};

export default function ProtectPage() {
  const tool = getToolBySlug("protect");
  if (!tool) notFound();

  return (
    <ToolPageShell tool={tool} index="09" variant="AES-256">
      <Card className="p-8">
        <div className="mx-auto max-w-md">
          <div className="flex flex-col gap-6">
            <div className="flex flex-col items-center justify-center gap-4 rounded-xl border-2 border-dashed border-border bg-secondary/20 p-8 text-center transition-colors hover:border-primary/40">
              <div className="grid h-14 w-14 place-items-center rounded-xl bg-amber-50">
                <Lock className="size-7 text-amber-600" />
              </div>
              <div>
                <p className="font-bold text-foreground">Drop your PDF here</p>
                <p className="mt-1 text-sm text-muted-foreground">or click to browse</p>
              </div>
              <Button>Select PDF</Button>
            </div>

            <div className="flex flex-col gap-4">
              <div>
                <label className="block text-sm font-semibold text-foreground">Password</label>
                <div className="relative mt-2">
                  <input
                    type="password"
                    placeholder="Enter a strong password"
                    className="w-full rounded-lg border border-border bg-background px-4 py-2.5 pr-10 text-sm outline-none transition-colors focus:border-primary focus:ring-1 focus:ring-primary"
                  />
                  <button className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                    <Eye className="size-4" />
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-foreground">
                  Confirm password
                </label>
                <div className="relative mt-2">
                  <input
                    type="password"
                    placeholder="Repeat the password"
                    className="w-full rounded-lg border border-border bg-background px-4 py-2.5 pr-10 text-sm outline-none transition-colors focus:border-primary focus:ring-1 focus:ring-primary"
                  />
                  <button className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                    <EyeOff className="size-4" />
                  </button>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 rounded-xl bg-amber-50 p-4">
              <ShieldCheck className="size-4 shrink-0 text-amber-600" />
              <p className="text-xs text-amber-800">
                Encrypted with AES-256. We never store your password.
              </p>
            </div>

            <Button size="lg" className="w-full">
              Lock PDF →
            </Button>
          </div>
        </div>
      </Card>
    </ToolPageShell>
  );
}
