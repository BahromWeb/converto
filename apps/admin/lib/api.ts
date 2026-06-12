// Thin API client for the admin console. All requests are same-origin
// (Caddy proxies /auth/*, /admin/*, /api/* to the Go backend), so paths are
// relative and there is no CORS to manage. The access token lives in a
// cookie so middleware can gate dashboard routes and client fetches can read
// it for the Authorization header.

export const TOKEN_COOKIE = "admin_token";
export const REFRESH_COOKIE = "admin_refresh";

// Backend envelope: { StatusCode, Description, Data }
interface Envelope<T> {
  StatusCode: number;
  Description: string;
  Data: T;
}

interface AuthTokens {
  access_token: string;
  refresh_token: string;
}

function setCookie(name: string, value: string, maxAgeSec: number) {
  if (typeof document === "undefined") return;
  const secure = location.protocol === "https:" ? "; Secure" : "";
  document.cookie = `${name}=${encodeURIComponent(value)}; Path=/; Max-Age=${maxAgeSec}; SameSite=Lax${secure}`;
}

function getCookie(name: string): string | null {
  if (typeof document === "undefined") return null;
  const m = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`));
  return m?.[1] != null ? decodeURIComponent(m[1]) : null;
}

function clearCookie(name: string) {
  if (typeof document === "undefined") return;
  document.cookie = `${name}=; Path=/; Max-Age=0; SameSite=Lax`;
}

export function getToken(): string | null {
  return getCookie(TOKEN_COOKIE);
}

export function clearSession() {
  clearCookie(TOKEN_COOKIE);
  clearCookie(REFRESH_COOKIE);
}

/** Email + password login. Stores tokens on success; throws on failure. */
export async function login(email: string, password: string): Promise<void> {
  const res = await fetch("/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  const body = (await res.json().catch(() => null)) as Envelope<AuthTokens> | null;
  if (!res.ok || !body?.Data?.access_token) {
    throw new Error(body?.Description || "Invalid email or password");
  }
  // access ~15 min, refresh ~longer; cookie maxage generous, server enforces expiry.
  setCookie(TOKEN_COOKIE, body.Data.access_token, 60 * 60 * 12);
  setCookie(REFRESH_COOKIE, body.Data.refresh_token, 60 * 60 * 24 * 7);
}

/** Authenticated GET against an admin endpoint; returns the unwrapped Data. */
export async function apiGet<T = unknown>(path: string): Promise<T> {
  const token = getToken();
  const res = await fetch(path, {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
  if (res.status === 401) {
    clearSession();
    if (typeof window !== "undefined") window.location.href = "/login";
    throw new Error("unauthorized");
  }
  const body = (await res.json().catch(() => null)) as Envelope<T> | null;
  if (!res.ok) throw new Error(body?.Description || `request failed (${res.status})`);
  return (body?.Data as T) ?? (body as unknown as T);
}
