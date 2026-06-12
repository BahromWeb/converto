"use client";

import { useState } from "react";
import { Trash2, Loader2 } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@converto/ui/components/avatar";
import { Badge } from "@converto/ui/components/badge";
import { Button } from "@converto/ui/components/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@converto/ui/components/table";
import type { User } from "@converto/types";
import { cn } from "@converto/ui/lib/utils";

const planStyles: Record<User["plan"], string> = {
  free: "bg-secondary text-muted-foreground",
  pro: "bg-primary/15 text-primary",
  team: "bg-foreground text-background",
  enterprise: "bg-emerald-100 text-emerald-700",
};

const statusStyles: Record<User["status"], string> = {
  active: "bg-emerald-500",
  suspended: "bg-rose-500",
  pending: "bg-amber-500",
};

function initials(name: string) {
  return name
    .split(" ")
    .map((p) => p[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

/** Absolute join date, e.g. "13 Jun 2026". */
function formatJoined(iso: string) {
  const d = new Date(iso);
  if (isNaN(d.getTime())) return "—";
  return d.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
}

export interface UsersTableProps {
  users: User[];
  /** Deletes a user by id; resolves when the row can be removed. */
  onDelete: (id: string) => Promise<void>;
}

export function UsersTable({ users, onDelete }: UsersTableProps) {
  const [busy, setBusy] = useState<string | null>(null);

  async function handleDelete(user: User) {
    if (!window.confirm(`Delete ${user.name} (${user.email})? This cannot be undone.`)) return;
    setBusy(user.id);
    try {
      await onDelete(user.id);
    } catch (e) {
      window.alert(e instanceof Error ? e.message : "Delete failed");
    } finally {
      setBusy(null);
    }
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[42%]">Person</TableHead>
          <TableHead>Plan</TableHead>
          <TableHead>Joined</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="w-12 text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {users.map((user) => (
          <TableRow key={user.id}>
            <TableCell>
              <div className="flex items-center gap-3">
                <Avatar className="size-9">
                  <AvatarImage src={user.avatarUrl ?? ""} alt={user.name} />
                  <AvatarFallback>{initials(user.name)}</AvatarFallback>
                </Avatar>
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium">{user.name}</p>
                  <p className="truncate text-xs text-muted-foreground">{user.email}</p>
                </div>
              </div>
            </TableCell>
            <TableCell>
              <Badge variant="outline" className={cn("capitalize", planStyles[user.plan])}>
                {user.plan === "team" ? "admin" : user.plan}
              </Badge>
            </TableCell>
            <TableCell className="text-sm text-muted-foreground tabular-nums">
              {formatJoined(user.createdAt)}
            </TableCell>
            <TableCell>
              <span className="inline-flex items-center gap-2 text-sm capitalize">
                <span className={cn("size-1.5 rounded-full", statusStyles[user.status])} />
                {user.status}
              </span>
            </TableCell>
            <TableCell className="text-right">
              <Button
                variant="ghost"
                size="icon"
                aria-label={`Delete ${user.name}`}
                disabled={busy === user.id}
                onClick={() => handleDelete(user)}
                className="text-muted-foreground hover:text-rose-600"
              >
                {busy === user.id ? (
                  <Loader2 className="size-4 animate-spin" />
                ) : (
                  <Trash2 className="size-4" />
                )}
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
