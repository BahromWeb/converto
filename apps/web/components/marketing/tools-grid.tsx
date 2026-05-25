"use client";

import Link from "next/link";
import {
  ArrowRight,
  GitMerge,
  Scissors,
  Minimize2,
  MessageSquare,
  FileText,
  Image,
  Pen,
  Lock,
  Unlock,
  Eye,
  Layers,
} from "lucide-react";
import { Button } from "@converto/ui/components/button";
import { cn } from "@converto/ui/lib/utils";
import { tools } from "@converto/data";
import type { Tool } from "@converto/types";
import { AnimateIn } from "@/components/ui/animate-in";
import { useT } from "@/lib/i18n/context";

type Category = Tool["category"];

const toolIcons: Record<string, React.ElementType> = {
  merge: GitMerge,
  split: Scissors,
  compress: Minimize2,
  chat: MessageSquare,
  "pdf-to-word": FileText,
  "word-to-pdf": FileText,
  "jpg-to-pdf": Image,
  sign: Pen,
  protect: Lock,
  unlock: Unlock,
  ocr: Eye,
  watermark: Layers,
};

const CATEGORY_ORDER: Category[] = ["organize", "convert", "edit", "secure", "ai"];

const categoryStyle: Record<Category, { iconBg: string; iconText: string }> = {
  organize: { iconBg: "bg-blue-50", iconText: "text-blue-600" },
  convert: { iconBg: "bg-emerald-50", iconText: "text-emerald-600" },
  edit: { iconBg: "bg-violet-50", iconText: "text-violet-600" },
  secure: { iconBg: "bg-amber-50", iconText: "text-amber-600" },
  ai: { iconBg: "bg-primary/10", iconText: "text-primary" },
};

export function ToolsGrid() {
  const t = useT();

  const categoryLabels: Record<Category, string> = {
    organize: t.categories.organize,
    convert: t.categories.convert,
    edit: t.categories.edit,
    secure: t.categories.secure,
    ai: t.categories.ai,
  };

  return (
    <section id="tools" className="bg-secondary/40 py-24">
      <div className="container">
        {/* Section header */}
        <AnimateIn animation="fade-up" className="mx-auto mb-14 max-w-2xl text-center">
          <span className="text-sm font-semibold text-primary">{t.toolsGrid.badge}</span>
          <h2 className="mt-2 text-4xl font-bold tracking-tight text-foreground md:text-5xl">
            {t.toolsGrid.heading}
          </h2>
          <p className="mt-4 text-muted-foreground">
            {t.toolsGrid.subheading}
          </p>
        </AnimateIn>

        {/* Category sections */}
        <div className="space-y-12">
          {CATEGORY_ORDER.map((category, catIdx) => {
            const catTools = tools.filter((tool) => tool.category === category);
            if (!catTools.length) return null;
            const style = categoryStyle[category];

            return (
              <div key={category}>
                <AnimateIn animation="slide-right" delay={catIdx * 60}>
                  <div className="mb-5 flex items-center gap-3">
                    <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                      {categoryLabels[category]}
                    </span>
                    <span className="h-px flex-1 bg-border" aria-hidden />
                  </div>
                </AnimateIn>

                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                  {catTools.map((tool, toolIdx) => {
                    const Icon = toolIcons[tool.slug] ?? FileText;
                    const isPopular = tool.badge === "popular";
                    const isAi = tool.badge === "new" || tool.badge === "ai";

                    return (
                      <AnimateIn
                        key={tool.slug}
                        animation="scale-in"
                        delay={catIdx * 60 + toolIdx * 50}
                      >
                        <Link
                          href={`/${tool.slug}`}
                          className={cn(
                            "group flex h-full flex-col gap-4 rounded-xl border bg-card p-5 shadow-sm transition-all duration-200",
                            "hover:-translate-y-1 hover:shadow-lg",
                            isPopular && "ring-1 ring-primary/25",
                          )}
                        >
                          <div className="flex items-start justify-between">
                            <span
                              className={cn(
                                "grid h-11 w-11 place-items-center rounded-xl transition-transform duration-200 group-hover:scale-110",
                                style.iconBg,
                                style.iconText,
                              )}
                            >
                              <Icon className="size-5" />
                            </span>
                            {tool.badge && (
                              <span
                                className={cn(
                                  "rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider",
                                  (isPopular || isAi) && "bg-primary/10 text-primary",
                                )}
                              >
                                {isAi ? "AI" : t.toolsGrid.popular}
                              </span>
                            )}
                          </div>
                          <div className="flex-1">
                            <p className="font-bold text-foreground">{tool.name}</p>
                            <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
                              {tool.description}
                            </p>
                          </div>
                          <span className="flex items-center gap-1 text-xs font-semibold text-primary opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                            {t.toolsGrid.openTool} <ArrowRight className="size-3" />
                          </span>
                        </Link>
                      </AnimateIn>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        {/* Browse all */}
        <AnimateIn animation="fade-up" delay={200} className="mt-14 flex justify-center">
          <Button
            variant="outline"
            size="lg"
            asChild
            className="transition-transform hover:scale-105"
          >
            <Link href="/tools">
              {t.toolsGrid.browseAll}
              <ArrowRight className="size-4" />
            </Link>
          </Button>
        </AnimateIn>
      </div>
    </section>
  );
}
