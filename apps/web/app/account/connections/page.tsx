"use client";

import { useEffect, useState } from "react";
import { Cloud, Check, Link2Off, ExternalLink } from "lucide-react";
import { Button } from "@converto/ui/components/button";
import { Card } from "@converto/ui/components/card";
import {
  connectStorageProviderUrl,
  disconnectStorageProvider,
  getStorageProviders,
  type StorageProvider,
} from "@/lib/api";

/**
 * Manage cloud storage connections. `configured: false` providers (e.g.
 * OneDrive when the backend wasn't started with the env) get hidden
 * entirely — they'd be unreachable from the OAuth start endpoint
 * anyway, and showing greyed-out cards is just noise.
 */
export default function ConnectionsPage() {
  const [providers, setProviders] = useState<StorageProvider[] | null>(null);
  const [busy, setBusy] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function load() {
    setError(null);
    try {
      setProviders(await getStorageProviders());
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load providers");
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function onDisconnect(name: StorageProvider["name"]) {
    if (!confirm("Disconnect this provider?")) return;
    setBusy(name);
    try {
      await disconnectStorageProvider(name);
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Disconnect failed");
    } finally {
      setBusy(null);
    }
  }

  return (
    <section className="container py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Cloud connections</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Once you connect a provider, every tool gets a one-click &quot;Save to&quot; button
          next to the download.
        </p>
      </div>

      {error && (
        <div className="mb-4 rounded-xl border border-destructive/30 bg-destructive/5 p-3 text-sm text-destructive">
          {error}
        </div>
      )}

      <div className="grid gap-4 md:grid-cols-2">
        {providers
          ?.filter((p) => p.configured)
          .map((p) => (
            <Card key={p.name} className="flex items-center justify-between gap-4 p-5">
              <div className="flex items-center gap-3">
                <span className="grid size-10 place-items-center rounded-xl bg-primary/10">
                  <Cloud className="size-5 text-primary" />
                </span>
                <div>
                  <p className="font-semibold">{p.display_name}</p>
                  <p className="text-xs text-muted-foreground">
                    {p.connected ? "Connected" : "Not connected"}
                  </p>
                </div>
              </div>
              {p.connected ? (
                <Button
                  size="sm"
                  variant="outline"
                  disabled={busy === p.name}
                  onClick={() => onDisconnect(p.name)}
                >
                  <Link2Off className="mr-1.5 size-4" />
                  Disconnect
                </Button>
              ) : (
                <Button asChild size="sm">
                  <a href={connectStorageProviderUrl(p.name)}>
                    <Check className="mr-1.5 size-4" />
                    Connect
                    <ExternalLink className="ml-1.5 size-3.5 opacity-60" />
                  </a>
                </Button>
              )}
            </Card>
          ))}

        {providers && providers.filter((p) => p.configured).length === 0 && (
          <Card className="col-span-full p-8 text-center text-sm text-muted-foreground">
            No cloud providers configured on the server yet.
          </Card>
        )}
      </div>
    </section>
  );
}
