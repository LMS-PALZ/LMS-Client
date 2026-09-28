"use client";

import { ClassroomSessionMedia } from "@/components/classroom";
import type { ClassroomMediaMode } from "@/components/classroom/ClassroomSessionMedia";
import {
  ClassroomPlaybackProvider,
  useClassroomPlayback,
} from "@/contexts/ClassroomPlaybackContext";
import { LiveIndicator } from "@ssu/ui";
import { cn } from "@ssu/utils";
import { GoBack } from "@ssu/ui";
import { CheckCircle2, ChevronDown, Circle } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { type ReactNode } from "react";
import { useEffect, useMemo, useState } from "react";

import { formatSessionDate, formatSessionTime } from "@/lib/assignment-display";
import { resolveLiveVideoForCourse } from "@/lib/classroom/live-video";
import {
  classroomSessionHref,
  toVideoEmbedUrl,
} from "@/lib/classroom/recording-embed";
import type {
  ClassroomCourseDetail,
  ClassroomWeek,
  ClassroomLesson,
} from "@/lib/classroom/types";

interface ClassroomCourseLayoutShellProps {
  course: ClassroomCourseDetail;
  weeks: ClassroomWeek[];
  children: ReactNode;
  backFallbackHref?: string;
  meetUrl?: string;
  meetingNumber?: string;
  isLive?: boolean;
  displayName?: string;
  programId?: string;
}

function ClassroomCourseLayoutShellInner({
  course,
  weeks,
  children,
  backFallbackHref = "/classroom",
  meetUrl,
  meetingNumber,
  isLive = false,
  displayName,
  programId,
}: ClassroomCourseLayoutShellProps) {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { recordingEmbedUrl, clearRecording } = useClassroomPlayback();
  const [joinRequested, setJoinRequested] = useState(
    () => searchParams.get("join") === "1",
  );

  const [openWeeks, setOpenWeeks] = useState(
    () => new Set(weeks.filter((week) => week.expanded).map((week) => week.id)),
  );

  const liveActive = isLive || course.sessionPhase === "live";

  useEffect(() => {
    clearRecording();
  }, [course.id, clearRecording]);

  useEffect(() => {
    if (!pathname.endsWith("/recording")) {
      clearRecording();
    }
  }, [pathname, clearRecording]);

  const sessionBase =
    course.sessionId && pathname.startsWith(`/classroom/${course.sessionId}`)
      ? `/classroom/${course.sessionId}`
      : null;

  const navTabs = useMemo(
    () => [
      {
        label: "Overview",
        href: sessionBase ?? `/courses/${course.id}`,
        active: sessionBase
          ? pathname === sessionBase
          : pathname === `/courses/${course.id}`,
      },
      {
        label: "Resources",
        href: sessionBase
          ? `${sessionBase}/resources`
          : `/courses/${course.id}/resources`,
        active: pathname.endsWith("/resources"),
      },
    ],
    [course.id, pathname, sessionBase],
  );

  const toggleWeek = (weekId: string) => {
    setOpenWeeks((prev) => {
      const next = new Set(prev);
      if (next.has(weekId)) {
        next.delete(weekId);
      } else {
        next.add(weekId);
      }
      return next;
    });
  };

  const liveVideo = resolveLiveVideoForCourse(course, meetUrl);

  const classEnded = course.sessionPhase === "ended";
  const lessonRecordingUrl = toVideoEmbedUrl(course.recordingEmbedUrl ?? "");
  const hasRecording = Boolean(lessonRecordingUrl);
  const meetingOpen =
    !hasRecording && !classEnded && (liveActive || joinRequested);

  let mediaMode: ClassroomMediaMode = "upcoming-placeholder";
  if (hasRecording) {
    mediaMode = "recording-embed";
  } else if (meetingOpen) {
    mediaMode = "live-meet";
  } else if (course.sessionPhase === "ended" && recordingEmbedUrl) {
    mediaMode = "recording-embed";
  } else if (course.sessionPhase === "ended") {
    mediaMode = "ended-placeholder";
  }

  const statusLabel = hasRecording
    ? "RECORDED CLASS"
    : liveActive
      ? "LIVE SESSION"
      : course.sessionLabel;

  const statusDotClass = hasRecording
    ? "bg-[#436E53]"
    : liveActive
      ? "bg-[#D14B3D]"
      : "bg-[#436E53]";

  const scheduledTime = course.scheduledAt
    ? formatSessionTime(course.scheduledAt)
    : "";
  const scheduledDate = course.scheduledAt
    ? formatSessionDate(course.scheduledAt)
    : "";
  const sessionMetaParts = hasRecording
    ? [scheduledDate, scheduledTime].filter(Boolean)
    : [scheduledTime || course.sessionDuration || ""].filter(Boolean);

  function openLesson(lesson: ClassroomLesson) {
    const recorded = Boolean(lesson.recordingUrl?.trim());
    if (!recorded && lesson.sessionPhase === "ended") return;

    if (pathname.startsWith(`/classroom/${lesson.id}`)) {
      if (!recorded) setJoinRequested(true);
      return;
    }

    router.push(
      classroomSessionHref({
        lessonId: lesson.id,
        programId,
        recordingUrl: lesson.recordingUrl,
      }),
    );
  }

  return (
    <div className="grid gap-3 xl:grid-cols-[1.9fr_0.78fr]">
      <div className="flex flex-col rounded-[20px] bg-white p-2 md:p-8">
        <GoBack fallbackHref={backFallbackHref} />

        <div className="mt-8 inline-flex w-fit max-w-full flex-wrap items-center justify-center gap-2 rounded-full bg-[#F3F6F8] px-3 py-2 text-[14px] text-[#6B7280]">
          {liveActive && hasRecording ? (
            <>
              <LiveIndicator label="Live now" size="md" tone="classroom" />
              <span className="text-[#D1D5DB]">|</span>
              <span className="font-medium text-[#6B7280]">{statusLabel}</span>
            </>
          ) : liveActive ? (
            <LiveIndicator
              label="LIVE SESSION"
              size="md"
              tone="classroom"
              uppercase
            />
          ) : (
            <>
              <span className={cn("h-3 w-3 rounded-full", statusDotClass)} />
              <span className="font-medium text-[#6B7280]">{statusLabel}</span>
            </>
          )}
          {sessionMetaParts.map((part, index) => (
            <span
              key={`${part}-${index}`}
              className="inline-flex items-center gap-2"
            >
              <span className="text-[#D1D5DB]">|</span>
              <span>{part}</span>
            </span>
          ))}
        </div>

        <div className="mt-4">
          <ClassroomSessionMedia
            mode={mediaMode}
            meetUrl={liveVideo.meetUrl}
            meetingNumber={meetingNumber}
            displayName={displayName}
            recordingEmbedUrl={
              mediaMode === "recording-embed" && lessonRecordingUrl
                ? lessonRecordingUrl
                : recordingEmbedUrl
            }
            onLeaveMeeting={() => router.push(backFallbackHref)}
          />
        </div>

        <h1 className="mt-4 text-[22px] font-semibold text-[#1D1D1D] md:text-[24px]">
          {course.title}
        </h1>

        <div className="mt-6 rounded-[18px] border border-[#ECF0F7] bg-[#FAFBFD] p-3">
          <div className="flex w-fit flex-row items-center gap-2 rounded-[12px] bg-[#ECF0F7] p-2">
            {navTabs.map((tab) => (
              <Link
                key={tab.href}
                href={tab.href}
                className={cn(
                  "rounded-[9px] px-3 py-1 text-[12px] font-medium transition",
                  tab.active
                    ? "border border-[#D4E2D8] bg-white text-[#4E845F]"
                    : "text-[#2F3540] hover:bg-white",
                )}
              >
                {tab.label}
              </Link>
            ))}
          </div>
          <div className="mt-6">{children}</div>
        </div>
      </div>

      <aside className="rounded-[18px] bg-white p-3 md:p-4">
        <h2 className="text-[15px] font-semibold text-[#1D1D1D]">
          {course.title}
        </h2>

        <div className="mt-6 space-y-4">
          {weeks.map((week) => {
            const expanded = openWeeks.has(week.id);

            return (
              <div key={week.id} className="rounded-[6px] bg-[#FAFBFD] p-3">
                <button
                  type="button"
                  onClick={() => toggleWeek(week.id)}
                  className="flex w-full items-start justify-between gap-3 text-left"
                >
                  <div>
                    <p className="text-[12px] font-bold text-[#7A8594]">
                      {week.label}
                    </p>
                    <p className="mt-1 text-[15px] font-medium text-[#1D1D1D]">
                      {week.topic}
                    </p>
                  </div>
                  <ChevronDown
                    className={cn(
                      "mt-1 h-5 w-5 shrink-0 text-[#2F3540] transition-transform",
                      expanded && "rotate-180",
                    )}
                  />
                </button>

                {expanded && week.lessons.length > 0 && (
                  <div className="mt-5 space-y-5">
                    {week.lessons.map((lesson) => (
                      <button
                        key={lesson.id}
                        type="button"
                        onClick={() => openLesson(lesson)}
                        className="flex w-full items-start gap-3 text-left transition hover:opacity-80"
                      >
                        <div className="pt-1">
                          {lesson.completed ? (
                            <CheckCircle2 className="h-5 w-5 fill-[#4E845F] text-white" />
                          ) : (
                            <Circle className="h-5 w-5 text-[#C5D2E1]" />
                          )}
                        </div>
                        <div>
                          <p className="text-[14px] font-medium text-[#1D1D1D]">
                            {lesson.title}
                          </p>
                          {lesson.isLive ? (
                            <p className="mt-1 text-[12px] font-medium text-[#C92A2A]">
                              Live now
                            </p>
                          ) : lesson.subtitle ? (
                            <p className="mt-1 text-[12px] text-[#6B7280]">
                              {lesson.subtitle}
                            </p>
                          ) : null}
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </aside>
    </div>
  );
}

export function ClassroomCourseLayoutShell(
  props: ClassroomCourseLayoutShellProps,
) {
  return (
    <ClassroomPlaybackProvider>
      <ClassroomCourseLayoutShellInner {...props} />
    </ClassroomPlaybackProvider>
  );
}
