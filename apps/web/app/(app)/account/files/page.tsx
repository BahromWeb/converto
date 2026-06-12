"use client";

import { useEffect, useState } from "react";
import { Download, Trash2, FileText, RefreshCw } from "lucide-react";
import { Button } from "@converto/ui/components/button";
import { Card } from "@converto/ui/components/card";
import { api, downloadFile } from "@/lib/api";

type FileRow = {
  id: string;
  file_name: string;
  file_type: string;
  file_size: number;
  uploaded_at: string;
};

/**
 * "My files" — backed by GET /file/list. Auth-only; the API returns
 * 401 for guests, and the route's middleware kicks in for unauthorised
 * sessions. Refresh button reruns the query so a freshly-finished
 * conversion appears without a full page reload.
 */
export default function MyFilesPage() {
  const [files, setFiles] = useState<FileRow[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function load() {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get<FileRow[]>("/file/list");
      setFiles(res.Data ?? []);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function onDelete(id: string) {
    if (!confirm("Delete this file?")) return;
    try {
      await api.delete(`/file/${id}`);
      setFiles((curr) => (curr ?? []).filter((f) => f.id !== id));
    } catch (e) {
      alert(e instanceof Error ? e.message : "Delete failed");
    }
  }

  return (
    <section className="container py-12">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">My files</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Everything you&apos;ve uploaded or generated. Auto-deleted after 5 minutes.
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={load} disabled={loading}>
          <RefreshCw className={`mr-1.5 size-4 ${loading ? "animate-spin" : ""}`} />
          Refresh
        </Button>
      </div>

      <Card className="p-0">
        {error && (
          <div className="border-b border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive">
            {error}
          </div>
        )}

        {loading && !files && (
          <div className="p-8 text-center text-sm text-muted-foreground">Loading…</div>
        )}

        {files && files.length === 0 && (
          <div className="p-12 text-center">
            <FileText className="mx-auto size-10 text-muted-foreground" />
            <p className="mt-3 font-medium">No files yet</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Upload a PDF in any tool and it&apos;ll show up here.
            </p>
          </div>
        )}

        {files && files.length > 0 && (
          <ul className="divide-y">
            {files.map((f) => (
              <li key={f.id} className="flex items-center justify-between gap-4 px-4 py-3 text-sm">
                <span className="flex min-w-0 flex-1 items-center gap-3">
                  <FileText className="size-4 shrink-0 text-muted-foreground" />
                  <span className="truncate font-medium">{f.file_name}</span>
                </span>
                <span className="shrink-0 text-xs text-muted-foreground">
                  {(f.file_size / 1024 / 1024).toFixed(1)} MB
                </span>
                <span className="shrink-0 text-xs text-muted-foreground">
                  {new Date(f.uploaded_at).toLocaleTimeString()}
                </span>
                <span className="flex shrink-0 gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => downloadFile(f.id, f.file_name)}
                    aria-label={`Download ${f.file_name}`}
                  >
                    <Download className="size-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onDelete(f.id)}
                    aria-label={`Delete ${f.file_name}`}
                  >
                    <Trash2 className="size-4 text-destructive" />
                  </Button>
                </span>
              </li>
            ))}
          </ul>
        )}
      </Card>
    </section>
  );
}
