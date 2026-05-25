import { redirect } from "next/navigation";

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "https://convertpdfgo.com";

export function GET() {
  redirect(`${API_BASE}/auth/google`);
}
