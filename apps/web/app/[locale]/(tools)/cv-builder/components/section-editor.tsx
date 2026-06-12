"use client";

import { useState } from "react";
import { Sparkles, X, Loader2, Plus, Trash2 } from "lucide-react";
import type { CVSection, CVSuggestion } from "@/lib/cv/types";
import { improveCVField } from "@/lib/cv/api";

/**
 * Section editor — renders the right form for each section_type. The
 * `Improve` button next to every text/textarea field opens a popover
 * with three AI rewrites the user can pick from.
 *
 * Content shape per section_type:
 *   personal      { name, title, email, phone, location, linkedin, github, website }
 *   summary       { text }
 *   experience    { items: [{ title, company, period, location, bullets[] }] }
 *   education     { items: [{ degree, school, period, gpa, honors }] }
 *   skills        { technical: [], soft: [] }
 *   languages     { items: [{ name, level }] }
 *   projects      { items: [{ name, description, tech: [], link }] }
 *   awards        { items: [{ title, issuer, year }] }
 *   certifications{ items: [{ name, issuer, year }] }
 */
export function SectionEditor({
  cvID,
  section,
  onChange,
}: {
  /* eslint-disable-next-line @typescript-eslint/no-unused-vars */ cvID: string;
  section: CVSection;
  onChange: (content: Record<string, unknown>) => void;
}) {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold capitalize">{section.section_type}</h2>
      {(() => {
        switch (section.section_type) {
          case "personal":
            return <PersonalFields cvID={cvID} content={section.content} onChange={onChange} />;
          case "summary":
            return <SummaryField cvID={cvID} content={section.content} onChange={onChange} />;
          case "experience":
            return <ExperienceList cvID={cvID} content={section.content} onChange={onChange} />;
          case "education":
            return <EducationList content={section.content} onChange={onChange} />;
          case "skills":
            return <SkillsFields content={section.content} onChange={onChange} />;
          case "languages":
            return <LanguagesList content={section.content} onChange={onChange} />;
          case "projects":
            return <ProjectsList cvID={cvID} content={section.content} onChange={onChange} />;
          case "awards":
            return <AwardsList content={section.content} onChange={onChange} />;
          case "certifications":
            return <CertsList content={section.content} onChange={onChange} />;
          default:
            return <pre className="text-xs text-muted-foreground">{JSON.stringify(section.content, null, 2)}</pre>;
        }
      })()}
    </div>
  );
}

// ─── Reusable building blocks ────────────────────────────────────────

function TextField({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  return (
    <label className="block">
      <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        {label}
      </span>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="mt-1 w-full rounded-lg border bg-card px-3 py-2 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/30"
      />
    </label>
  );
}

function TextAreaField({
  label,
  value,
  onChange,
  placeholder,
  improveContext,
  cvID,
  fieldPath,
  rows = 3,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  improveContext?: Record<string, unknown>;
  cvID?: string;
  fieldPath?: string;
  rows?: number;
}) {
  return (
    <div>
      <div className="mb-1 flex items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          {label}
        </span>
        {cvID && fieldPath && value.trim().length > 5 && (
          <ImproveButton
            cvID={cvID}
            fieldPath={fieldPath}
            currentText={value}
            context={improveContext}
            onPick={onChange}
          />
        )}
      </div>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={rows}
        className="w-full resize-y rounded-lg border bg-card px-3 py-2 text-sm leading-relaxed outline-none focus:border-primary focus:ring-2 focus:ring-primary/30"
      />
    </div>
  );
}

function ImproveButton({
  cvID,
  fieldPath,
  currentText,
  context,
  onPick,
}: {
  /* eslint-disable-next-line @typescript-eslint/no-unused-vars */ cvID: string;
  fieldPath: string;
  currentText: string;
  context?: Record<string, unknown>;
  onPick: (text: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [suggestions, setSuggestions] = useState<CVSuggestion[]>([]);
  const [error, setError] = useState<string | null>(null);

  async function run() {
    setOpen(true);
    setBusy(true);
    setError(null);
    setSuggestions([]);
    try {
      const r = await improveCVField(cvID, {
        field_path: fieldPath,
        current_text: currentText,
        context,
      });
      setSuggestions(r.suggestions);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="relative">
      <button
        type="button"
        onClick={run}
        className="inline-flex items-center gap-1 rounded-md bg-primary/10 px-2 py-1 text-[11px] font-semibold text-primary transition-colors hover:bg-primary/20"
      >
        <Sparkles className="size-3" />
        Improve
      </button>
      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute right-0 top-full z-50 mt-2 w-[420px] rounded-2xl border bg-card p-4 shadow-2xl">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold">AI suggestions</h3>
              <button onClick={() => setOpen(false)} className="text-muted-foreground hover:text-foreground">
                <X className="size-3.5" />
              </button>
            </div>
            {busy && (
              <div className="flex items-center gap-2 py-6 text-sm text-muted-foreground">
                <Loader2 className="size-4 animate-spin" />
                Generating 3 variants…
              </div>
            )}
            {error && (
              <p className="mt-3 rounded-lg border border-destructive/30 bg-destructive/5 p-2 text-xs text-destructive">
                {error}
              </p>
            )}
            {!busy && suggestions.length > 0 && (
              <ul className="mt-3 space-y-2">
                {suggestions.map((s, i) => (
                  <li key={i} className="rounded-lg border bg-secondary/30 p-3">
                    <p className="text-sm leading-relaxed">{s.text}</p>
                    <div className="mt-2 flex items-center justify-between">
                      <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                        {s.style}
                      </span>
                      <button
                        type="button"
                        onClick={() => {
                          onPick(s.text);
                          setOpen(false);
                        }}
                        className="rounded-md bg-primary px-2.5 py-1 text-[11px] font-semibold text-primary-foreground hover:opacity-90"
                      >
                        Use this
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </>
      )}
    </div>
  );
}

// ─── Section type forms ───────────────────────────────────────────────

function PersonalFields({
  cvID,
  content,
  onChange,
}: {
  /* eslint-disable-next-line @typescript-eslint/no-unused-vars */ cvID: string;
  content: Record<string, unknown>;
  onChange: (c: Record<string, unknown>) => void;
}) {
  const c = content as Record<string, string>;
  const set = (k: string, v: string) => onChange({ ...c, [k]: v });
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      <TextField label="Full name" value={c.name ?? ""} onChange={(v) => set("name", v)} />
      <TextField label="Title / Role" value={c.title ?? ""} onChange={(v) => set("title", v)} />
      <TextField label="Email" value={c.email ?? ""} onChange={(v) => set("email", v)} placeholder="hello@example.com" />
      <TextField label="Phone" value={c.phone ?? ""} onChange={(v) => set("phone", v)} />
      <TextField label="Location" value={c.location ?? ""} onChange={(v) => set("location", v)} placeholder="City, Country" />
      <TextField label="LinkedIn" value={c.linkedin ?? ""} onChange={(v) => set("linkedin", v)} />
      <TextField label="GitHub" value={c.github ?? ""} onChange={(v) => set("github", v)} />
      <TextField label="Website" value={c.website ?? ""} onChange={(v) => set("website", v)} />
    </div>
  );
}

function SummaryField({
  cvID,
  content,
  onChange,
}: {
  /* eslint-disable-next-line @typescript-eslint/no-unused-vars */ cvID: string;
  content: Record<string, unknown>;
  onChange: (c: Record<string, unknown>) => void;
}) {
  const text = (content.text as string) ?? "";
  return (
    <TextAreaField
      label="Professional summary"
      value={text}
      onChange={(v) => onChange({ text: v })}
      placeholder="2-3 sentences that introduce who you are and what you're great at."
      cvID={cvID}
      fieldPath="summary.text"
      rows={4}
    />
  );
}

function ExperienceList({
  cvID,
  content,
  onChange,
}: {
  /* eslint-disable-next-line @typescript-eslint/no-unused-vars */ cvID: string;
  content: Record<string, unknown>;
  onChange: (c: Record<string, unknown>) => void;
}) {
  const items = (content.items as Record<string, unknown>[]) ?? [];
  const set = (idx: number, item: Record<string, unknown>) => {
    const next = [...items];
    next[idx] = item;
    onChange({ items: next });
  };
  const add = () =>
    onChange({
      items: [...items, { title: "", company: "", period: "", location: "", bullets: [] }],
    });
  const del = (idx: number) => onChange({ items: items.filter((_, i) => i !== idx) });
  return (
    <div className="space-y-4">
      {items.map((it, idx) => {
        const bullets = (it.bullets as string[]) ?? [];
        return (
          <div key={idx} className="rounded-xl border bg-secondary/20 p-4">
            <div className="grid gap-3 sm:grid-cols-2">
              <TextField label="Job title" value={(it.title as string) ?? ""} onChange={(v) => set(idx, { ...it, title: v })} />
              <TextField label="Company" value={(it.company as string) ?? ""} onChange={(v) => set(idx, { ...it, company: v })} />
              <TextField label="Period" value={(it.period as string) ?? ""} onChange={(v) => set(idx, { ...it, period: v })} placeholder="Jan 2022 - Present" />
              <TextField label="Location" value={(it.location as string) ?? ""} onChange={(v) => set(idx, { ...it, location: v })} />
            </div>

            <div className="mt-3">
              <div className="mb-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Bullet points
              </div>
              {bullets.map((b, bi) => (
                <div key={bi} className="mb-2 flex items-start gap-2">
                  <span className="mt-2 size-1 shrink-0 rounded-full bg-muted-foreground" />
                  <div className="flex-1">
                    <TextAreaField
                      label=""
                      value={b}
                      onChange={(v) => {
                        const next = [...bullets];
                        next[bi] = v;
                        set(idx, { ...it, bullets: next });
                      }}
                      placeholder="Led the redesign of …"
                      cvID={cvID}
                      fieldPath={`experience.items[${idx}].bullets[${bi}]`}
                      improveContext={{ job_title: it.title, company: it.company }}
                      rows={2}
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      const next = bullets.filter((_, i) => i !== bi);
                      set(idx, { ...it, bullets: next });
                    }}
                    className="mt-1 text-muted-foreground hover:text-destructive"
                    aria-label="Remove bullet"
                  >
                    <X className="size-3.5" />
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={() => set(idx, { ...it, bullets: [...bullets, ""] })}
                className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline"
              >
                <Plus className="size-3" /> Add bullet
              </button>
            </div>

            <button
              type="button"
              onClick={() => del(idx)}
              className="mt-3 inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-destructive"
            >
              <Trash2 className="size-3" /> Remove role
            </button>
          </div>
        );
      })}
      <button
        type="button"
        onClick={add}
        className="inline-flex items-center gap-1.5 rounded-lg border-2 border-dashed border-border px-3 py-2 text-sm font-semibold hover:border-primary/40 hover:text-primary"
      >
        <Plus className="size-3.5" /> Add experience
      </button>
    </div>
  );
}

function EducationList({
  content,
  onChange,
}: {
  content: Record<string, unknown>;
  onChange: (c: Record<string, unknown>) => void;
}) {
  const items = (content.items as Record<string, unknown>[]) ?? [];
  const set = (idx: number, item: Record<string, unknown>) => {
    const next = [...items];
    next[idx] = item;
    onChange({ items: next });
  };
  return (
    <div className="space-y-4">
      {items.map((it, idx) => (
        <div key={idx} className="rounded-xl border bg-secondary/20 p-4">
          <div className="grid gap-3 sm:grid-cols-2">
            <TextField label="Degree" value={(it.degree as string) ?? ""} onChange={(v) => set(idx, { ...it, degree: v })} />
            <TextField label="School" value={(it.school as string) ?? ""} onChange={(v) => set(idx, { ...it, school: v })} />
            <TextField label="Period" value={(it.period as string) ?? ""} onChange={(v) => set(idx, { ...it, period: v })} />
            <TextField label="GPA" value={(it.gpa as string) ?? ""} onChange={(v) => set(idx, { ...it, gpa: v })} />
            <TextField label="Honors" value={(it.honors as string) ?? ""} onChange={(v) => set(idx, { ...it, honors: v })} />
          </div>
          <button
            type="button"
            onClick={() => onChange({ items: items.filter((_, i) => i !== idx) })}
            className="mt-3 inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-destructive"
          >
            <Trash2 className="size-3" /> Remove
          </button>
        </div>
      ))}
      <button
        type="button"
        onClick={() =>
          onChange({
            items: [...items, { degree: "", school: "", period: "", gpa: "", honors: "" }],
          })
        }
        className="inline-flex items-center gap-1.5 rounded-lg border-2 border-dashed border-border px-3 py-2 text-sm font-semibold hover:border-primary/40 hover:text-primary"
      >
        <Plus className="size-3.5" /> Add education
      </button>
    </div>
  );
}

function SkillsFields({
  content,
  onChange,
}: {
  content: Record<string, unknown>;
  onChange: (c: Record<string, unknown>) => void;
}) {
  const technical = ((content.technical as string[]) ?? []).join(", ");
  const soft = ((content.soft as string[]) ?? []).join(", ");
  return (
    <div className="space-y-4">
      <label className="block">
        <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Technical skills (comma-separated)
        </span>
        <input
          type="text"
          defaultValue={technical}
          onBlur={(e) =>
            onChange({
              ...content,
              technical: e.target.value
                .split(",")
                .map((s) => s.trim())
                .filter(Boolean),
            })
          }
          placeholder="Go, TypeScript, Postgres, Docker"
          className="mt-1 w-full rounded-lg border bg-card px-3 py-2 text-sm"
        />
      </label>
      <label className="block">
        <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Soft skills (comma-separated)
        </span>
        <input
          type="text"
          defaultValue={soft}
          onBlur={(e) =>
            onChange({
              ...content,
              soft: e.target.value
                .split(",")
                .map((s) => s.trim())
                .filter(Boolean),
            })
          }
          placeholder="Leadership, Communication"
          className="mt-1 w-full rounded-lg border bg-card px-3 py-2 text-sm"
        />
      </label>
    </div>
  );
}

function LanguagesList({
  content,
  onChange,
}: {
  content: Record<string, unknown>;
  onChange: (c: Record<string, unknown>) => void;
}) {
  const items = (content.items as Record<string, unknown>[]) ?? [];
  return (
    <div className="space-y-3">
      {items.map((it, idx) => (
        <div key={idx} className="flex items-center gap-2">
          <input
            type="text"
            value={(it.name as string) ?? ""}
            onChange={(e) => {
              const next = [...items];
              next[idx] = { ...it, name: e.target.value };
              onChange({ items: next });
            }}
            placeholder="Language"
            className="flex-1 rounded-lg border bg-card px-3 py-2 text-sm"
          />
          <input
            type="text"
            value={(it.level as string) ?? ""}
            onChange={(e) => {
              const next = [...items];
              next[idx] = { ...it, level: e.target.value };
              onChange({ items: next });
            }}
            placeholder="Level"
            className="w-32 rounded-lg border bg-card px-3 py-2 text-sm"
          />
          <button
            onClick={() => onChange({ items: items.filter((_, i) => i !== idx) })}
            className="text-muted-foreground hover:text-destructive"
          >
            <X className="size-3.5" />
          </button>
        </div>
      ))}
      <button
        type="button"
        onClick={() => onChange({ items: [...items, { name: "", level: "" }] })}
        className="inline-flex items-center gap-1.5 rounded-lg border-2 border-dashed border-border px-3 py-2 text-sm font-semibold hover:border-primary/40 hover:text-primary"
      >
        <Plus className="size-3.5" /> Add language
      </button>
    </div>
  );
}

function ProjectsList({
  cvID,
  content,
  onChange,
}: {
  /* eslint-disable-next-line @typescript-eslint/no-unused-vars */ cvID: string;
  content: Record<string, unknown>;
  onChange: (c: Record<string, unknown>) => void;
}) {
  const items = (content.items as Record<string, unknown>[]) ?? [];
  const set = (idx: number, item: Record<string, unknown>) => {
    const next = [...items];
    next[idx] = item;
    onChange({ items: next });
  };
  return (
    <div className="space-y-4">
      {items.map((it, idx) => (
        <div key={idx} className="rounded-xl border bg-secondary/20 p-4">
          <div className="grid gap-3 sm:grid-cols-2">
            <TextField label="Name" value={(it.name as string) ?? ""} onChange={(v) => set(idx, { ...it, name: v })} />
            <TextField label="Link" value={(it.link as string) ?? ""} onChange={(v) => set(idx, { ...it, link: v })} />
          </div>
          <div className="mt-3">
            <TextAreaField
              label="Description"
              value={(it.description as string) ?? ""}
              onChange={(v) => set(idx, { ...it, description: v })}
              cvID={cvID}
              fieldPath={`projects.items[${idx}].description`}
              rows={2}
            />
          </div>
          <div className="mt-3">
            <TextField
              label="Tech (comma-separated)"
              value={((it.tech as string[]) ?? []).join(", ")}
              onChange={(v) =>
                set(idx, {
                  ...it,
                  tech: v.split(",").map((s) => s.trim()).filter(Boolean),
                })
              }
            />
          </div>
          <button
            type="button"
            onClick={() => onChange({ items: items.filter((_, i) => i !== idx) })}
            className="mt-3 inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-destructive"
          >
            <Trash2 className="size-3" /> Remove
          </button>
        </div>
      ))}
      <button
        type="button"
        onClick={() =>
          onChange({ items: [...items, { name: "", description: "", tech: [], link: "" }] })
        }
        className="inline-flex items-center gap-1.5 rounded-lg border-2 border-dashed border-border px-3 py-2 text-sm font-semibold hover:border-primary/40 hover:text-primary"
      >
        <Plus className="size-3.5" /> Add project
      </button>
    </div>
  );
}

function AwardsList({
  content,
  onChange,
}: {
  content: Record<string, unknown>;
  onChange: (c: Record<string, unknown>) => void;
}) {
  return (
    <SimpleItemList
      content={content}
      onChange={onChange}
      fields={[
        { key: "title", label: "Title" },
        { key: "issuer", label: "Issuer" },
        { key: "year", label: "Year" },
      ]}
      emptyItem={{ title: "", issuer: "", year: "" }}
      addLabel="Add award"
    />
  );
}

function CertsList({
  content,
  onChange,
}: {
  content: Record<string, unknown>;
  onChange: (c: Record<string, unknown>) => void;
}) {
  return (
    <SimpleItemList
      content={content}
      onChange={onChange}
      fields={[
        { key: "name", label: "Name" },
        { key: "issuer", label: "Issuer" },
        { key: "year", label: "Year" },
      ]}
      emptyItem={{ name: "", issuer: "", year: "" }}
      addLabel="Add certification"
    />
  );
}

function SimpleItemList({
  content,
  onChange,
  fields,
  emptyItem,
  addLabel,
}: {
  content: Record<string, unknown>;
  onChange: (c: Record<string, unknown>) => void;
  fields: { key: string; label: string }[];
  emptyItem: Record<string, unknown>;
  addLabel: string;
}) {
  const items = (content.items as Record<string, unknown>[]) ?? [];
  return (
    <div className="space-y-3">
      {items.map((it, idx) => (
        <div key={idx} className="rounded-xl border bg-secondary/20 p-3">
          <div className="grid gap-2 sm:grid-cols-3">
            {fields.map((f) => (
              <TextField
                key={f.key}
                label={f.label}
                value={(it[f.key] as string) ?? ""}
                onChange={(v) => {
                  const next = [...items];
                  next[idx] = { ...it, [f.key]: v };
                  onChange({ items: next });
                }}
              />
            ))}
          </div>
          <button
            type="button"
            onClick={() => onChange({ items: items.filter((_, i) => i !== idx) })}
            className="mt-2 text-xs text-muted-foreground hover:text-destructive"
          >
            Remove
          </button>
        </div>
      ))}
      <button
        type="button"
        onClick={() => onChange({ items: [...items, emptyItem] })}
        className="inline-flex items-center gap-1.5 rounded-lg border-2 border-dashed border-border px-3 py-2 text-sm font-semibold hover:border-primary/40 hover:text-primary"
      >
        <Plus className="size-3.5" /> {addLabel}
      </button>
    </div>
  );
}
