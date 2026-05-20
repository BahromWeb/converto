import type { JobStatus } from "@converto/types";
import { cn } from "@converto/ui/lib/utils";

const styles: Record<JobStatus, string> = {
  queued: "bg-secondary text-muted-foreground",
  processing: "bg-primary/10 text-primary",
  completed: "bg-emerald-50 text-emerald-700",
  failed: "bg-rose-50 text-rose-700",
};

const dotStyles: Record<JobStatus, string> = {
  queued: "bg-muted-foreground",
  processing: "bg-primary animate-pulse",
  completed: "bg-emerald-500",
  failed: "bg-rose-500",
};

const labels: Record<JobStatus, string> = {
  queued: "Queued",
  processing: "Processing",
  completed: "Completed",
  failed: "Failed",
};

export function JobStatusBadge({ status }: { status: JobStatus }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold",
        styles[status],
      )}
    >
      <span className={cn("size-1.5 rounded-full", dotStyles[status])} />
      {labels[status]}
    </span>
  );
}
