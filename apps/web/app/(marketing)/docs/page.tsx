import type { Metadata } from "next";
import { ComingSoon } from "@/components/marketing/coming-soon";

export const metadata: Metadata = { title: "Documentation" };

export default function DocsPage() {
  return (
    <ComingSoon
      title="Documentation"
      description="Full API docs and integration guides are on the way. For now, reach out via the contact page and we'll help you get started."
    />
  );
}
