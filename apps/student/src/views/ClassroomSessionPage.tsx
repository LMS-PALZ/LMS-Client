"use client";

import { useCurriculum, useSessionDetail } from "@ssu/queries";
import {
  CurriculumAccordion,
  PillTabs,
  RecordingListItem,
  Skeleton,
  StatusBadge,
  VideoSessionFrame,
} from "@ssu/ui";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

type SessionTab = "overview" | "recording" | "resources";

function useCountdown(targetIso: string | undefined) {
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  return useMemo(() => {
    if (!targetIso) {
      return { days: 0, hours: 0, minutes: 0, seconds: 0, totalMs: 0 };
    }
    const totalMs = Math.max(0, new Date(targetIso).getTime() - now);
    const totalSec = Math.floor(totalMs / 1000);
    const days = Math.floor(totalSec / 86400);
    const hours = Math.floor((totalSec % 86400) / 3600);
    const minutes = Math.floor((totalSec % 3600) / 60);
    const seconds = totalSec % 60;
    return { days, hours, minutes, seconds, totalMs };
  }, [targetIso, now]);
}

export function ClassroomSessionPage() {
  const params = useParams();
  const sessionId =
    typeof params.sessionId === "string" ? params.sessionId : "";
  const q = useSessionDetail(sessionId);
  const curriculum = useCurriculum();
  const [tab, setTab] = useState<SessionTab>("overview");

  const session = q.data;
  const countdown = useCountdown(session?.startsAt);

  const videoState = useMemo(() => {
    if (!session) return "ended" as const;
    if (session.isLive) return "live" as const;
    if (countdown.totalMs > 0) return "countdown" as const;
    return "ended" as const;
  }, [session, countdown.totalMs]);

  const liveTimer = "1:20:10";

  return (
    <div className="space-y-6">
      <Link
        href="/classroom"
        className="inline-flex items-center gap-1 text-small font-medium text-brand-green hover:underline"
      >
        <ChevronLeft className="h-4 w-4" />
        Back
      </Link>

      <div className="flex flex-wrap items-center gap-3">
        <StatusBadge variant={session?.isLive ? "live" : "upcoming"}>
          {session?.isLive ? "LIVE SESSION" : "SESSION"}
        </StatusBadge>
        {session?.isLive && (
          <span className="text-small text-neutral-500 tabular-nums">
            {liveTimer}
          </span>
        )}
      </div>

      <div className="grid gap-6 xl:grid-cols-[1fr_320px]">
        <div className="space-y-6 min-w-0">
          {q.isLoading ? (
            <Skeleton className="aspect-video rounded-2xl" />
          ) : (
            <VideoSessionFrame
              state={videoState}
              embedUrl={session?.meetingUrl}
              countdown={
                videoState === "countdown"
                  ? {
                      days: countdown.days,
                      hours: countdown.hours,
                      minutes: countdown.minutes,
                      seconds: countdown.seconds,
                    }
                  : undefined
              }
              footer={
                videoState === "countdown" ? (
                  <button
                    type="button"
                    className="text-small font-medium text-brand-green hover:underline"
                  >
                    Add to reminder
                  </button>
                ) : undefined
              }
            />
          )}

          <div>
            <h1 className="text-h1 font-bold text-neutral-900 mb-4">
              {session?.title ?? "Client Communications Essentials"}
            </h1>
            <PillTabs
              items={[
                { id: "overview", label: "Overview" },
                { id: "recording", label: "Recording" },
                { id: "resources", label: "Resources" },
              ]}
              value={tab}
              onChange={setTab}
            />
            <div className="mt-4 rounded-2xl border bg-neutral-50 p-5">
              {tab === "overview" && (
                <p className="text-body text-neutral-700">
                  <span className="font-semibold">Explanation: </span>
                  {session?.description ??
                    "Session overview and learning objectives will appear here."}
                </p>
              )}
              {tab === "recording" && (
                <RecordingListItem
                  title={session?.title ?? "Session recording"}
                  expiresInDays={14}
                />
              )}
              {tab === "resources" && (
                <p className="text-body text-neutral-600">
                  Resources from Google Classroom will appear here when
                  connected.
                </p>
              )}
            </div>
          </div>
        </div>

        <aside className="rounded-2xl border bg-neutral-50 p-4 h-fit">
          <h2 className="text-h4 font-bold text-neutral-900 mb-4">
            {session?.courseName ?? "Course"}
          </h2>
          {curriculum.isLoading ? (
            <Skeleton className="h-48 rounded-xl" />
          ) : (
            <CurriculumAccordion weeks={curriculum.data ?? []} />
          )}
        </aside>
      </div>
    </div>
  );
}
