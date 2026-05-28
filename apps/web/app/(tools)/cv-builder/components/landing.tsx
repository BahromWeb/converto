"use client";

import { useRef, useState, type DragEvent } from "react";
import Link from "next/link";
import {
  Upload,
  Sparkles,
  Mic,
  Loader2,
  AlertCircle,
  ArrowRight,
} from "lucide-react";

/**
 * CV Builder landing — three CTA cards. The fourth row offers a Linked
 * direct link (placeholder for the next sprint's profile-import flow).
 */
export function CVLanding({
  busy,
  error,
  onScratch,
  onImport,
  onVoice,
}: {
  busy: boolean;
  error: string | null;
  onScratch: () => void;
  onImport: (file: File) => void;
  onVoice: () => void;
}) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [dragging, setDragging] = useState(false);

  function onDrop(e: DragEvent<HTMLDivElement>) {
    e.preventDefault();
    setDragging(false);
    const f = e.dataTransfer.files?.[0];
    if (f) onImport(f);
  }

  return (
    <div className="container py-8 lg:py-12">
      <div className="grid gap-4 md:grid-cols-3">
        {/* Upload existing */}
        <div
          role="button"
          tabIndex={0}
          onClick={() => inputRef.current?.click()}
          onKeyDown={(e) =>
            (e.key === "Enter" || e.key === " ") && inputRef.current?.click()
          }
          onDragOver={(e) => {
            e.preventDefault();
            setDragging(true);
          }}
          onDragLeave={() => setDragging(false)}
          onDrop={onDrop}
          className={`group flex cursor-pointer flex-col gap-4 rounded-2xl border-2 border-dashed p-8 transition-all ${
            dragging
              ? "border-primary bg-primary/5 scale-[1.01]"
              : "border-border bg-card hover:border-primary/40 hover:-translate-y-0.5 hover:shadow-md"
          } ${busy ? "pointer-events-none opacity-70" : ""}`}
        >
          <div className="grid size-12 place-items-center rounded-xl bg-primary/10 text-primary">
            <Upload className="size-6" />
          </div>
          <div>
            <h2 className="text-lg font-bold">Upload existing CV</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              PDF / Word / scanned image — we parse it, you redesign.
            </p>
          </div>
          <span className="mt-auto inline-flex items-center gap-1 text-xs font-semibold text-primary">
            {busy ? (
              <>
                <Loader2 className="size-3 animate-spin" /> Preparing…
              </>
            ) : (
              <>
                Drop a file or click <ArrowRight className="size-3" />
              </>
            )}
          </span>
          <input
            ref={inputRef}
            type="file"
            accept=".pdf,.doc,.docx,.rtf,.odt,.jpg,.jpeg,.png,.webp,.tiff"
            hidden
            onChange={(e) => {
              const f = e.target.files?.[0];
              e.target.value = "";
              if (f) onImport(f);
            }}
          />
        </div>

        {/* Start from scratch */}
        <button
          type="button"
          disabled={busy}
          onClick={onScratch}
          className="group flex cursor-pointer flex-col gap-4 rounded-2xl border bg-card p-8 text-left transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-md disabled:opacity-70"
        >
          <div className="grid size-12 place-items-center rounded-xl bg-primary text-primary-foreground">
            <Sparkles className="size-6" />
          </div>
          <div>
            <h2 className="text-lg font-bold">Start from scratch</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Step-by-step wizard with AI suggestions per field.
            </p>
          </div>
          <span className="mt-auto inline-flex items-center gap-1 text-xs font-semibold text-primary">
            Begin <ArrowRight className="size-3" />
          </span>
        </button>

        {/* Voice */}
        <button
          type="button"
          disabled={busy}
          onClick={onVoice}
          className="group flex cursor-pointer flex-col gap-4 rounded-2xl border bg-card p-8 text-left transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-md disabled:opacity-70"
        >
          <div className="grid size-12 place-items-center rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600 text-white">
            <Mic className="size-6" />
          </div>
          <div>
            <h2 className="text-lg font-bold">Talk it through</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Speak each section, AI structures it. 20 languages.
            </p>
          </div>
          <span className="mt-auto inline-flex items-center gap-1 text-xs font-semibold text-primary">
            Start dictating <ArrowRight className="size-3" />
          </span>
        </button>
      </div>

      {error && (
        <div className="mt-4 flex items-start gap-2 rounded-xl border border-destructive/30 bg-destructive/5 p-3 text-sm">
          <AlertCircle className="mt-0.5 size-4 shrink-0 text-destructive" />
          <p className="text-destructive">{error}</p>
        </div>
      )}

      {/* Footer hints */}
      <div className="mx-auto mt-12 max-w-3xl text-center text-xs text-muted-foreground">
        <p>
          Already used the tool?{" "}
          <Link href="/account/files" className="text-primary hover:underline">
            See your CV history
          </Link>
        </p>
        <p className="mt-3">
          Free forever for the basics · 50 AI Improve calls / day ·
          ATS-friendly templates · No watermark
        </p>
      </div>
    </div>
  );
}
