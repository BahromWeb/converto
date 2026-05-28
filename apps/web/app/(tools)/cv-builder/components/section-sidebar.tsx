"use client";

import { useState } from "react";
import {
  User,
  FileText,
  Briefcase,
  GraduationCap,
  Wrench,
  Globe,
  FolderGit2,
  Award,
  BadgeCheck,
  Heart,
  ChevronUp,
  ChevronDown,
  Trash2,
  Plus,
} from "lucide-react";
import type { CVSection } from "@/lib/cv/types";

const SECTION_TYPES = [
  { type: "personal",       label: "Personal",       icon: User },
  { type: "summary",        label: "Summary",        icon: FileText },
  { type: "experience",     label: "Experience",     icon: Briefcase },
  { type: "education",      label: "Education",      icon: GraduationCap },
  { type: "skills",         label: "Skills",         icon: Wrench },
  { type: "languages",      label: "Languages",      icon: Globe },
  { type: "projects",       label: "Projects",       icon: FolderGit2 },
  { type: "awards",         label: "Awards",         icon: Award },
  { type: "certifications", label: "Certifications", icon: BadgeCheck },
  { type: "volunteer",      label: "Volunteer",      icon: Heart },
];

function iconFor(type: string) {
  return SECTION_TYPES.find((t) => t.type === type)?.icon ?? FileText;
}
function labelFor(type: string) {
  return SECTION_TYPES.find((t) => t.type === type)?.label ?? type;
}

export function SectionSidebar({
  sections,
  activeID,
  atsScore,
  onPick,
  onAdd,
  onDelete,
  onReorder,
}: {
  sections: CVSection[];
  activeID: string | null;
  atsScore?: number;
  onPick: (id: string) => void;
  onAdd: (type: string) => void;
  onDelete: (id: string) => void;
  onReorder: (next: CVSection[]) => void;
}) {
  const [showAddMenu, setShowAddMenu] = useState(false);
  const presentTypes = new Set(sections.map((s) => s.section_type));

  function move(idx: number, dir: -1 | 1) {
    const j = idx + dir;
    if (j < 0 || j >= sections.length) return;
    const next = [...sections];
    const tmp = next[idx]!;
    next[idx] = next[j]!;
    next[j] = tmp;
    onReorder(next);
  }

  return (
    <aside className="flex flex-col gap-3 overflow-hidden rounded-2xl border bg-card">
      <div className="border-b p-3">
        <h2 className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
          Sections
        </h2>
      </div>

      <div className="flex-1 overflow-y-auto px-2">
        {sections.length === 0 && (
          <p className="px-3 py-6 text-center text-xs text-muted-foreground">
            No sections yet — pick one below.
          </p>
        )}
        {sections.map((s, idx) => {
          const Icon = iconFor(s.section_type);
          const active = s.id === activeID;
          return (
            <div key={s.id} className="group relative">
              <button
                type="button"
                onClick={() => onPick(s.id)}
                className={`flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-left text-sm transition-colors ${
                  active
                    ? "bg-primary/[0.08] font-semibold text-primary"
                    : "hover:bg-accent"
                }`}
              >
                <Icon className="size-3.5 shrink-0" />
                <span className="flex-1 truncate">{labelFor(s.section_type)}</span>
              </button>
              {/* Reorder + delete row controls */}
              <div className="absolute right-1 top-1/2 hidden -translate-y-1/2 items-center gap-0.5 group-hover:flex">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    move(idx, -1);
                  }}
                  className="grid size-5 place-items-center rounded text-muted-foreground hover:bg-background hover:text-foreground"
                  aria-label="Move up"
                >
                  <ChevronUp className="size-3" />
                </button>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    move(idx, 1);
                  }}
                  className="grid size-5 place-items-center rounded text-muted-foreground hover:bg-background hover:text-foreground"
                  aria-label="Move down"
                >
                  <ChevronDown className="size-3" />
                </button>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete(s.id);
                  }}
                  className="grid size-5 place-items-center rounded text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                  aria-label="Delete"
                >
                  <Trash2 className="size-3" />
                </button>
              </div>
            </div>
          );
        })}

        {/* Add new section */}
        <div className="mt-2 border-t pt-2">
          <button
            type="button"
            onClick={() => setShowAddMenu((v) => !v)}
            className="flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-left text-sm font-semibold text-muted-foreground hover:bg-accent hover:text-foreground"
          >
            <Plus className="size-3.5" />
            Add section
          </button>
          {showAddMenu && (
            <div className="mt-1 space-y-1 px-1 pb-2">
              {SECTION_TYPES.filter((t) => !presentTypes.has(t.type)).map((t) => {
                const Icon = t.icon;
                return (
                  <button
                    key={t.type}
                    type="button"
                    onClick={() => {
                      onAdd(t.type);
                      setShowAddMenu(false);
                    }}
                    className="flex w-full items-center gap-2 rounded px-2 py-1.5 text-left text-xs hover:bg-secondary/40"
                  >
                    <Icon className="size-3" />
                    {t.label}
                  </button>
                );
              })}
              {SECTION_TYPES.every((t) => presentTypes.has(t.type)) && (
                <p className="px-2 py-1.5 text-[10px] text-muted-foreground">
                  All section types already in use.
                </p>
              )}
            </div>
          )}
        </div>
      </div>

      {/* ATS chip */}
      {atsScore != null && (
        <div className="border-t p-3">
          <div className="rounded-lg border bg-secondary/30 p-3 text-center">
            <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
              ATS score
            </p>
            <p
              className={`mt-1 text-2xl font-bold ${
                atsScore >= 80
                  ? "text-emerald-600"
                  : atsScore >= 60
                    ? "text-amber-600"
                    : "text-destructive"
              }`}
            >
              {atsScore}
              <span className="text-sm font-normal text-muted-foreground">
                /100
              </span>
            </p>
          </div>
        </div>
      )}
    </aside>
  );
}
