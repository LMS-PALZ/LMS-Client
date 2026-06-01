import { cn } from "@ssu/utils";
import { Calendar, Clock } from "lucide-react";
import type { ReactNode } from "react";

export interface SessionCardProps {
  title: string;
  time: string;
  date: string;
  status: "live" | "upcoming";
  action?: ReactNode;
  className?: string;
}

function SessionStatusBadge({ status }: { status: "live" | "upcoming" }) {
  const isLive = status === "live";
  return (
    <span
      className={cn(
        "inline-flex w-fit items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold",
        isLive ? "bg-[#FEE8E8] text-[#DC2626]" : "bg-[#E8F1FC] text-[#2563EB]",
      )}
    >
      {isLive && (
        <span
          className="h-1.5 w-1.5 shrink-0 rounded-full bg-brand-green"
          aria-hidden
        />
      )}
      {isLive ? "Live" : "Upcoming"}
    </span>
  );
}

export function SessionCard({
  title,
  time,
  date,
  status,
  action,
  className,
}: SessionCardProps) {
  return (
    <article
      className={cn(
        "flex min-h-[235px] flex-col gap-2.5 rounded-2xl border border-neutral-200/90 bg-white p-3.5 shadow-[0_1px_2px_rgba(15,23,42,0.05)] sm:min-h-[245px] sm:p-4",
        className,
      )}
    >
      <SessionStatusBadge status={status} />
      <h3 className="text-[14px] font-semibold leading-snug text-neutral-900 line-clamp-3 sm:text-[15px]">
        {title}
      </h3>
      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[12px] text-neutral-500 sm:text-[13px]">
        {time ? (
          <span className="inline-flex items-center gap-1.5">
            <Clock
              className="h-3.5 w-3.5 shrink-0 text-neutral-400"
              aria-hidden
            />
            {time}
          </span>
        ) : null}
        {date ? (
          <span className="inline-flex items-center gap-1.5">
            <Calendar
              className="h-3.5 w-3.5 shrink-0 text-neutral-400"
              aria-hidden
            />
            {date}
          </span>
        ) : null}
      </div>
      {action && (
        <div className="mt-auto flex justify-end pt-0.5 text-[12px] sm:text-[13px]">
          {action}
        </div>
      )}
    </article>
  );
}
