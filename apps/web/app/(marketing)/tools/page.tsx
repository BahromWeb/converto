import type { Metadata } from "next";
import Link from "next/link";
import {
  GitMerge,
  Scissors,
  Minimize2,
  FileX,
  FileOutput,
  RotateCw,
  Crop,
  ListOrdered,
  Type,
  LayoutGrid,
  SearchCheck,
  Tags,
  FileSearch,
  FileType,
  BookText,
  Sheet,
  FileSpreadsheet,
  Presentation,
  Projector,
  Images,
  ImageDown,
  FileCode,
  Code,
  Globe,
  Globe2,
  AlignLeft,
  Aperture,
  Pen,
  Droplets,
  QrCode,
  Lock,
  Unlock,
  Sparkles,
  MessageSquareText,
  BarChart3,
  MessagesSquare,
  ContactRound,
  ScanText,
  Languages,
  ClipboardCopy,
  Network,
  Briefcase,
  UserCheck,
  Mic,
  BadgeCheck,
  Mail,
  FileBadge,
  ScanLine,
  FileText,
  ArrowRight,
} from "lucide-react";
import { tools } from "@converto/data";
import type { Tool } from "@converto/types";
import { cn } from "@converto/ui/lib/utils";


// Marketing pages are mostly static — render at build time and revalidate hourly
// so the next-build picks up locale + tools.length changes within an hour.
export const revalidate = 3600

export const metadata: Metadata = {
  title: "All Tools",
  description: "37 free PDF tools — merge, split, compress, convert, sign, and more.",
  alternates: { canonical: "/tools" },
};

type Category = Tool["category"];

const toolIcons: Record<string, React.ElementType> = {
  // ORGANIZE — 13 tools
  merge:              GitMerge,
  split:              Scissors,
  compress:           Minimize2,
  removepage:         FileX,
  extract:            FileOutput,
  rotate:             RotateCw,
  crop:               Crop,
  "add-page-numbers": ListOrdered,
  "header-footer":    Type,
  nup:                LayoutGrid,
  inspect:            SearchCheck,
  metadata:           Tags,
  "detect-blank":     FileSearch,

  // CONVERT — 13 tools
  "pdf-to-word":      FileType,
  "word-to-pdf":      BookText,
  "pdf-to-excel":     Sheet,
  "excel-to-pdf":     FileSpreadsheet,
  "ppt-to-pdf":       Presentation,
  "pdf-to-ppt":       Projector,
  "jpg-to-pdf":       Images,
  "pdf-to-jpg":       ImageDown,
  "pdf-to-html":      FileCode,
  "html-to-pdf":      Code,
  "url-to-pdf":       Globe,
  "extract-text":     AlignLeft,
  "image-to-text":    Aperture,

  // EDIT — 3 tools
  sign:               Pen,
  watermark:          Droplets,
  "qr-code":          QrCode,

  // SECURE — 2 tools
  protect:            Lock,
  unlock:             Unlock,

  // AI / CHAT — 5 tools
  chat:               Sparkles,
  "chat-word":        MessageSquareText,
  "chat-excel":       BarChart3,
  "chat-powerpoint":  MessagesSquare,
  "chat-with-cv":     ContactRound,

  // OCR — 4 tools
  ocr:                ScanText,
  "ocr-detect-lang":  Languages,
  "ocr-extract-text": ClipboardCopy,
  "ocr-structured":   Network,

  // CAREER — 8 tools
  "cv-builder":       Briefcase,
  "cv-from-pdf":      UserCheck,
  "cv-voice":         Mic,
  "ats-check":        BadgeCheck,
  "cover-letter":     Mail,
  "resume-to-docx":   FileBadge,
  "resume-translate": Globe2,
  "scan-to-pdf":      ScanLine,
};

const CATEGORY_ORDER: Category[] = ["organize", "convert", "edit", "secure", "ai", "career"];

const categoryMeta: Record<Category, { label: string; iconBg: string; iconText: string }> = {
  organize: { label: "Organize", iconBg: "bg-blue-50", iconText: "text-blue-600" },
  convert: { label: "Convert", iconBg: "bg-emerald-50", iconText: "text-emerald-600" },
  edit: { label: "Edit", iconBg: "bg-violet-50", iconText: "text-violet-600" },
  secure: { label: "Secure", iconBg: "bg-amber-50", iconText: "text-amber-600" },
  ai: { label: "AI", iconBg: "bg-orange-50", iconText: "text-orange-600" },
  career: { label: "Career", iconBg: "bg-pink-50", iconText: "text-pink-600" },
};

export default function ToolsPage() {
  return (
    <div className="container py-16">
      <div className="mx-auto mb-14 max-w-2xl text-center">
        <span className="text-sm font-semibold text-primary">All tools · always free</span>
        <h1 className="mt-2 text-3xl font-bold tracking-tight text-foreground sm:text-4xl md:text-5xl lg:text-6xl">
          Every PDF tool you need
        </h1>
        <p className="mt-4 text-muted-foreground">
          No paywalls, no watermarks, no sign-up. Pick a tool and get to work.
        </p>
      </div>

      <div className="space-y-12">
        {CATEGORY_ORDER.map((category) => {
          const catTools = tools.filter((t) => t.category === category);
          if (!catTools.length) return null;
          const meta = categoryMeta[category];

          return (
            <div key={category}>
              <div className="mb-5 flex items-center gap-3">
                <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                  {meta.label}
                </span>
                <span className="h-px flex-1 bg-border" aria-hidden />
              </div>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {catTools.map((tool) => {
                  const Icon = toolIcons[tool.slug] ?? FileText;
                  const isPopular = tool.badge === "popular";

                  return (
                    <ToolCard
                      key={tool.slug}
                      tool={tool}
                      className={cn(
                        "group flex h-full flex-col gap-4 rounded-xl border bg-card p-5 shadow-sm transition-all duration-200",
                        !tool.comingSoon && "hover:-translate-y-1 hover:shadow-lg",
                        tool.comingSoon && "opacity-60 cursor-not-allowed",
                        isPopular && "ring-1 ring-primary/25",
                      )}
                    >
                      <div className="flex items-start justify-between">
                        <span
                          className={cn(
                            "grid h-11 w-11 place-items-center rounded-xl transition-transform duration-200 group-hover:scale-110",
                            meta.iconBg,
                            meta.iconText,
                          )}
                        >
                          <Icon className="size-5" />
                        </span>
                        {tool.badge && (
                          <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-primary">
                            {tool.badge === "popular" ? "Popular" : "AI"}
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
                        Open tool <ArrowRight className="size-3" />
                      </span>
                    </ToolCard>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function ToolCard({
  tool,
  className,
  children,
}: {
  tool: import("@converto/types").Tool;
  className?: string;
  children: React.ReactNode;
}) {
  if (tool.comingSoon) {
    return (
      <div className={className} aria-disabled="true" title="Coming soon">
        {children}
      </div>
    );
  }
  return (
    <Link href={`/${tool.slug}`} className={className}>
      {children}
    </Link>
  );
}
