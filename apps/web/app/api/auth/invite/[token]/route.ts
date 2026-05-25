import { NextRequest, NextResponse } from "next/server";

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "https://convertpdfgo.com";

// GET /auth/invite/{token}
// Returns: { email, role } wrapped in ApiResponse
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ token: string }> },
) {
  const { token } = await params;

  const res = await fetch(`${API_BASE}/auth/invite/${token}`, {
    method: "GET",
  });

  const data = await res.json();
  return NextResponse.json(data, { status: res.status });
}
