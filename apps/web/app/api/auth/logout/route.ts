import { NextRequest, NextResponse } from "next/server";

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "https://convertpdfgo.com";

export async function POST(req: NextRequest) {
  const authorization = req.headers.get("authorization") ?? "";

  const res = await fetch(`${API_BASE}/auth/logout`, {
    method: "POST",
    headers: { Authorization: authorization },
  });

  const data = await res.json().catch(() => ({ StatusCode: res.status }));
  return NextResponse.json(data, { status: res.status });
}
