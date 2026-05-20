import type { Metadata } from "next";
import { ComingSoon } from "@/components/marketing/coming-soon";

export const metadata: Metadata = { title: "Blog" };

export default function BlogPage() {
  return (
    <ComingSoon
      title="Blog"
      description="Tips, guides, and updates from the Converto team. Coming soon — subscribe to be notified."
    />
  );
}
