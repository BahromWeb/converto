"use client";

import { useState } from "react";
import { SimpleToolClient } from "@/components/tools/simple-tool-client";

/**
 * Update PDF document properties. Only sends fields the user actually
 * filled — the backend rejects an empty body with "no metadata fields
 * provided", so we keep the form lenient and the request lean.
 */
export function MetadataClient() {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [subject, setSubject] = useState("");
  const [keywords, setKeywords] = useState("");
  const [creator, setCreator] = useState("");

  return (
    <SimpleToolClient
      op="metadata"
      cta="Update metadata →"
      resultFilename={(f) => "meta-" + (f?.name ?? "result.pdf")}
      downloadLabel="Download PDF"
      buildExtraBody={() => {
        const body: Record<string, unknown> = {};
        if (title) body.title = title;
        if (author) body.author = author;
        if (subject) body.subject = subject;
        if (creator) body.creator = creator;
        if (keywords) {
          body.keywords = keywords
            .split(",")
            .map((s) => s.trim())
            .filter(Boolean);
        }
        return body;
      }}
      extraFields={
        <div className="grid gap-4 md:grid-cols-2">
          <label className="grid gap-1.5">
            <span className="text-sm font-medium">Title</span>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full rounded-lg border bg-card px-3 py-2 text-sm focus:border-primary focus:outline-none"
            />
          </label>
          <label className="grid gap-1.5">
            <span className="text-sm font-medium">Author</span>
            <input
              type="text"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              className="w-full rounded-lg border bg-card px-3 py-2 text-sm focus:border-primary focus:outline-none"
            />
          </label>
          <label className="grid gap-1.5">
            <span className="text-sm font-medium">Subject</span>
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="w-full rounded-lg border bg-card px-3 py-2 text-sm focus:border-primary focus:outline-none"
            />
          </label>
          <label className="grid gap-1.5">
            <span className="text-sm font-medium">Creator</span>
            <input
              type="text"
              value={creator}
              onChange={(e) => setCreator(e.target.value)}
              className="w-full rounded-lg border bg-card px-3 py-2 text-sm focus:border-primary focus:outline-none"
            />
          </label>
          <label className="grid gap-1.5 md:col-span-2">
            <span className="text-sm font-medium">Keywords (comma-separated)</span>
            <input
              type="text"
              value={keywords}
              onChange={(e) => setKeywords(e.target.value)}
              placeholder="invoice, 2026, report"
              className="w-full rounded-lg border bg-card px-3 py-2 text-sm focus:border-primary focus:outline-none"
            />
          </label>
        </div>
      }
    />
  );
}
