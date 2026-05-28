"use client";

import { useEffect, useState } from "react";
import { Cloud, Check, AlertCircle } from "lucide-react";
import { Button } from "@converto/ui/components/button";
import {
  exportFileToCloud,
  getStorageProviders,
  type StorageProvider,
} from "@/lib/api";

export interface SaveToCloudProps {
  fileId: string;
  filename?: string;
}

/**
 * "Save to Dropbox / Drive" buttons rendered next to the download CTA.
 * Only renders providers the user has connected — disabled ones are
 * managed from /account/connections. Silent if the user is a guest (the
 * `/api/storage/providers` call returns providers with connected=false
 * for everyone unauthenticated).
 */
export function SaveToCloud({ fileId, filename }: SaveToCloudProps) {
  const [providers, setProviders] = useState<StorageProvider[] | null>(null);
  const [busy, setBusy] = useState<string | null>(null);
  const [done, setDone] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    getStorageProviders()
      .then((p) => !cancelled && setProviders(p))
      .catch(() => !cancelled && setProviders([]));
    return () => {
      cancelled = true;
    };
  }, []);

  if (!providers) return null;
  const connected = providers.filter((p) => p.connected);
  if (!connected.length) return null;

  async function onSave(p: StorageProvider) {
    setBusy(p.name);
    setError(null);
    setDone(null);
    try {
      const path = filename ? "/" + filename : undefined;
      await exportFileToCloud(fileId, p.name, path);
      setDone(p.display_name);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Export failed");
    } finally {
      setBusy(null);
    }
  }

  return (
    <div className="mt-3 flex flex-wrap items-center gap-2">
      {connected.map((p) => (
        <Button
          key={p.name}
          size="sm"
          variant="outline"
          disabled={busy === p.name}
          onClick={() => onSave(p)}
        >
          <Cloud className="mr-1.5 size-4" />
          {busy === p.name ? "Saving…" : `Save to ${p.display_name}`}
        </Button>
      ))}
      {done && (
        <span className="flex items-center gap-1 text-xs text-primary">
          <Check className="size-3" /> Sent to {done}
        </span>
      )}
      {error && (
        <span className="flex items-center gap-1 text-xs text-destructive">
          <AlertCircle className="size-3" /> {error}
        </span>
      )}
    </div>
  );
}
