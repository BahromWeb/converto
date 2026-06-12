"use client";

import { useState } from "react";
import { Button } from "@converto/ui/components/button";
import { Card } from "@converto/ui/components/card";
import { JobStatusPanel } from "@/components/tools/job-status";
import { useJobRunner } from "@/components/tools/use-job-runner";

const pageSizes = ["A4", "A3", "A5", "Letter", "Legal", "B4", "B5"];

/** Snapshot any public URL as a PDF. */
export function UrlToPdfClient() {
  const [url, setUrl] = useState("https://convertpdfgo.com");
  const [pageSize, setPageSize] = useState("A4");
  const [landscape, setLandscape] = useState(false);
  const [waitFor, setWaitFor] = useState("1s");
  const runner = useJobRunner();

  async function onSubmit() {
    if (!url.trim()) return;
    await runner.run(
      [],
      () => ({ url, page_size: pageSize, landscape, wait_for: waitFor }),
      "url-to-pdf",
    );
  }

  return (
    <Card className="grid gap-6 p-8">
      <label className="grid gap-1.5">
        <span className="text-sm font-medium">URL</span>
        <input
          type="url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="https://example.com"
          className="w-full rounded-lg border bg-card px-3 py-2 text-sm focus:border-primary focus:outline-none"
        />
      </label>
      <div className="grid gap-4 md:grid-cols-3">
        <label className="grid gap-1.5">
          <span className="text-sm font-medium">Page size</span>
          <select
            value={pageSize}
            onChange={(e) => setPageSize(e.target.value)}
            className="w-full rounded-lg border bg-card px-3 py-2 text-sm focus:border-primary focus:outline-none"
          >
            {pageSizes.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </label>
        <label className="flex items-end gap-2 pb-2 text-sm">
          <input
            type="checkbox"
            checked={landscape}
            onChange={(e) => setLandscape(e.target.checked)}
            className="size-4 accent-primary"
          />
          <span>Landscape orientation</span>
        </label>
        <label className="grid gap-1.5">
          <span className="text-sm font-medium">Wait for</span>
          <input
            type="text"
            value={waitFor}
            onChange={(e) => setWaitFor(e.target.value)}
            placeholder="1s · 2s · selector"
            className="w-full rounded-lg border bg-card px-3 py-2 text-sm focus:border-primary focus:outline-none"
          />
        </label>
      </div>
      <div className="flex justify-end">
        <Button
          size="lg"
          disabled={!url.trim() || runner.phase === "uploading" || runner.phase === "running"}
          onClick={onSubmit}
        >
          Capture page →
        </Button>
      </div>
      <JobStatusPanel
        phase={runner.phase}
        error={runner.error}
        onDownload={() => runner.download("page.pdf")}
        onReset={runner.reset}
        downloadLabel="Download PDF"
      />
    </Card>
  );
}
