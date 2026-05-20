import { MoreHorizontal } from "lucide-react";
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
import { formatRelativeTime } from "@converto/utils";
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

export interface UsersTableProps {
  users: User[];
  now: number;
}

export function UsersTable({ users, now }: UsersTableProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[44%]">Person</TableHead>
          <TableHead>Plan</TableHead>
          <TableHead>Country</TableHead>
          <TableHead>Last seen</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="w-12" />
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
                {user.plan}
              </Badge>
            </TableCell>
            <TableCell>
              <span className="font-mono text-xs uppercase tracking-wider">{user.country}</span>
            </TableCell>
            <TableCell className="text-sm text-muted-foreground">
              {formatRelativeTime(user.lastSeenAt, now)}
            </TableCell>
            <TableCell>
              <span className="inline-flex items-center gap-2 text-sm capitalize">
                <span className={cn("size-1.5 rounded-full", statusStyles[user.status])} />
                {user.status}
              </span>
            </TableCell>
            <TableCell>
              <Button variant="ghost" size="icon" aria-label={`Actions for ${user.name}`}>
                <MoreHorizontal className="size-4" />
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
