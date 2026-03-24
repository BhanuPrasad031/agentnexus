import { TaskState } from "../backend";

interface StatusChipProps {
  state: TaskState | string;
}

export function StatusChip({ state }: StatusChipProps) {
  const config: Record<string, { label: string; className: string }> = {
    [TaskState.inProgress]: {
      label: "In Progress",
      className:
        "bg-status-progress/15 text-[oklch(0.75_0.215_265)] border border-status-progress/30",
    },
    [TaskState.completed]: {
      label: "Completed",
      className:
        "bg-status-completed/15 text-[oklch(0.85_0.195_145)] border border-status-completed/30",
    },
    [TaskState.pending]: {
      label: "Pending",
      className:
        "bg-status-pending/15 text-[oklch(0.90_0.175_90)] border border-status-pending/30",
    },
    [TaskState.cancelled]: {
      label: "Cancelled",
      className:
        "bg-status-cancelled/15 text-[oklch(0.80_0.245_27)] border border-status-cancelled/30",
    },
  };

  const { label, className } = config[state] ?? {
    label: String(state),
    className: "bg-secondary text-muted-foreground border border-border",
  };

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${className}`}
    >
      <span className="w-1.5 h-1.5 rounded-full mr-1.5 bg-current opacity-70" />
      {label}
    </span>
  );
}
