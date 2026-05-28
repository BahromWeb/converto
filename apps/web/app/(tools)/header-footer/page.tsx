import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ToolPageShell } from "@/components/tools/tool-page-shell";
import { getToolBySlug } from "@converto/data";
import { HeaderFooterClient } from "./header-footer-client";

export const metadata: Metadata = {
  title: "Header & Footer",
  description: "Drop a header or footer on every page.",
  alternates: { canonical: "/header-footer" },
};

export default function Page() {
  const tool = getToolBySlug("header-footer");
  if (!tool) notFound();

  return (
    <ToolPageShell tool={tool} index="18">
      <HeaderFooterClient />
    </ToolPageShell>
  );
}
