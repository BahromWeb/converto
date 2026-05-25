"use client";

import { notFound } from "next/navigation";
import { Button } from "@converto/ui/components/button";
import { Card } from "@converto/ui/components/card";
import { ToolPageShell } from "@/components/tools/tool-page-shell";
import { getToolBySlug } from "@converto/data";
import { Send, FileText, Sparkles } from "lucide-react";
import { useT } from "@/lib/i18n/context";

export default function ChatPage() {
  const t = useT();
  const tool = getToolBySlug("chat");
  if (!tool) notFound();

  const suggestions = [
    t.chat.suggest1,
    t.chat.suggest2,
    t.chat.suggest3,
    t.chat.suggest4,
  ];

  return (
    <ToolPageShell tool={tool} index="04" variant="AI-powered">
      <Card className="overflow-hidden p-0">
        <div className="grid md:grid-cols-[280px_1fr]">
          {/* Sidebar */}
          <div className="border-r bg-secondary/30 p-5">
            <div className="flex items-center gap-2 rounded-xl border-2 border-dashed border-border p-4 text-center transition-colors hover:border-primary/40">
              <FileText className="size-5 shrink-0 text-muted-foreground" />
              <div className="text-left">
                <p className="text-xs font-semibold text-foreground">{t.chat.noFileLoaded}</p>
                <p className="text-xs text-muted-foreground">{t.chat.uploadToStart}</p>
              </div>
            </div>
            <Button size="sm" className="mt-3 w-full">
              {t.chat.uploadPdf}
            </Button>
            <div className="mt-6">
              <p className="mb-3 text-xs font-bold uppercase tracking-widest text-muted-foreground">
                {t.chat.suggestions}
              </p>
              <div className="flex flex-col gap-2">
                {suggestions.map((s) => (
                  <button
                    key={s}
                    className="rounded-lg border bg-card px-3 py-2 text-left text-xs font-medium text-foreground/80 transition-colors hover:border-primary/40 hover:text-primary"
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Chat area */}
          <div className="flex flex-col">
            <div className="flex flex-1 flex-col items-center justify-center gap-4 p-10 text-center">
              <div className="grid h-14 w-14 place-items-center rounded-2xl bg-primary/10">
                <Sparkles className="size-7 text-primary" />
              </div>
              <div>
                <p className="font-bold text-foreground">{t.chat.uploadToChat}</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  {t.chat.uploadSubtitle}
                </p>
              </div>
            </div>

            {/* Input bar */}
            <div className="border-t p-4">
              <div className="flex items-center gap-2 rounded-xl border bg-background px-4 py-2.5">
                <input
                  className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
                  placeholder={t.chat.askPlaceholder}
                />
                <Button size="sm" className="shrink-0">
                  <Send className="size-3.5" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </ToolPageShell>
  );
}
