"use client";

import { useState } from "react";
import { Button } from "@converto/ui/components/button";
import { Card } from "@converto/ui/components/card";
import { JobStatusPanel } from "@/components/tools/job-status";
import { useJobRunner } from "@/components/tools/use-job-runner";

/**
 * HTML → PDF via Gotenberg/Chromium. No file upload here — the request
 * body carries the HTML directly, so we skip FileDropzone and call the
 * backend straight from text input.
 */
export function HtmlToPdfClient() {
  const [html, setHtml] = useState(
    "<!doctype html>\n<html>\n  <body>\n    <h1>Hello PDF</h1>\n    <p>Edit this and click convert.</p>\n  </body>\n</html>",
  );
  const runner = useJobRunner();

  async function onSubmit() {
    if (!html.trim()) return;
    // Reuse the runner's state without uploading a file: we call run()
    // with an empty file list and override buildBody to ignore the
    // (empty) uploaded IDs.
    await runner.run([], () => ({ html_content: html }), "html-to-pdf");
  }

  return (
    <Card className="grid gap-6 p-8">
      <label className="grid gap-1.5">
        <span className="text-sm font-medium">HTML source</span>
        <textarea
          value={html}
          onChange={(e) => setHtml(e.target.value)}
          spellCheck={false}
          className="min-h-[260px] w-full rounded-lg border bg-card p-3 font-mono text-xs focus:border-primary focus:outline-none"
        />
      </label>
      <div className="flex justify-end">
        <Button
          size="lg"
          disabled={!html.trim() || runner.phase === "uploading" || runner.phase === "running"}
          onClick={onSubmit}
        >
          Render PDF →
        </Button>
      </div>
      <JobStatusPanel
        phase={runner.phase}
        error={runner.error}
        onDownload={() => runner.download("rendered.pdf")}
        onReset={runner.reset}
        downloadLabel="Download PDF"
      />
    </Card>
  );
}

