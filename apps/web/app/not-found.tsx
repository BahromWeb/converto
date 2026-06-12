import { AppShell } from "@/components/layout/app-shell";
import { NotFoundView } from "@/components/layout/not-found-view";

// Global 404. Root layout is a pass-through, so this owns its own document
// via AppShell. Defaults to English chrome.
export default function NotFound() {
  return (
    <AppShell locale="en">
      <NotFoundView />
    </AppShell>
  );
}
