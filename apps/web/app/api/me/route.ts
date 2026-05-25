import { NextRequest, NextResponse } from "next/server";

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "https://convertpdfgo.com";

// GET /me — returns ApiResponse<AuthUser>
export async function GET(req: NextRequest) {
  const authorization = req.headers.get("authorization") ?? "";

  const res = await fetch(`${API_BASE}/me`, {
    headers: { Authorization: authorization },
  });

  const data = await res.json();
  return NextResponse.json(data, { status: res.status });
}

// PUT /me — update name, returns ApiResponse
export async function PUT(req: NextRequest) {
  const authorization = req.headers.get("authorization") ?? "";
  const body = await req.json().catch(() => ({}));

  const res = await fetch(`${API_BASE}/me`, {
    method: "PUT",
    headers: {
      Authorization: authorization,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  const data = await res.json();
  return NextResponse.json(data, { status: res.status });
}
