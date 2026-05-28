"use client";

import { useCallback, useMemo, useRef, useState } from "react";
import {
  Loader2,
  AlertCircle,
  Download,
  Palette,
  CheckSquare,
  Languages,
  
  Plus,
} from "lucide-react";
import { SectionSidebar } from "./section-sidebar";
import { SectionEditor } from "./section-editor";
import { PreviewPane } from "./preview-pane";
import { TemplateModal } from "./template-modal";
import { ExportModal } from "./export-modal";
import { ATSModal } from "./ats-modal";
import { VoiceMode } from "./voice-mode";
import {
  addCVSection,
  deleteCVSection,
  updateCVSection,
  updateCVSession,
  reorderCVSections,
} from "@/lib/cv/api";
import type { CVSection, CVSessionDetail } from "@/lib/cv/types";

/**
 * Main 3-column CV editor. Left rail = section list + ATS chip; middle
 * = active section's form; right = live HTML preview iframe.
 *
 * Each state-mutating handler optimistically updates the local detail
 * object then fires-and-forgets the API; the parent refreshes the
 * canonical view from the server periodically (auto-save bounce).
 */
export function CVEditor({
  detail: initialDetail,
  voiceMode,
  onRefresh,
}: {
  detail: CVSessionDetail;
  voiceMode: boolean;
  onRefresh: () => void;
}) {
  const [detail, setDetail] = useState<CVSessionDetail>(initialDetail);
  const [activeSectionID, setActiveSectionID] = useState<string | null>(
    initialDetail.sections[0]?.id ?? null,
  );
  const [previewTick, setPreviewTick] = useState(0);
  const [showTemplate, setShowTemplate] = useState(false);
  const [showExport, setShowExport] = useState(false);
  const [showATS, setShowATS] = useState(false);
  const [showVoice, setShowVoice] = useState(voiceMode);
  const [error, setError] = useState<string | null>(null);

  // Keep parent + local detail in sync (parent polls during parsing).
  useMemo(() => setDetail(initialDetail), [initialDetail]);

  const activeSection = useMemo(
    () => detail.sections.find((s) => s.id === activeSectionID) ?? null,
    [detail.sections, activeSectionID],
  );

  // Debounce save: collect rapid edits then flush after 800ms idle.
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const handleSectionChange = useCallback(
    (sectionID: string, newContent: Record<string, unknown>) => {
      setDetail((d) => ({
        ...d,
        sections: d.sections.map((s) =>
          s.id === sectionID ? { ...s, content: newContent } : s,
        ),
      }));
      if (saveTimer.current) clearTimeout(saveTimer.current);
      saveTimer.current = setTimeout(() => {
        updateCVSection(detail.id, sectionID, newContent)
          .then(() => {
            setPreviewTick((t) => t + 1);
            setError(null);
          })
          .catch(() =>
            setError("Couldn't save — your edits are still local"),
          );
      }, 800);
    },
    [detail.id],
  );

  const handleAddSection = useCallback(
    async (type: string) => {
      try {
        const sec = await addCVSection(detail.id, {
          section_type: type,
          sort_order: detail.sections.length,
          content: emptyContentFor(type),
        });
        setDetail((d) => ({ ...d, sections: [...d.sections, sec] }));
        setActiveSectionID(sec.id);
      } catch (e) {
        setError(e instanceof Error ? e.message : "Failed to add section");
      }
    },
    [detail.id, detail.sections.length],
  );

  const handleDeleteSection = useCallback(
    async (sectionID: string) => {
      if (!confirm("Delete this section?")) return;
      try {
        await deleteCVSection(detail.id, sectionID);
        setDetail((d) => ({
          ...d,
          sections: d.sections.filter((s) => s.id !== sectionID),
        }));
        if (activeSectionID === sectionID) {
          setActiveSectionID(detail.sections[0]?.id ?? null);
        }
      } catch {
        setError("Couldn't delete section");
      }
    },
    [detail.id, detail.sections, activeSectionID],
  );

  const handleReorder = useCallback(
    async (newOrder: CVSection[]) => {
      setDetail((d) => ({ ...d, sections: newOrder }));
      await reorderCVSections(detail.id, newOrder.map((s) => s.id)).catch(() =>
        setError("Couldn't reorder"),
      );
    },
    [detail.id],
  );

  const handleTemplatePick = useCallback(
    async (templateID: string) => {
      setDetail((d) => ({ ...d, template_id: templateID }));
      setShowTemplate(false);
      await updateCVSession(detail.id, { template_id: templateID }).catch(() =>
        setError("Couldn't apply template"),
      );
    },
    [detail.id],
  );

  // ─── Indexing / parsing states ───────────────────────────────────────
  if (detail.status === "parsing") {
    return (
      <div className="container py-16">
        <div className="mx-auto max-w-md text-center">
          <Loader2 className="mx-auto size-8 animate-spin text-primary" />
          <h2 className="mt-4 text-lg font-bold">Reading your CV…</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Extracting text, asking AI to structure it. Usually 5–15 seconds.
          </p>
        </div>
      </div>
    );
  }

  if (detail.status === "failed") {
    return (
      <div className="container py-16">
        <div className="mx-auto max-w-md rounded-2xl border border-destructive/30 bg-destructive/5 p-6 text-center">
          <AlertCircle className="mx-auto size-6 text-destructive" />
          <h2 className="mt-3 text-lg font-bold text-destructive">
            Couldn&apos;t parse the upload
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">{detail.parse_error}</p>
        </div>
      </div>
    );
  }

  // ─── Voice mode overlay ─────────────────────────────────────────────
  if (showVoice) {
    return (
      <VoiceMode
        cvID={detail.id}
        locale={detail.locale}
        onDone={() => {
          setShowVoice(false);
          onRefresh(); setPreviewTick((t) => t + 1);
        }}
      />
    );
  }

  // ─── Main 3-column layout ───────────────────────────────────────────
  return (
    <div className="container py-4">
      {/* Top toolbar */}
      <header className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <input
          type="text"
          value={detail.title}
          onChange={(e) =>
            setDetail((d) => ({ ...d, title: e.target.value }))
          }
          onBlur={(e) =>
            updateCVSession(detail.id, { title: e.target.value }).catch(() =>
              setError("Couldn't save title"),
            )
          }
          className="border-0 bg-transparent text-2xl font-bold outline-none focus:bg-accent/30 px-1 rounded"
        />
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => setShowATS(true)}
            className="inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-sm font-semibold transition-colors hover:bg-accent"
          >
            <CheckSquare className="size-3.5" />
            ATS check
            {detail.ats_score != null && (
              <span className="ml-1 rounded-full bg-primary/10 px-1.5 py-0.5 text-[10px] text-primary">
                {detail.ats_score}
              </span>
            )}
          </button>
          <button
            type="button"
            onClick={() => setShowTemplate(true)}
            className="inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-sm font-semibold transition-colors hover:bg-accent"
          >
            <Palette className="size-3.5" />
            Template
          </button>
          <button
            type="button"
            onClick={() => setShowVoice(true)}
            className="inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-sm font-semibold transition-colors hover:bg-accent"
            title="Add more by speaking"
          >
            <Languages className="size-3.5" />
            Voice
          </button>
          <button
            type="button"
            onClick={() => setShowExport(true)}
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-1.5 text-sm font-semibold text-primary-foreground hover:opacity-90"
          >
            <Download className="size-3.5" />
            Export
          </button>
        </div>
      </header>

      {error && (
        <div className="mb-3 flex items-start gap-2 rounded-lg border border-destructive/30 bg-destructive/5 p-2 text-sm">
          <AlertCircle className="mt-0.5 size-4 shrink-0 text-destructive" />
          <p className="text-destructive">{error}</p>
          <button onClick={() => setError(null)} className="ml-auto text-xs hover:underline">
            dismiss
          </button>
        </div>
      )}

      <div className="grid h-[calc(100vh-220px)] min-h-[600px] grid-cols-[240px_1fr_1fr] gap-4">
        <SectionSidebar
          sections={detail.sections}
          activeID={activeSectionID}
          atsScore={detail.ats_score}
          onPick={setActiveSectionID}
          onAdd={handleAddSection}
          onDelete={handleDeleteSection}
          onReorder={handleReorder}
        />
        <div className="overflow-y-auto rounded-2xl border bg-card p-5">
          {activeSection ? (
            <SectionEditor
              cvID={detail.id}
              section={activeSection}
              onChange={(c) => handleSectionChange(activeSection.id, c)}
            />
          ) : (
            <EmptySectionState onAdd={handleAddSection} />
          )}
        </div>
        <PreviewPane cvID={detail.id} templateID={detail.template_id} tick={previewTick} />
      </div>

      {showTemplate && (
        <TemplateModal
          currentID={detail.template_id}
          onPick={handleTemplatePick}
          onClose={() => setShowTemplate(false)}
        />
      )}
      {showExport && (
        <ExportModal
          cvID={detail.id}
          onClose={() => setShowExport(false)}
        />
      )}
      {showATS && (
        <ATSModal
          cvID={detail.id}
          onClose={() => setShowATS(false)}
          onRunComplete={() => onRefresh()}
        />
      )}
    </div>
  );
}

function EmptySectionState({ onAdd }: { onAdd: (type: string) => void }) {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-3 text-center text-muted-foreground">
      <Plus className="size-8 opacity-40" />
      <p className="text-sm">No section selected.</p>
      <p className="text-xs">Click a section on the left or add a new one.</p>
      <div className="mt-4 flex flex-wrap justify-center gap-2">
        {["personal", "summary", "experience", "education", "skills"].map((t) => (
          <button
            key={t}
            onClick={() => onAdd(t)}
            className="rounded-md border bg-secondary/30 px-2.5 py-1 text-xs font-semibold capitalize transition-colors hover:border-primary/40 hover:text-primary"
          >
            + {t}
          </button>
        ))}
      </div>
    </div>
  );
}

// ─── Empty-content templates per section type ─────────────────────────
function emptyContentFor(type: string): Record<string, unknown> {
  switch (type) {
    case "personal":
      return { name: "", title: "", email: "", phone: "", location: "" };
    case "summary":
      return { text: "" };
    case "experience":
    case "education":
    case "languages":
    case "projects":
    case "awards":
    case "certifications":
      return { items: [] };
    case "skills":
      return { technical: [], soft: [] };
    default:
      return {};
  }
}
