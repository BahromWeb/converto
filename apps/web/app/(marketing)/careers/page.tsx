import type { Metadata } from "next";
import { ComingSoon } from "@/components/marketing/coming-soon";

export const metadata: Metadata = { title: "Careers" };

export default function CareersPage() {
  return (
    <ComingSoon
      title="We're hiring soon"
      description="No open roles right now, but we're growing. Send your CV to jobs@converto.io and we'll keep you in mind."
    />
  );
}
