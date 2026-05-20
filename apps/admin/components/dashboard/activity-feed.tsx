import { Card } from "@converto/ui/components/card";
import { formatRelativeTime, formatBytes } from "@converto/utils";
import { mockJobs, mockUsers, getToolBySlug } from "@converto/data";
import { JobStatusBadge } from "@/components/jobs/job-status-badge";
import { Avatar, AvatarFallback } from "@converto/ui/components/avatar";

export interface ActivityFeedProps {
  now: number;
}

function initials(name: string) {
  return name
    .split(" ")
    .map((p) => p[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

export function ActivityFeed({ now }: ActivityFeedProps) {
  const recent = mockJobs.slice(0, 6);

  return (
    <Card className="overflow-hidden">
      {/* Card header */}
      <div className="flex items-center justify-between border-b border-border px-6 py-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
            Recent activity
          </p>
          <h3 className="mt-0.5 text-lg font-bold text-foreground">Last 30 minutes</h3>
        </div>
        <span className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
          <span className="size-1.5 animate-pulse rounded-full bg-emerald-500" />
          Live
        </span>
      </div>

      {/* Feed rows */}
      <ul className="divide-y divide-border">
        {recent.map((job) => {
          const tool = getToolBySlug(job.tool);
          const user = mockUsers.find((u) => u.id === job.userId);
          return (
            <li key={job.id} className="flex items-center gap-4 px-6 py-4 transition-colors hover:bg-secondary/40">
              <Avatar className="size-9 shrink-0">
                <AvatarFallback className="bg-secondary text-xs font-bold">
                  {user ? initials(user.name) : "??"}
                </AvatarFallback>
              </Avatar>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm">
                  <span className="font-semibold text-foreground">{user?.name ?? "Unknown"}</span>
                  <span className="text-muted-foreground">
                    {" "}ran{" "}
                    <span className="font-semibold text-foreground">
                      {tool?.name ?? job.tool}
                    </span>
                    {job.status === "completed"
                      ? ` · ${formatBytes(job.outputBytes)}`
                      : null}
                  </span>
                </p>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  {formatRelativeTime(job.createdAt, now)}
                </p>
              </div>
              <JobStatusBadge status={job.status} />
            </li>
          );
        })}
      </ul>
    </Card>
  );
}
