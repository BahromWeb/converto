import type { Metadata } from "next";
import { ComingSoon } from "@/components/marketing/coming-soon";

export const metadata: Metadata = { title: "API" };

export default function ApiDocsPage() {
  return (
    <ComingSoon
      title="API Documentation"
      description="A REST API for developers to integrate Converto's PDF tools into their own apps. Launching soon — join the waitlist at api@converto.io."
    />
  );
}
