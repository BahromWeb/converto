"use client";

import { useEffect, useRef, useState } from "react";
import { Mic, MicOff, X, Loader2, CheckCircle2 } from "lucide-react";
import { parseCVVoice } from "@/lib/cv/api";
import type { CVParsedSection } from "@/lib/cv/types";

// Minimal SpeechRecognition typings — the global is only on Chromium-
// based browsers and Safari, and pulling the full DOM lib for one
// constructor is overkill.
type SR = {
  start: () => void;
  stop: () => void;
  abort: () => void;
  onresult: ((e: { results: ArrayLike<{ 0: { transcript: string }; isFinal: boolean }> & { length: number } }) => void) | null;
  onerror: ((e: { error?: string }) => void) | null;
  onend: (() => void) | null;
  continuous: boolean;
  interimResults: boolean;
  lang: string;
};

interface SpeechRecognitionWindow extends Window {
  SpeechRecognition?: { new (): SR };
  webkitSpeechRecognition?: { new (): SR };
}

const SECTION_OPTIONS = [
  "personal", "summary", "experience", "education",
  "skills", "languages", "projects", "awards",
];

/**
 * Voice mode — full-screen recorder that captures continuous speech via
 * Web Speech API, sends each finalised chunk to the backend's voice
 * parser, and shows what AI extracted in real time.
 */
export function VoiceMode({
  cvID,
  locale,
  onDone,
}: {
  cvID: string;
  locale: string;
  onDone: () => void;
}) {
  const [listening, setListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [hint, setHint] = useState("experience");
  const [busy, setBusy] = useState(false);
  const [parsed, setParsed] = useState<CVParsedSection[]>([]);
  const [error, setError] = useState<string | null>(null);
  const recRef = useRef<SR | null>(null);

  const supported =
    typeof window !== "undefined" &&
    Boolean(
      (window as SpeechRecognitionWindow).SpeechRecognition ||
        (window as SpeechRecognitionWindow).webkitSpeechRecognition,
    );

  function start() {
    setError(null);
    const W = window as SpeechRecognitionWindow;
    const Ctor = W.SpeechRecognition || W.webkitSpeechRecognition;
    if (!Ctor) {
      setError("Voice mode needs Chrome / Edge / Safari (Web Speech API).");
      return;
    }
    const rec = new Ctor();
    rec.continuous = true;
    rec.interimResults = true;
    rec.lang = bcp47(locale);
    rec.onresult = (e) => {
      let agg = "";
      for (let i = 0; i < e.results.length; i++) {
        const r = e.results[i]; if (r) agg += r[0].transcript + " ";
      }
      setTranscript(agg.trim());
    };
    rec.onerror = (e) => {
      setError(e.error ?? "Recognition failed");
    };
    rec.onend = () => {
      setListening(false);
    };
    rec.start();
    recRef.current = rec;
    setListening(true);
  }

  function stop() {
    recRef.current?.stop();
    recRef.current = null;
    setListening(false);
  }

  async function flush() {
    if (!transcript.trim()) return;
    setBusy(true);
    setError(null);
    try {
      const r = await parseCVVoice(cvID, {
        transcript,
        section_hint: hint,
        locale,
      });
      setParsed((prev) => [...prev, ...r.parsed_sections]);
      setTranscript("");
    } catch (e) {
      setError(e instanceof Error ? e.message : "AI parse failed");
    } finally {
      setBusy(false);
    }
  }

  useEffect(() => () => recRef.current?.abort(), []);

  return (
    <div className="container py-8">
      <div className="mx-auto max-w-3xl">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Talk it through</h1>
          <button
            type="button"
            onClick={onDone}
            className="inline-flex items-center gap-1 rounded-lg border px-3 py-1.5 text-sm font-semibold hover:bg-accent"
          >
            <X className="size-3.5" /> Done
          </button>
        </div>
        <p className="mt-2 text-sm text-muted-foreground">
          Pick a section, then speak. AI will structure what you said and
          add it to your CV. You can repeat the cycle for each section.
        </p>

        {!supported && (
          <p className="mt-4 rounded-lg border border-destructive/30 bg-destructive/5 p-3 text-sm text-destructive">
            Your browser doesn&apos;t support voice input. Try Chrome, Edge, or
            Safari.
          </p>
        )}

        {/* Section picker */}
        <div className="mt-6">
          <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            What are you about to describe?
          </p>
          <div className="flex flex-wrap gap-2">
            {SECTION_OPTIONS.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setHint(s)}
                className={`rounded-full border px-3 py-1 text-xs font-semibold capitalize transition-colors ${
                  hint === s
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-border hover:border-primary/40"
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        {/* Recorder */}
        <div className="mt-6 rounded-2xl border bg-card p-6 text-center">
          <button
            type="button"
            disabled={!supported}
            onClick={listening ? stop : start}
            className={`mx-auto grid size-20 place-items-center rounded-full transition-all ${
              listening
                ? "bg-rose-500 text-white shadow-xl shadow-rose-500/40 animate-pulse"
                : "bg-primary text-primary-foreground hover:scale-105"
            } disabled:opacity-50`}
            aria-label={listening ? "Stop recording" : "Start recording"}
          >
            {listening ? <MicOff className="size-7" /> : <Mic className="size-7" />}
          </button>
          <p className="mt-3 text-sm text-muted-foreground">
            {listening ? "Listening… click to stop" : "Click the mic to start"}
          </p>

          <div className="mt-4 min-h-[80px] rounded-xl border bg-secondary/30 p-3 text-left text-sm">
            {transcript ? (
              <p className="leading-relaxed">{transcript}</p>
            ) : (
              <p className="text-muted-foreground">
                Your spoken words will appear here…
              </p>
            )}
          </div>

          <button
            type="button"
            disabled={busy || !transcript.trim()}
            onClick={flush}
            className="mt-4 inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-50"
          >
            {busy ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                Sending to AI…
              </>
            ) : (
              <>Save & parse this</>
            )}
          </button>

          {error && (
            <p className="mt-3 rounded-lg border border-destructive/30 bg-destructive/5 p-2 text-xs text-destructive">
              {error}
            </p>
          )}
        </div>

        {/* Parsed so far */}
        {parsed.length > 0 && (
          <div className="mt-6">
            <h2 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
              Captured so far
            </h2>
            <ul className="mt-2 space-y-2">
              {parsed.map((p, i) => (
                <li key={i} className="flex items-start gap-2 rounded-lg border bg-card p-3 text-sm">
                  <CheckCircle2 className="mt-0.5 size-4 text-emerald-600" />
                  <div className="flex-1">
                    <p className="font-semibold capitalize">{p.section_type}</p>
                    <p className="text-xs text-muted-foreground">
                      {Object.keys(p.content).slice(0, 5).join(", ")}
                    </p>
                  </div>
                  {p.confidence != null && (
                    <span className="text-[10px] text-muted-foreground">
                      {Math.round(p.confidence * 100)}%
                    </span>
                  )}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}

// bcp47 maps our internal "uz" / "ru" / "en" locale to the matching
// BCP-47 tag the Web Speech API expects (en-US, ru-RU, uz-UZ, ...).
function bcp47(locale: string): string {
  const map: Record<string, string> = {
    en: "en-US", ru: "ru-RU", uz: "uz-UZ", ar: "ar-SA",
    tr: "tr-TR", de: "de-DE", fr: "fr-FR", es: "es-ES",
    zh: "zh-CN", ja: "ja-JP", ko: "ko-KR", hi: "hi-IN",
    pt: "pt-BR", it: "it-IT", id: "id-ID", pl: "pl-PL",
    vi: "vi-VN", nl: "nl-NL", th: "th-TH", uk: "uk-UA",
  };
  return map[locale] ?? "en-US";
}
