import type { Metadata } from "next";
import { FaqSection } from "@/components/marketing/faq-section";

export const metadata: Metadata = {
  title: "FAQ",
  description: "Questions people actually ask about Converto.",
};

export default function FaqPage() {
  return <FaqSection />;
}
