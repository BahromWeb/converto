"use client";

import { useRef, useState } from "react";
import { Upload, FileText } from "lucide-react";

/**
 * A compact resume dropzone shared across the CAREER standalone tools.
 * Accepts PDF/DOCX/images — backend OCRs scans. Hands the picked file
 * to the parent; the parent owns the actual processing pipeline.
 */
export function ResumeDropzone({
  onFile,
  disabled,
  label = "Drop your resume here",
  hint = "PDF, DOCX, or a scanned image — up to 50 MB",
}: {
  onFile: (file: File) => void;
  disabled?: boolean;
  label?: string;
  hint?: string;
}) {
  const ref = useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = useState(false);

  return (
    <label
      onDragOver={(e) => {
        e.preventDefault();
        if (!disabled) setDragOver(true);
      }}
      onDragLeave={() => setDragOver(false)}
      onDrop={(e) => {
        e.preventDefault();
        setDragOver(false);
        if (disabled) return;
        const f = e.dataTransfer.files?.[0];
        if (f) onFile(f);
      }}
      className={`flex flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed p-8 text-center transition-all ${
        disabled
          ? "border-border bg-secondary/30 opacity-50"
          : dragOver
            ? "border-primary bg-primary/5 -translate-y-0.5"
            : "border-border bg-card hover:border-primary/40 cursor-pointer"
      }`}
    >
      <input
        ref={ref}
        type="file"
        accept=".pdf,.docx,.doc,.jpg,.jpeg,.png,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document,image/*"
        className="hidden"
        disabled={disabled}
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) onFile(f);
        }}
      />
      <div className="grid size-12 place-items-center rounded-full bg-primary/10 text-primary">
        <Upload className="size-5" />
      </div>
      <p className="text-sm font-bold text-foreground">{label}</p>
      <p className="text-xs text-muted-foreground">{hint}</p>
      <div className="mt-2 inline-flex items-center gap-1 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
        <FileText className="size-3" />
        Sign-in required
      </div>
    </label>
  );
}
