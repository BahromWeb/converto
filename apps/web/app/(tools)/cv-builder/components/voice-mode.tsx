"use client";

import { useEffect, useRef, useState } from "react";
import { Play, Square, X, Loader2, CheckCircle2, Keyboard, Sparkles, RotateCcw, AlertCircle } from "lucide-react";
import { parseCVVoice } from "@/lib/cv/api";
import type { CVParsedSection } from "@/lib/cv/types";

type SR = {
  start: () => void;
  stop: () => void;
  abort: () => void;
  onresult: ((e: { results: ArrayLike<{ 0: { transcript: string }; isFinal: boolean }> & { length: number } }) => void) | null;
  onerror: ((e: { error?: string }) => void) | null;
  onend: (() => void) | null;
  onstart: (() => void) | null;
  onspeechstart: (() => void) | null;
  continuous: boolean;
  interimResults: boolean;
  lang: string;
};

interface SpeechRecognitionWindow extends Window {
  SpeechRecognition?: { new (): SR };
  webkitSpeechRecognition?: { new (): SR };
}

const SECTION_OPTIONS: Array<{ id: string; label: string; example: string }> = [
  { id: "personal",   label: "Personal",   example: "I'm Zarif Jurayev, backend engineer based in Tashkent…" },
  { id: "summary",    label: "Summary",    example: "Go developer with 4 years building distributed systems…" },
  { id: "experience", label: "Experience", example: "At RRTM I led the backend for career.edu.uz…" },
  { id: "education",  label: "Education",  example: "B.Sc. in Software Engineering, INHA University, 2024…" },
  { id: "skills",     label: "Skills",     example: "Go, PostgreSQL, Kafka, Redis, Docker, Kubernetes…" },
  { id: "languages",  label: "Languages",  example: "Uzbek native, English B2, Russian C1…" },
  { id: "projects",   label: "Projects",   example: "Career.edu.uz — built the jobs platform handling 50k…" },
  { id: "awards",     label: "Awards",     example: "1st place in the 2024 national hackathon for…" },
];

const SPEECH_LOCALES: Array<{ code: string; tag: string; label: string; flag: string }> = [
  { code: "en", tag: "en-US", label: "English",    flag: "🇺🇸" },
  { code: "ru", tag: "ru-RU", label: "Русский",    flag: "🇷🇺" },
  { code: "uz", tag: "uz-UZ", label: "O'zbek",     flag: "🇺🇿" },
  { code: "de", tag: "de-DE", label: "Deutsch",    flag: "🇩🇪" },
  { code: "fr", tag: "fr-FR", label: "Français",   flag: "🇫🇷" },
  { code: "es", tag: "es-ES", label: "Español",    flag: "🇪🇸" },
  { code: "it", tag: "it-IT", label: "Italiano",   flag: "🇮🇹" },
  { code: "pt", tag: "pt-BR", label: "Português",  flag: "🇵🇹" },
  { code: "nl", tag: "nl-NL", label: "Nederlands", flag: "🇳🇱" },
  { code: "pl", tag: "pl-PL", label: "Polski",     flag: "🇵🇱" },
  { code: "tr", tag: "tr-TR", label: "Türkçe",     flag: "🇹🇷" },
  { code: "ar", tag: "ar-SA", label: "العربية",     flag: "🇸🇦" },
  { code: "zh", tag: "zh-CN", label: "中文",        flag: "🇨🇳" },
  { code: "ja", tag: "ja-JP", label: "日本語",       flag: "🇯🇵" },
  { code: "ko", tag: "ko-KR", label: "한국어",       flag: "🇰🇷" },
  { code: "hi", tag: "hi-IN", label: "हिन्दी",        flag: "🇮🇳" },
  { code: "id", tag: "id-ID", label: "Bahasa",     flag: "🇮🇩" },
  { code: "vi", tag: "vi-VN", label: "Tiếng Việt", flag: "🇻🇳" },
  { code: "th", tag: "th-TH", label: "ไทย",         flag: "🇹🇭" },
  { code: "uk", tag: "uk-UA", label: "Українська", flag: "🇺🇦" },
];

function localeToTag(locale: string): string {
  const m = SPEECH_LOCALES.find((l) => l.code === locale);
  return m?.tag ?? "en-US";
}

function friendlyError(code?: string): string {
  switch (code) {
    case "not-allowed":
    case "service-not-allowed":
      return "Microphone is blocked. Click the lock icon in the address bar and allow microphone access for this site.";
    case "no-speech":
      return "We didn't hear anything. Speak closer to the mic.";
    case "audio-capture":
      return "No microphone detected. Plug one in or check your system audio settings.";
    case "network":
      return "Speech recognition needs the internet — check your connection.";
    case "language-not-supported":
      return "Your browser doesn't support that language for speech. Switch to English or Russian for best results.";
    default:
      return code ? `Recognition error: ${code}` : "Recognition failed.";
  }
}

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
  const [speechTag, setSpeechTag] = useState(() => localeToTag(locale));
  const [busy, setBusy] = useState(false);
  const [parsed, setParsed] = useState<CVParsedSection[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [typeMode, setTypeMode] = useState(false);
  // elapsedSec ticks while listening so we can show progress and warn if
  // recognition starts but never produces a single word.
  const [elapsedSec, setElapsedSec] = useState(0);
  const [heard, setHeard] = useState(false);

  const recRef = useRef<SR | null>(null);
  const userWantsListening = useRef(false);

  const supported =
    typeof window !== "undefined" &&
    Boolean(
      (window as SpeechRecognitionWindow).SpeechRecognition ||
        (window as SpeechRecognitionWindow).webkitSpeechRecognition,
    );

  // Tick the elapsed seconds while listening.
  useEffect(() => {
    if (!listening) return;
    setElapsedSec(0);
    setHeard(false);
    const id = setInterval(() => setElapsedSec((s) => s + 1), 1000);
    return () => clearInterval(id);
  }, [listening]);

  function buildRecognizer(): SR | null {
    const W = window as SpeechRecognitionWindow;
    const Ctor = W.SpeechRecognition || W.webkitSpeechRecognition;
    if (!Ctor) return null;
    const rec = new Ctor();
    rec.continuous = true;
    rec.interimResults = true;
    rec.lang = speechTag;
    rec.onresult = (e) => {
      let agg = "";
      for (let i = 0; i < e.results.length; i++) {
        const r = e.results[i];
        if (r) agg += r[0].transcript + " ";
      }
      const incoming = agg.trim();
      if (!incoming) return;
      setHeard(true);
      setTranscript((prev) => (prev ? `${prev} ${incoming}`.trim() : incoming));
    };
    rec.onerror = (e) => {
      const code = e.error;
      if (code === "no-speech" || code === "aborted") return;
      setError(friendlyError(code));
    };
    rec.onend = () => {
      if (userWantsListening.current) {
        try { rec.start(); } catch { /* ignored — next tick */ }
      } else {
        setListening(false);
      }
    };
    return rec;
  }

  function start() {
    setError(null);
    if (!supported) {
      setError("Voice mode needs Chrome, Edge, Safari, or another browser that supports the Web Speech API. Use 'Type instead' below if your browser can't.");
      return;
    }
    const rec = buildRecognizer();
    if (!rec) return;
    userWantsListening.current = true;
    try {
      rec.start();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Couldn't start the mic.");
      return;
    }
    recRef.current = rec;
    setListening(true);
  }

  function stop() {
    userWantsListening.current = false;
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

  useEffect(() => {
    return () => {
      userWantsListening.current = false;
      recRef.current?.abort();
    };
  }, []);

  // Restart recognition with the new language tag when the user picks
  // a different language mid-session.
  useEffect(() => {
    if (!listening) return;
    recRef.current?.stop();
    setTimeout(() => {
      if (userWantsListening.current) {
        const rec = buildRecognizer();
        if (!rec) return;
        try { rec.start(); recRef.current = rec; } catch { /* ignore */ }
      }
    }, 150);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [speechTag]);

  const currentLang = SPEECH_LOCALES.find((l) => l.tag === speechTag) ?? SPEECH_LOCALES[0]!;
  const activeSection = SECTION_OPTIONS.find((s) => s.id === hint) ?? SECTION_OPTIONS[2]!;
  // After 10s of listening with zero words captured, the browser likely
  // isn't sending audio to a speech backend — guide the user.
  const stuck = listening && !heard && elapsedSec >= 10;

  return (
    <div className="container py-8">
      <div className="mx-auto max-w-3xl">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Talk it through</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Speak in your own words. AI structures every sentence into a CV section.
            </p>
          </div>
          <button
            type="button"
            onClick={onDone}
            className="inline-flex items-center gap-1 rounded-lg border px-3 py-1.5 text-sm font-semibold hover:bg-accent"
          >
            <X className="size-3.5" /> Close
          </button>
        </div>

        {/* Step 1 — what to describe */}
        <div className="mt-6">
          <Step n="1" label="Pick a section to describe" />
          <div className="mt-2 flex flex-wrap gap-2">
            {SECTION_OPTIONS.map((s) => (
              <button
                key={s.id}
                type="button"
                onClick={() => setHint(s.id)}
                className={`rounded-full border px-3 py-1.5 text-xs font-semibold transition-colors ${
                  hint === s.id
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-border hover:border-primary/40"
                }`}
              >
                {s.label}
              </button>
            ))}
          </div>
          <p className="mt-2 text-xs italic text-muted-foreground">
            e.g. {activeSection.example}
          </p>
        </div>

        {/* Step 2 — language picker (always visible, scroll strip) */}
        <div className="mt-6">
          <Step n="2" label="Which language will you speak?" right={<span className="text-xs text-muted-foreground">{currentLang.flag} {currentLang.label}</span>} />
          <div className="mt-2 overflow-x-auto">
            <div className="flex gap-1.5 pb-2">
              {SPEECH_LOCALES.map((l) => (
                <button
                  key={l.tag}
                  type="button"
                  onClick={() => setSpeechTag(l.tag)}
                  className={`shrink-0 inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold transition-colors ${
                    l.tag === speechTag
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-border hover:border-primary/40"
                  }`}
                >
                  <span className="text-sm leading-none">{l.flag}</span>
                  <span>{l.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Step 3 — recorder */}
        <div className="mt-6">
          <Step n="3" label={typeMode ? "Type what you'd say" : "Hit the button and speak"} right={
            <button
              type="button"
              onClick={() => { if (listening) stop(); setTypeMode((v) => !v); }}
              className="inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1 text-xs font-semibold hover:bg-accent"
            >
              <Keyboard className="size-3.5" />
              {typeMode ? "Use mic" : "Type instead"}
            </button>
          } />

          <div className="mt-3 rounded-2xl border bg-card p-6">
            {!typeMode ? (
              <div className="flex flex-col items-center text-center">
                <button
                  type="button"
                  disabled={!supported}
                  onClick={listening ? stop : start}
                  className={`relative grid size-24 place-items-center rounded-full transition-all ${
                    listening
                      ? "bg-rose-500 text-white shadow-xl shadow-rose-500/40"
                      : "bg-primary text-primary-foreground hover:scale-105 shadow-lg shadow-primary/30"
                  } disabled:opacity-50`}
                  aria-label={listening ? "Stop recording" : "Start recording"}
                >
                  {listening ? <Square className="size-9 fill-current" /> : <Play className="size-9 fill-current pl-1" />}
                  {listening && (
                    <>
                      <span className="absolute inset-0 -m-1 rounded-full border-4 border-rose-400/40 animate-ping" />
                      <span className="absolute inset-0 -m-3 rounded-full border border-rose-400/30 animate-ping" />
                    </>
                  )}
                </button>
                <div className="mt-3 flex items-center gap-2 text-sm">
                  {listening ? (
                    <>
                      <span className="size-2 rounded-full bg-rose-500 animate-pulse" />
                      <span className="font-semibold">Listening in {currentLang.label}</span>
                      <span className="text-muted-foreground">· {elapsedSec}s</span>
                    </>
                  ) : (
                    <span className="font-semibold text-muted-foreground">Tap to start recording</span>
                  )}
                </div>

                {stuck && (
                  <div className="mt-3 w-full rounded-lg border border-amber-500/30 bg-amber-500/5 p-3 text-left text-xs text-amber-700 dark:text-amber-400">
                    <p className="font-semibold">No speech detected after {elapsedSec}s.</p>
                    <p className="mt-1">
                      • Make sure the browser tab has microphone permission (the mic icon in your address bar should not show a slash).<br />
                      • Yandex / Brave / Firefox may not transmit audio to Google&apos;s speech service — try Chrome, Edge, or use <strong>Type instead</strong> on the right.
                    </p>
                  </div>
                )}
              </div>
            ) : (
              <p className="text-center text-xs text-muted-foreground">
                Voice off. Type whatever you&apos;d say into the box below.
              </p>
            )}

            {/* Transcript area — editable in type mode, read-only with caret hint while listening */}
            <textarea
              value={transcript}
              onChange={(e) => setTranscript(e.target.value)}
              readOnly={!typeMode && listening}
              placeholder={
                typeMode
                  ? "Write a few sentences about this section…"
                  : "Your spoken words will appear here…"
              }
              rows={5}
              className="mt-4 w-full resize-y rounded-xl border bg-secondary/30 p-3 text-sm leading-relaxed outline-none focus:border-primary/50"
            />

            <div className="mt-3 flex flex-col gap-2 sm:flex-row">
              <button
                type="button"
                disabled={busy || !transcript.trim()}
                onClick={flush}
                className="inline-flex flex-1 items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-50"
              >
                {busy ? (
                  <><Loader2 className="size-4 animate-spin" /> Sending to AI…</>
                ) : (
                  <><Sparkles className="size-4" /> Save & let AI structure it</>
                )}
              </button>
              {transcript && (
                <button
                  type="button"
                  onClick={() => setTranscript("")}
                  className="inline-flex items-center justify-center gap-2 rounded-lg border px-4 py-2.5 text-sm font-semibold hover:bg-accent"
                  title="Clear transcript"
                >
                  <RotateCcw className="size-3.5" /> Clear
                </button>
              )}
            </div>

            {error && (
              <div className="mt-3 flex items-start gap-2 rounded-lg border border-destructive/30 bg-destructive/5 p-2 text-xs text-destructive">
                <AlertCircle className="mt-0.5 size-3.5 shrink-0" />
                <span>{error}</span>
              </div>
            )}
          </div>
        </div>

        {/* Captured so far */}
        {parsed.length > 0 && (
          <div className="mt-6">
            <h2 className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
              Captured so far ({parsed.length})
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

function Step({ n, label, right }: { n: string; label: string; right?: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        <span className="grid size-5 place-items-center rounded-full bg-primary/10 text-[10px] font-bold text-primary">{n}</span>
        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{label}</p>
      </div>
      {right}
    </div>
  );
}
