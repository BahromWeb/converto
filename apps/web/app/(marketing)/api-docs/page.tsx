import type { Metadata } from "next";
import { ComingSoon } from "@/components/marketing/coming-soon";


// Marketing pages are mostly static — render at build time and revalidate hourly
// so the next-build picks up locale + tools.length changes within an hour.
export const revalidate = 3600

export const metadata: Metadata = { title: "API", alternates: { canonical: "/api-docs" } };

export default function ApiDocsPage() {
  return (
    <ComingSoon
      title="API Documentation"
      description="A REST API for developers to integrate convertpdfgo's PDF tools into their own apps. Launching soon — join the waitlist at api@convertpdfgo.com."
    />
  );
}
