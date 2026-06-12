import { NextResponse, type NextRequest } from "next/server";

// Gate every dashboard route behind an admin session. The token cookie is set
// by the login flow (lib/api.ts). No token → bounce to /login; visiting
// /login while already signed in → bounce to the dashboard.
const TOKEN_COOKIE = "admin_token";

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const hasToken = Boolean(req.cookies.get(TOKEN_COOKIE)?.value);
  const isLogin = pathname === "/login";

  if (!hasToken && !isLogin) {
    const url = req.nextUrl.clone();
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }
  if (hasToken && isLogin) {
    const url = req.nextUrl.clone();
    url.pathname = "/";
    return NextResponse.redirect(url);
  }
  return NextResponse.next();
}

export const config = {
  // Skip Next internals, the auth API, and static files.
  matcher: ["/((?!_next|auth|favicon.ico|.*\\..*).*)"],
};
