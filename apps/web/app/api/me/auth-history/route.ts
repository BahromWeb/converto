import { NextRequest, NextResponse } from "next/server";

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "https://convertpdfgo.com";

// GET /me/auth-history — returns array of auth events (wrapped in ApiResponse)
export async function GET(req: NextRequest) {
  const authorization = req.headers.get("authorization") ?? "";

  const res = await fetch(`${API_BASE}/me/auth-history`, {
    headers: { Authorization: authorization },
  });

  const data = await res.json();
  return NextResponse.json(data, { status: res.status });
}
