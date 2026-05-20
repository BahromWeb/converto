import type { Metadata } from "next";
import { ComingSoon } from "@/components/marketing/coming-soon";

export const metadata: Metadata = { title: "Press Kit" };

export default function PressPage() {
  return (
    <ComingSoon
      title="Press Kit"
      description="Logos, screenshots, and brand assets coming soon. For press enquiries email press@converto.io."
    />
  );
}
