import { cn } from "@ssu/utils";
import { Calendar, Clock } from "lucide-react";
import type { ReactNode } from "react";
import { StatusBadge } from "../StatusBadge";

export interface SessionCardProps {
  title: string;
  time: string;
  date: string;
  status: "live" | "upcoming";
  action?: ReactNode;
  className?: string;
  highlighted?: boolean;
}

export function SessionCard({
  title,
  time,
  date,
  status,
  action,
  className,
  highlighted,
}: SessionCardProps) {
  return (
    <article
      className={cn(
        "rounded-2xl border bg-white p-4 shadow-card flex flex-col gap-3 min-h-[160px]",
        highlighted && "border-dashed border-brand-green",
        className,
      )}
    >
      <StatusBadge variant={status}>
        {status === "live" ? "Live" : "Upcoming"}
      </StatusBadge>
      <h3 className="text-h4 font-semibold text-neutral-900 line-clamp-2">
        {title}
      </h3>
      <div className="flex flex-wrap gap-3 text-small text-neutral-500">
        <span className="inline-flex items-center gap-1">
          <Clock className="h-4 w-4" aria-hidden />
          {time}
        </span>
        <span className="inline-flex items-center gap-1">
          <Calendar className="h-4 w-4" aria-hidden />
          {date}
        </span>
      </div>
      {action && <div className="mt-auto flex justify-end">{action}</div>}
    </article>
  );
}
