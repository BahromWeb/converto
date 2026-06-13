"use client";

import Link from "next/link";
import { useEffect, useRef, useState, type DragEvent } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@converto/ui/components/button";
import {
  UploadCloud,
  GitMerge,
  Scissors,
  Minimize2,
  FileText,
  ArrowRight,
  Loader2,
  AlertCircle,
  Sparkles,
  ShieldCheck,
  ScanText,
  Lock,
  Trash2,
} from "lucide-react";
import { useT } from "@/lib/i18n/context";
import {
  getPickerConfig,
  pickFromDropbox,
  pickFromGoogleDrive,
} from "@/lib/cloud-picker";

const quickTools = [
  { slug: "merge", labelKey: "Merge PDF", icon: GitMerge },
  { slug: "split", labelKey: "Split PDF", icon: Scissors },
  { slug: "compress", labelKey: "Compress", icon: Minimize2 },
  { slug: "pdf-to-word", labelKey: "PDF to Word", icon: FileText },
];

const fileTypes = ["PDF", "DOCX", "JPG", "PNG", "XLSX", "PPTX"];

// Decorative tool chips that drift around the upload card on large screens.
// Purely visual (aria-hidden) — they hint at the breadth of tools without
// crowding the primary drop zone. Positions are tuned to sit in the empty
// margins beside the centred card.
const floatingTools = [
  { label: "Merge", icon: GitMerge, pos: "left-[3%] top-[14%]", color: "text-blue-600", bg: "bg-blue-50", delay: "0s" },
  { label: "Compress", icon: Minimize2, pos: "left-[7%] top-[58%]", color: "text-emerald-600", bg: "bg-emerald-50", delay: "1.1s" },
  { label: "OCR", icon: ScanText, pos: "left-[1%] top-[86%]", color: "text-violet-600", bg: "bg-violet-50", delay: "2.3s" },
  { label: "AI Chat", icon: Sparkles, pos: "right-[3%] top-[12%]", color: "text-primary", bg: "bg-primary/10", delay: "0.5s" },
  { label: "Sign", icon: ShieldCheck, pos: "right-[6%] top-[52%]", color: "text-amber-600", bg: "bg-amber-50", delay: "1.7s" },
  { label: "Split", icon: Scissors, pos: "right-[2%] top-[84%]", color: "text-rose-600", bg: "bg-rose-50", delay: "2.9s" },
];

/**
 * Map a dropped/picked file's extension to the most useful tool page for
 * it. PDFs get sent to /tools so the user picks the operation (compress,
 * merge, split, ...) — anything else has a single obvious destination
 * (Word→PDF for .docx, Excel→PDF for .xlsx, etc.).
 *
 * Returns `null` for unsupported types so the UI can show a friendly
 * error instead of silently swallowing the upload.
 */
function pickDestination(filename: string): string | null {
  const ext = filename.toLowerCase().split(".").pop();
  switch (ext) {
    case "pdf":
      return "/tools";
    case "doc":
    case "docx":
    case "rtf":
    case "odt":
      return "/word-to-pdf";
    case "xls":
    case "xlsx":
    case "csv":
    case "ods":
      return "/excel-to-pdf";
    case "ppt":
    case "pptx":
    case "odp":
      return "/ppt-to-pdf";
    case "jpg":
    case "jpeg":
    case "png":
    case "webp":
      return "/jpg-to-pdf";
    case "html":
    case "htm":
      return "/html-to-pdf";
    default:
      return null;
  }
}

export function Hero() {
  const t = useT();
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [dragging, setDragging] = useState(false);
  const [routing, setRouting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  // Whether the server has been configured with Dropbox / Drive app
  // keys. We hide the buttons rather than show "Connect failed" if a
  // self-hosted deploy never set these.
  const [dropboxOn, setDropboxOn] = useState(false);
  const [googleOn, setGoogleOn] = useState(false);

  // Warm the picker config cache + decide which cloud buttons to show.
  useEffect(() => {
    let alive = true;
    getPickerConfig()
      .then((cfg) => {
        if (!alive) return;
        setDropboxOn(Boolean(cfg.dropbox_app_key));
        setGoogleOn(Boolean(cfg.google_client_id));
      })
      .catch(() => undefined);
    return () => {
      alive = false;
    };
  }, []);

  const openPicker = () => inputRef.current?.click();

  /**
   * Google Drive Picker. The Picker SDK takes care of the consent
   * popup + file UI; cloud-picker.ts already downloads the chosen
   * file as a File so we can drop it straight into handleFiles().
   */
  async function handleGoogleDrive() {
    setError(null);
    try {
      const file = await pickFromGoogleDrive();
      if (!file) return;
      const dt = new DataTransfer();
      dt.items.add(file);
      handleFiles(dt.files);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Google Drive import failed");
    }
  }

  /**
   * Dropbox "direct" links serve the file with CORS enabled, so we just
   * fetch + read it as a Blob in the browser and reuse the existing
   * local-file routing. No backend round-trip needed — keeps the flow
   * consistent with drag-drop and avoids paying for the bytes twice.
   */
  async function handleDropbox() {
    setError(null);
    try {
      const picked = await pickFromDropbox({
        extensions: [
          ".pdf",
          ".doc",
          ".docx",
          ".xls",
          ".xlsx",
          ".csv",
          ".ppt",
          ".pptx",
          ".jpg",
          ".jpeg",
          ".png",
          ".webp",
          ".html",
          ".htm",
        ],
        sizeLimit: 50 * 1024 * 1024,
      });
      if (!picked) return; // user cancelled
      const resp = await fetch(picked.link);
      if (!resp.ok) throw new Error(`Dropbox download failed (HTTP ${resp.status})`);
      const blob = await resp.blob();
      const file = new File([blob], picked.name, {
        type: blob.type || "application/octet-stream",
      });
      // Feed it through the existing handler — pickDestination + stash
      // + router.push all live there already.
      const dt = new DataTransfer();
      dt.items.add(file);
      handleFiles(dt.files);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Dropbox import failed");
    }
  }

  function handleFiles(fl: FileList | null) {
    if (!fl || fl.length === 0) return;
    const file = fl[0];
    if (!file) return;
    setError(null);
    const dest = pickDestination(file.name);
    if (!dest) {
      setError(
        `Sorry — .${file.name.split(".").pop()} files aren't supported yet. Try a PDF, Word, Excel, PowerPoint, image, or HTML file.`,
      );
      return;
    }
    // Stash the file so the destination tool can pick it up without
    // making the user re-select it. The destination reads "pendingUpload"
    // from sessionStorage on mount and clears it after consumption.
    try {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result !== "string") return;
        sessionStorage.setItem(
          "pendingUpload",
          JSON.stringify({
            name: file.name,
            type: file.type,
            size: file.size,
            data: reader.result, // data:URL
            stagedAt: Date.now(),
          }),
        );
        setRouting(true);
        router.push(dest);
      };
      reader.onerror = () => {
        setError("Couldn't read that file. Try again or pick a different one.");
      };
      reader.readAsDataURL(file);
    } catch {
      // sessionStorage full or unavailable — just route without staging.
      setRouting(true);
      router.push(dest);
    }
  }

  function onDrop(e: DragEvent<HTMLDivElement>) {
    e.preventDefault();
    setDragging(false);
    if (routing) return;
    handleFiles(e.dataTransfer.files);
  }

  return (
    <section id="hero" className="relative overflow-hidden">
      {/* Gradient backdrop + soft colour blobs for depth */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[680px]" aria-hidden>
        <div className="absolute inset-0 bg-gradient-to-br from-orange-100/80 via-rose-50/50 to-background" />
        <div className="absolute -left-24 top-24 h-72 w-72 rounded-full bg-primary/15 blur-3xl" />
        <div className="absolute right-0 top-10 h-64 w-64 rounded-full bg-rose-300/20 blur-3xl" />
        <div className="absolute left-1/2 top-40 h-56 w-[28rem] -translate-x-1/2 rounded-full bg-amber-200/20 blur-3xl" />
      </div>

      {/* Floating tool chips — decorative, large screens only */}
      <div className="pointer-events-none absolute inset-0 hidden lg:block" aria-hidden>
        {floatingTools.map(({ label, icon: Icon, pos, color, bg, delay }) => (
          <div
            key={label}
            className={`animate-float absolute ${pos} flex items-center gap-2 rounded-2xl border border-border/60 bg-card/80 px-3.5 py-2 shadow-lg shadow-black/[0.04] backdrop-blur-sm`}
            style={{ animationDelay: delay }}
          >
            <span className={`grid size-7 place-items-center rounded-lg ${bg} ${color}`}>
              <Icon className="size-4" />
            </span>
            <span className="text-sm font-semibold text-foreground/80">{label}</span>
          </div>
        ))}
      </div>

      <div className="container relative pt-16 pb-24 lg:pt-24">
        {/* Headline */}
        <div className="mx-auto max-w-3xl text-center">
          <span
            className="inline-flex animate-fade-in items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-sm font-semibold text-primary"
            style={{ animationDelay: "0ms" }}
          >
            <span className="size-1.5 animate-pulse rounded-full bg-primary" />
            {t.hero.badge}
          </span>

          <h1
            className="mt-6 animate-fade-in-up text-3xl sm:text-4xl font-bold tracking-tight text-foreground md:text-6xl lg:text-7xl"
            style={{ animationDelay: "80ms" }}
          >
            {t.hero.headline1}
            <br />
            <span className="text-primary">{t.hero.headline2}</span>
          </h1>

          <p
            className="mt-5 animate-fade-in-up text-lg leading-relaxed text-muted-foreground md:text-xl"
            style={{ animationDelay: "160ms" }}
          >
            {t.hero.subtitle}{" "}
            <span className="font-semibold text-foreground">
              Zero ads, zero watermarks, zero sign-up.
            </span>
          </p>

          {/* Format badges */}
          <div
            className="mt-6 flex animate-fade-in-up flex-wrap justify-center gap-2"
            style={{ animationDelay: "220ms" }}
          >
            {fileTypes.map((type) => (
              <span
                key={type}
                className="rounded-md border border-border bg-card px-3 py-1 text-xs font-semibold tracking-wide text-muted-foreground"
              >
                {type}
              </span>
            ))}
            <span className="self-center text-xs text-muted-foreground/60">+ 30 more</span>
          </div>
        </div>

        {/* Upload zone — now actually interactive */}
        <div
          className="mx-auto mt-10 max-w-2xl animate-fade-in-up"
          style={{ animationDelay: "300ms" }}
        >
          <div
            role="button"
            tabIndex={0}
            onClick={routing ? undefined : openPicker}
            onKeyDown={(e) => {
              if ((e.key === "Enter" || e.key === " ") && !routing) {
                e.preventDefault();
                openPicker();
              }
            }}
            onDragOver={(e) => {
              e.preventDefault();
              if (!routing) setDragging(true);
            }}
            onDragLeave={() => setDragging(false)}
            onDrop={onDrop}
            className={`group relative cursor-pointer rounded-2xl border-2 border-dashed bg-card p-10 text-center shadow-sm transition-all duration-300 ${
              dragging
                ? "border-primary bg-primary/5 scale-[1.01] shadow-lg"
                : "border-border hover:border-primary/50 hover:shadow-lg hover:-translate-y-0.5"
            } ${routing ? "pointer-events-none opacity-70" : ""}`}
          >
            <div className="flex flex-col items-center gap-5">
              <div className="grid h-16 w-16 place-items-center rounded-2xl bg-primary/10 text-primary transition-all duration-300 group-hover:bg-primary/20 group-hover:scale-110">
                {routing ? (
                  <Loader2 className="size-8 animate-spin" />
                ) : (
                  <UploadCloud className="size-8" />
                )}
              </div>
              <div>
                <p className="text-xl font-bold text-foreground">
                  {routing ? "Opening your tool…" : t.hero.dropzone}
                </p>
                <p className="mt-1.5 text-sm text-muted-foreground">
                  {t.hero.dropzoneSub.split("·")[0]}
                  <span className="font-semibold text-primary underline underline-offset-4">
                    browse your computer
                  </span>{" "}
                  · {t.hero.dropzoneSub.split("·")[1]}
                </p>
              </div>
              <div className="flex flex-wrap justify-center gap-2.5">
                <Button
                  size="lg"
                  className="min-w-36 shadow-sm transition-transform hover:scale-105"
                  onClick={(e) => {
                    e.stopPropagation();
                    openPicker();
                  }}
                  disabled={routing}
                >
                  <UploadCloud className="size-4" />
                  {t.hero.chooseFiles}
                </Button>
                {dropboxOn ? (
                  <Button
                    type="button"
                    size="lg"
                    variant="outline"
                    disabled={routing}
                    onClick={(e) => {
                      e.stopPropagation();
                      void handleDropbox();
                    }}
                    className="transition-transform hover:scale-105"
                  >
                    Dropbox
                  </Button>
                ) : (
                  <Link
                    href="/account/connections"
                    onClick={(e) => e.stopPropagation()}
                    className="inline-flex h-11 items-center gap-2 rounded-md border border-input bg-background px-6 text-sm font-medium shadow-sm transition-transform hover:scale-105 hover:bg-accent"
                  >
                    Dropbox
                  </Link>
                )}
                {googleOn ? (
                  <Button
                    type="button"
                    size="lg"
                    variant="outline"
                    disabled={routing}
                    onClick={(e) => {
                      e.stopPropagation();
                      void handleGoogleDrive();
                    }}
                    className="transition-transform hover:scale-105"
                  >
                    Google Drive
                  </Button>
                ) : (
                  <Link
                    href="/account/connections"
                    onClick={(e) => e.stopPropagation()}
                    className="inline-flex h-11 items-center gap-2 rounded-md border border-input bg-background px-6 text-sm font-medium shadow-sm transition-transform hover:scale-105 hover:bg-accent"
                  >
                    Google Drive
                  </Link>
                )}
              </div>
            </div>

            <input
              ref={inputRef}
              type="file"
              accept=".pdf,.doc,.docx,.rtf,.odt,.xls,.xlsx,.csv,.ods,.ppt,.pptx,.odp,.jpg,.jpeg,.png,.webp,.html,.htm"
              hidden
              onChange={(e) => handleFiles(e.target.files)}
            />
          </div>

          {error && (
            <div className="mt-3 flex items-start gap-2 rounded-lg border border-destructive/30 bg-destructive/5 p-3 text-sm">
              <AlertCircle className="mt-0.5 size-4 shrink-0 text-destructive" />
              <p className="text-destructive">{error}</p>
            </div>
          )}

          {(() => {
            // Surface the security promise as an icon row — the single
            // strongest "this isn't a scam" signal. Built from the localized
            // string (split on "·") so every language stays correct; falls
            // back to the plain line if a locale phrases it differently.
            const parts = t.hero.security.split("·").map((s) => s.trim()).filter(Boolean);
            const icons = [Lock, ShieldCheck, Trash2];
            if (parts.length >= 2) {
              return (
                <div className="mt-4 flex flex-wrap items-center justify-center gap-x-5 gap-y-2">
                  {parts.slice(0, 3).map((part, i) => {
                    const Ic = icons[i] ?? Lock;
                    return (
                      <span
                        key={part}
                        className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground"
                      >
                        <Ic className="size-3.5 text-emerald-600" />
                        {part}
                      </span>
                    );
                  })}
                </div>
              );
            }
            return (
              <p className="mt-3 text-center text-xs text-muted-foreground">
                <span className="font-bold text-primary">●</span> {t.hero.security}
              </p>
            );
          })()}
        </div>

        {/* Quick-access tool chips */}
        <div
          className="mx-auto mt-8 flex max-w-xl animate-fade-in-up flex-wrap items-center justify-center gap-2"
          style={{ animationDelay: "420ms" }}
        >
          <span className="text-xs font-medium text-muted-foreground">{t.hero.orGoTo}</span>
          {quickTools.map(({ slug, labelKey, icon: Icon }) => (
            <Link
              key={slug}
              href={`/${slug}`}
              className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-3.5 py-1.5 text-xs font-semibold text-foreground/80 shadow-sm transition-all duration-200 hover:border-primary/40 hover:bg-primary/5 hover:text-primary hover:shadow hover:-translate-y-0.5"
            >
              <Icon className="size-3.5" />
              {labelKey}
            </Link>
          ))}
          <Link
            href="/#tools"
            className="inline-flex items-center gap-1 text-xs font-semibold text-primary transition-colors hover:underline"
          >
            All tools <ArrowRight className="size-3" />
          </Link>
        </div>
      </div>
    </section>
  );
}
