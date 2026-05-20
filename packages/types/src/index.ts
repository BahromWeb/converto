/**
 * Cross-package types. Anything used by two or more workspaces lives here.
 */

// ──────────────────────────────────────────────────────────────────────────────
// Tools
// ──────────────────────────────────────────────────────────────────────────────

export type ToolCategory = "convert" | "edit" | "organize" | "secure" | "ai";
export type ToolBadge = "popular" | "new" | "ai" | "beta";

export interface Tool {
  /** Stable URL-safe identifier (e.g. "merge"). */
  slug: string;
  /** Human-readable display name. */
  name: string;
  /** Short one-liner shown on cards. */
  description: string;
  /** Bucket the tool belongs to. */
  category: ToolCategory;
  /** Marketing tag (e.g. "popular", "new", "ai"). */
  badge?: ToolBadge;
}

// ──────────────────────────────────────────────────────────────────────────────
// Site
// ──────────────────────────────────────────────────────────────────────────────

export interface SiteConfig {
  name: string;
  url: string;
  description: string;
  ogImage: string;
  links: {
    twitter?: string;
    github?: string;
  };
}

// ──────────────────────────────────────────────────────────────────────────────
// People — used by admin
// ──────────────────────────────────────────────────────────────────────────────

export type UserPlan = "free" | "pro" | "team" | "enterprise";
export type UserStatus = "active" | "suspended" | "pending";

export interface User {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
  /** ISO country code, e.g. "UZ", "US", "DE". */
  country: string;
  plan: UserPlan;
  status: UserStatus;
  createdAt: string;
  lastSeenAt: string;
}

export type AdminRole = "owner" | "admin" | "support" | "viewer";

export interface AdminUser extends User {
  role: AdminRole;
}

// ──────────────────────────────────────────────────────────────────────────────
// Jobs — used by admin (processing queue / history)
// ──────────────────────────────────────────────────────────────────────────────

export type JobStatus = "queued" | "processing" | "completed" | "failed";

export interface ProcessingJob {
  id: string;
  userId: string;
  /** Matches a `Tool.slug`. */
  tool: string;
  inputCount: number;
  outputBytes: number;
  status: JobStatus;
  durationMs: number;
  createdAt: string;
  errorCode?: string;
}

// ──────────────────────────────────────────────────────────────────────────────
// Navigation — used by admin sidebar
// ──────────────────────────────────────────────────────────────────────────────

export interface NavItem {
  label: string;
  href: string;
  /** Lucide icon name. The consumer maps name → component. */
  icon?: string;
  /** Optional inline badge (e.g. "3" or "Beta"). */
  badge?: string;
}

export interface NavSection {
  title: string;
  items: NavItem[];
}
