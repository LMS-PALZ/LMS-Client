import { cn } from "@ssu/utils";
import type { ReactNode } from "react";
import { SessionCard, type SessionCardProps } from "../SessionCard";

export interface LiveSessionItemView extends Pick<
  SessionCardProps,
  "title" | "time" | "date" | "status"
> {
  id: string;
  action?: ReactNode;
}

export interface LiveSessionsPanelProps {
  sessions: LiveSessionItemView[];
  className?: string;
  title?: string;
  emptyState?: ReactNode;
  loadingSkeleton?: ReactNode;
  isLoading?: boolean;
}

export function LiveSessionsPanel({
  sessions,
  className,
  title = "Live Sessions",
  emptyState,
  loadingSkeleton,
  isLoading = false,
}: LiveSessionsPanelProps) {
  return (
    <section className={cn("flex min-h-[250px] flex-col gap-3", className)}>
      <h2 className="text-[17px] font-bold text-neutral-900 sm:text-[18px]">
        {title}
      </h2>

      {isLoading && loadingSkeleton}

      {!isLoading && sessions.length === 0 && emptyState}

      {!isLoading && sessions.length > 0 && (
        <div className="grid flex-1 grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {sessions.map((session) => (
            <SessionCard
              key={session.id}
              title={session.title}
              time={session.time}
              date={session.date}
              status={session.status}
              action={session.action}
            />
          ))}
        </div>
      )}
    </section>
  );
}
