"use client";

import { useEffect, useRef, useState } from "react";
import { Mic, MicOff, X, Loader2, CheckCircle2, Globe } from "lucide-react";
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

// 20 supported speech locales — same set as the rest of the CV stack.
// `tag` is the BCP-47 the Web Speech API expects; `flag` is just decor.
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
      return "Microphone access is blocked. Click the mic icon in the address bar and allow microphone access.";
    case "no-speech":
      return "We didn't hear anything. Speak closer to the mic and try again.";
    case "audio-capture":
      return "No microphone was detected. Plug one in or check your system audio settings.";
    case "network":
      return "Speech recognition needs the internet — check your connection and retry.";
    case "language-not-supported":
      return "Your browser doesn't support that language for speech. Try English or Russian.";
    case "aborted":
      return "Recognition stopped. Click the mic to start again.";
    default:
      return code ? `Recognition error: ${code}` : "Recognition failed.";
  }
}

/**
 * Voice mode — full-screen recorder. Captures continuous speech via the
 * Web Speech API, sends each finalised chunk to the backend's voice
 * parser, and shows what AI extracted in real time. The recognition
 * locale is independent of the CV locale (a user may type their CV in
 * English but dictate in Russian); we default to the CV locale and let
 * the user pick another from the language strip.
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
  const [speechTag, setSpeechTag] = useState(() => localeToTag(locale));
  const [busy, setBusy] = useState(false);
  const [parsed, setParsed] = useState<CVParsedSection[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [showLangPicker, setShowLangPicker] = useState(false);

  const recRef = useRef<SR | null>(null);
  // Track whether the user explicitly asked to stop so the auto-restart
  // logic in `onend` doesn't fight a deliberate stop click.
  const userWantsListening = useRef(false);

  const supported =
    typeof window !== "undefined" &&
    Boolean(
      (window as SpeechRecognitionWindow).SpeechRecognition ||
        (window as SpeechRecognitionWindow).webkitSpeechRecognition,
    );

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
      // Append rather than replace, so cross-session restarts don't drop history.
      setTranscript((prev) => {
        const incoming = agg.trim();
        if (!incoming) return prev;
        return prev ? `${prev} ${incoming}`.trim() : incoming;
      });
    };
    rec.onerror = (e) => {
      // 'no-speech' / 'aborted' are routine on long sessions — keep going
      // unless the user has paused; surface anything else.
      const code = e.error;
      if (code === "no-speech" || code === "aborted") return;
      setError(friendlyError(code));
    };
    rec.onend = () => {
      // Chrome stops recognition after ~60s of silence; if the user is
      // still in listening mode, transparently restart so the experience
      // feels continuous.
      if (userWantsListening.current) {
        try { rec.start(); } catch { /* restart raced — pick up next tick */ }
      } else {
        setListening(false);
      }
    };
    return rec;
  }

  function start() {
    setError(null);
    if (!supported) {
      setError("Voice mode needs Chrome, Edge, Safari, or a Chromium-based browser with mic support.");
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

  // Stop recognition on unmount.
  useEffect(() => {
    return () => {
      userWantsListening.current = false;
      recRef.current?.abort();
    };
  }, []);

  // If the user switches language mid-session, restart the recognizer
  // with the new locale so subsequent words use the right model.
  useEffect(() => {
    if (!listening) return;
    recRef.current?.stop();
    // onend's auto-restart sees userWantsListening = true and will spin
    // up a fresh recognizer with the updated speechTag via buildRecognizer().
    // But buildRecognizer is captured at start() time — we need a fresh one.
    // So clear ref + re-start manually after a tick.
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
          Pick a section, choose the language you&apos;ll speak, then hit the mic.
          AI structures what you say and adds it to your CV.
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

        {/* Language picker */}
        <div className="mt-6">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              What language will you speak?
            </p>
            <button
              type="button"
              onClick={() => setShowLangPicker((v) => !v)}
              className="inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1 text-xs font-semibold hover:bg-accent"
            >
              <Globe className="size-3.5" />
              <span>{currentLang.flag} {currentLang.label}</span>
            </button>
          </div>
          {showLangPicker && (
            <div className="mt-2 grid grid-cols-2 gap-1.5 rounded-xl border bg-card p-2 sm:grid-cols-4 lg:grid-cols-5">
              {SPEECH_LOCALES.map((l) => (
                <button
                  key={l.tag}
                  type="button"
                  onClick={() => { setSpeechTag(l.tag); setShowLangPicker(false); }}
                  className={`flex items-center gap-1.5 rounded-md px-2 py-1.5 text-xs font-semibold transition-colors ${
                    l.tag === speechTag
                      ? "bg-primary/10 text-primary"
                      : "hover:bg-accent"
                  }`}
                >
                  <span className="text-base leading-none">{l.flag}</span>
                  <span className="truncate">{l.label}</span>
                </button>
              ))}
            </div>
          )}
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
            {listening
              ? `Listening in ${currentLang.label}… click to stop`
              : "Click the mic to start"}
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

          <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:justify-center">
            <button
              type="button"
              disabled={busy || !transcript.trim()}
              onClick={flush}
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-50"
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
            {transcript && !listening && (
              <button
                type="button"
                onClick={() => setTranscript("")}
                className="inline-flex items-center justify-center gap-2 rounded-lg border px-4 py-2 text-sm font-semibold hover:bg-accent"
              >
                Clear transcript
              </button>
            )}
          </div>

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
