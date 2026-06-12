import type { Metadata } from "next";
import { siteConfig } from "@converto/data";
import { AppShell } from "@/components/layout/app-shell";

// Authed / non-SEO surface (account, auth flows). Not localized and kept out
// of the index — these are per-user or transient pages.
export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  robots: { index: false, follow: false },
};

export default function AppGroupLayout({ children }: { children: React.ReactNode }) {
  return <AppShell locale="en">{children}</AppShell>;
}
