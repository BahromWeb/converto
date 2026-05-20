import { MoreHorizontal } from "lucide-react";
import { Button } from "@converto/ui/components/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@converto/ui/components/table";
import type { ProcessingJob, User } from "@converto/types";
import { formatBytes, formatRelativeTime } from "@converto/utils";
import { getToolBySlug } from "@converto/data";
import { JobStatusBadge } from "./job-status-badge";

export interface JobsTableProps {
  jobs: ProcessingJob[];
  users: User[];
  now: number;
}

export function JobsTable({ jobs, users, now }: JobsTableProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[18%]">Job</TableHead>
          <TableHead>Tool</TableHead>
          <TableHead>User</TableHead>
          <TableHead>Size out</TableHead>
          <TableHead>Duration</TableHead>
          <TableHead>Created</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="w-12" />
        </TableRow>
      </TableHeader>
      <TableBody>
        {jobs.map((job) => {
          const tool = getToolBySlug(job.tool);
          const user = users.find((u) => u.id === job.userId);
          return (
            <TableRow key={job.id}>
              <TableCell>
                <span className="font-mono text-xs">{job.id}</span>
              </TableCell>
              <TableCell>
                <span className="text-sm font-medium">{tool?.name ?? job.tool}</span>
              </TableCell>
              <TableCell>
                <div className="min-w-0">
                  <p className="truncate text-sm">{user?.name ?? "—"}</p>
                  <p className="truncate text-xs text-muted-foreground">{user?.email ?? "—"}</p>
                </div>
              </TableCell>
              <TableCell className="font-mono text-xs">
                {job.status === "completed" ? formatBytes(job.outputBytes) : "—"}
              </TableCell>
              <TableCell className="font-mono text-xs">
                {job.durationMs > 0 ? `${(job.durationMs / 1000).toFixed(2)}s` : "—"}
              </TableCell>
              <TableCell className="text-sm text-muted-foreground">
                {formatRelativeTime(job.createdAt, now)}
              </TableCell>
              <TableCell>
                <JobStatusBadge status={job.status} />
              </TableCell>
              <TableCell>
                <Button variant="ghost" size="icon" aria-label={`Actions for ${job.id}`}>
                  <MoreHorizontal className="size-4" />
                </Button>
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
}
