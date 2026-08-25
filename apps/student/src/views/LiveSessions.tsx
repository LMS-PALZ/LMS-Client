"use client";

import { cn } from "@ssu/utils";
import { CalendarDays, Clock3, ChevronRight } from "lucide-react";
import { EmptyState, LiveIndicator } from "@ssu/ui";
import { Megaphone } from "lucide-react";

export interface Session {
  id: number;
  title: string;
  time: string;
  date: string;
  status: "live" | "upcoming";
  joinable?: boolean;
}

export interface LiveSessionsProps {
  sessions?: Session[];
  title?: string;
  className?: string;
  onJoinSession?: (session: Session) => void;
  joinLabel?: string;
}

export function LiveSessions({
  sessions = [],
  title = "Live Sessions",
  className,
  onJoinSession,
  joinLabel = "Join session",
}: LiveSessionsProps) {
  return (
    <div className={cn(className)}>
      <h2 className="text-[18px] font-semibold text-[#1D1D1D] pt-3 pb-5">
        {title}
      </h2>

      {sessions.length === 0 ? (
        <EmptyState
          icon={Megaphone}
          title="YYou don’t have any classes yet"
          description="When you do, they’ll show up here"
        />
      ) : (
        <div className="grid gap-10 md:grid-cols-2 xl:grid-cols-3">
          {sessions.map((session) => (
            <div
              key={session.id}
              className="rounded-[15px] border border-[#EFEFEF] bg-[#FCFCFC] p-3"
            >
              {session.status === "live" ? (
                <LiveIndicator label="Live" size="xs" tone="default" />
              ) : (
                <span className="inline-flex items-center rounded-full bg-[#E2EBFF] px-3 py-1 text-[9px] font-semibold text-[#356DFF]">
                  Upcoming
                </span>
              )}

              <h3 className="mt-5 text-[13px] font-medium leading-[24px] text-[#1D1D1D]">
                {session.title}
              </h3>

              <div className="mt-5 flex items-center gap-3 text-[#6B7280]">
                <div className="flex items-center gap-2">
                  <Clock3 size={12} />

                  <span className="text-[12px]">{session.time}</span>
                </div>

                <div className="flex items-center gap-2">
                  <CalendarDays size={12} />

                  <span className="text-[12px]">{session.date}</span>
                </div>
              </div>

              <button
                type="button"
                disabled={!session.joinable}
                onClick={() => onJoinSession?.(session)}
                className={`mt-10 flex w-full items-center justify-end gap-2 text-[15px] font-semibold transition ${
                  session.joinable
                    ? "text-[#4B7F52] hover:opacity-80"
                    : "cursor-not-allowed text-[#D1D5DB]"
                }`}
              >
                {joinLabel}

                <ChevronRight size={16} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default LiveSessions;
