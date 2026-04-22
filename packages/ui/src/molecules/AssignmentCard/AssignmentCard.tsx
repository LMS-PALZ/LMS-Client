import { cn, formatDate } from "@ssu/utils";
import type { ReactNode } from "react";
import { Badge } from "../../atoms/Badge";
import type { BadgeProps } from "../../atoms/Badge";

export interface AssignmentCardProps {
  title: string;
  courseName: string;
  dueAt: string;
  overdue?: boolean;
  statusVariant: NonNullable<BadgeProps["variant"]>;
  statusLabel: string;
  action?: ReactNode;
  className?: string;
}

export function AssignmentCard({
  title,
  courseName,
  dueAt,
  overdue,
  statusVariant,
  statusLabel,
  action,
  className,
}: AssignmentCardProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-3 rounded-xl border bg-white p-4 shadow-card sm:flex-row sm:items-center sm:justify-between",
        className,
      )}
    >
      <div className="min-w-0 space-y-1">
        <h3 className="text-h4 text-neutral-900">{title}</h3>
        <p className="text-small text-neutral-500">{courseName}</p>
        <p
          className={cn(
            "text-small",
            overdue ? "text-red-600 font-semibold" : "text-neutral-600",
          )}
        >
          Due {formatDate(dueAt)}
        </p>
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <Badge variant={statusVariant}>{statusLabel}</Badge>
        {action}
      </div>
    </div>
  );
}
