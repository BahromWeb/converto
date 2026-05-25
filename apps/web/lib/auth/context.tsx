"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { api, clearTokens, setTokens, type TokenPair } from "@/lib/api";

// ─── Types matching GET /me response exactly ─────────────────────────────────

export type AuthUser = {
  id: string;
  name: string;
  email: string;
  status: string;
  role: string;
  created_at: string;
  created_by: string;
};

export type AuthHistoryEvent = {
  id: string;
  user_id: string;
  email: string;
  event: string;
  provider: string;
  ip: string;
  user_agent: string;
  created_at: string;
};

export type InviteInfo = {
  email: string;
  role: string;
};

// ─── Context shape ────────────────────────────────────────────────────────────

type AuthState = {
  user: AuthUser | null;
  loading: boolean;
  signInWithGoogle: () => void;
  signInWithGitHub: () => void;
  logout: () => Promise<void>;
  updateProfile: (name: string) => Promise<void>;
  getAuthHistory: () => Promise<AuthHistoryEvent[]>;
  acceptInvite: (token: string, password: string) => Promise<void>;
  getInviteInfo: (token: string) => Promise<InviteInfo | null>;
  refreshUser: () => Promise<void>;
};

const AuthContext = createContext<AuthState | null>(null);

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "https://convertpdfgo.com";

// ─── Provider ─────────────────────────────────────────────────────────────────

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  // GET /me — returns the user object directly (wrapped in ApiResponse)
  const fetchUser = useCallback(async () => {
    try {
      const res = await api.get<AuthUser>("/me");
      // Swagger: 200 → { StatusCode, Description, Data: { id, name, email, ... } }
      if (res.StatusCode === 200 && res.Data) {
        setUser(res.Data);
      } else {
        setUser(null);
      }
    } catch {
      setUser(null);
    }
  }, []);

  // On mount: if we have a stored token, fetch the user profile
  useEffect(() => {
    if (typeof window === "undefined") return;
    const token = localStorage.getItem("access_token");
    if (token) {
      fetchUser().finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [fetchUser]);

  // ─── OAuth redirect handlers ─────────────────────────────────────────────

  const signInWithGoogle = useCallback(() => {
    // GET /auth/google → 307 to Google OAuth
    window.location.href = `${API_BASE}/auth/google`;
  }, []);

  const signInWithGitHub = useCallback(() => {
    // GET /auth/github → redirect to GitHub OAuth
    window.location.href = `${API_BASE}/auth/github`;
  }, []);

  // ─── POST /auth/logout ───────────────────────────────────────────────────

  const logout = useCallback(async () => {
    try {
      // Requires Bearer token — api.post adds it automatically
      await api.post("/auth/logout");
    } catch {
      // Even if the server call fails, clear local tokens
    } finally {
      clearTokens();
      setUser(null);
    }
  }, []);

  // ─── PUT /me ─────────────────────────────────────────────────────────────

  const updateProfile = useCallback(async (name: string) => {
    const res = await api.put<AuthUser>("/me", { name });
    if (res.StatusCode === 200) {
      // Re-fetch to get the full updated profile
      await fetchUser();
    } else {
      const errors = (res.Data as unknown as { errors?: Record<string, string> })?.errors;
      throw new Error(errors?.name ?? res.Description ?? "Update failed");
    }
  }, [fetchUser]);

  // ─── GET /me/auth-history ────────────────────────────────────────────────

  const getAuthHistory = useCallback(async (): Promise<AuthHistoryEvent[]> => {
    // Swagger: returns array directly wrapped in ApiResponse
    const res = await api.get<AuthHistoryEvent[]>("/me/auth-history");
    if (res.StatusCode === 200 && Array.isArray(res.Data)) {
      return res.Data;
    }
    return [];
  }, []);

  // ─── GET /auth/invite/{token} ────────────────────────────────────────────

  const getInviteInfo = useCallback(async (token: string): Promise<InviteInfo | null> => {
    try {
      const res = await api.get<InviteInfo>(`/auth/invite/${token}`);
      if (res.StatusCode === 200 && res.Data) return res.Data;
      return null;
    } catch {
      return null;
    }
  }, []);

  // ─── POST /auth/accept-invite ────────────────────────────────────────────

  const acceptInvite = useCallback(async (token: string, password: string) => {
    // Returns { access_token, refresh_token } directly (no wrapper)
    const json = await api.raw.post<TokenPair>("/auth/accept-invite", {
      token,
      password,
    });
    if (!json.access_token) throw new Error("Invalid invite or password too short");
    setTokens(json.access_token, json.refresh_token);
    await fetchUser();
  }, [fetchUser]);

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        signInWithGoogle,
        signInWithGitHub,
        logout,
        updateProfile,
        getAuthHistory,
        acceptInvite,
        getInviteInfo,
        refreshUser: fetchUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// ─── Hook ──────────────────────────────────────────────────────────────────────

export function useAuth(): AuthState {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}
