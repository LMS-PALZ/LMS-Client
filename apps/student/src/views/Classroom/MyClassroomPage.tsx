"use client";

import { useProfileSetup } from "@/contexts/ProfileSetupContext";
import { resolveLessonSessionPhase } from "@/lib/calendar/session-phase";
import { classroomSessionHref } from "@/lib/classroom/recording-embed";
import { findNextTodaySession } from "@/lib/sessions/today-sessions";
import { mapClassroomLessonsToSessions } from "@ssu/api";
import { useEnrolledProgram, useStudentclassroom } from "@ssu/queries";
import { DashboardEmptyState, LiveIndicator } from "@ssu/ui";
import { cn, displayValue, EMPTY_DISPLAY } from "@ssu/utils";
import {
  CalendarDays,
  ChevronDown,
  ChevronRight,
  Circle,
  Clock3,
  GraduationCap,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

function formatDate(dateStr?: string): string {
  if (!dateStr) return EMPTY_DISPLAY;
  const date = new Date(dateStr);
  if (Number.isNaN(date.getTime())) return EMPTY_DISPLAY;

  const day = date.getDate();
  const month = date.toLocaleString("en-US", { month: "long" });
  const year = date.getFullYear();

  const suffix =
    day % 10 === 1 && day !== 11
      ? "st"
      : day % 10 === 2 && day !== 12
        ? "nd"
        : day % 10 === 3 && day !== 13
          ? "rd"
          : "th";

  return `${day}${suffix} ${month}, ${year}`;
}

function lessonActionLabel(lesson: {
  recordingUrl?: string;
  lessonType?: string;
  startsAt?: string;
  durationMinutes?: number;
  isLiveNow?: boolean;
}): string | null {
  const hasRecording = Boolean(lesson.recordingUrl?.trim());
  const phase = resolveLessonSessionPhase(
    lesson.startsAt,
    lesson.durationMinutes,
    lesson.isLiveNow,
  );

  if (hasRecording) {
    if (phase === "live") return "Watch live class";
    return "Watch recording";
  }

  if (lesson.lessonType === "live_session") {
    if (phase === "ended") return null;
    if (phase === "live") return "Join live session";
    return "View class";
  }

  return "Open lesson";
}

export function MyClassroomPage() {
  const router = useRouter();
  const { ensureProfileForAction } = useProfileSetup();
  const {
    programId: enrolledProgramId,
    program: enrolledProgram,
    liveGeneralPrograms,
    hasLiveGeneralProgram,
    isLoading: isProfileLoading,
  } = useEnrolledProgram();

  const { data, isLoading: isClassroomLoading } =
    useStudentclassroom(enrolledProgramId);

  const modules = data?.classroom?.modules ?? [];
  const [openModules, setOpenModules] = useState<Set<string>>(new Set());
  const firstModuleId = modules[0]?.id;

  useEffect(() => {
    if (!firstModuleId) return;
    setOpenModules((prev) => {
      if (prev.size > 0) return prev;
      return new Set([firstModuleId]);
    });
  }, [firstModuleId]);

  const isLoading =
    isProfileLoading || (Boolean(enrolledProgramId) && isClassroomLoading);

  const handleOpenLesson = (lessonId: string, recordingUrl?: string) => {
    if (!ensureProfileForAction()) return;
    router.push(
      classroomSessionHref({
        lessonId,
        programId: enrolledProgramId,
        recordingUrl,
      }),
    );
  };

  const nextSession = useMemo(() => {
    const enrolledSessions = data
      ? mapClassroomLessonsToSessions(
          data.classroom.modules,
          data.program.title || enrolledProgram?.title || "",
        ).map((session) => ({
          ...session,
          programId: enrolledProgramId,
        }))
      : [];

    const liveExtra = hasLiveGeneralProgram
      ? liveGeneralPrograms.map((item) => ({
          id: item.lessonId,
          title: item.lessonTitle,
          courseName: item.programTitle || "",
          startsAt: item.startsAt,
          isLive: true,
          meetingUrl: item.liveSessionUrl ?? undefined,
          zoomJoinUrl: item.zoomJoinUrl ?? undefined,
          programId: item.programId,
        }))
      : [];

    return findNextTodaySession([...enrolledSessions, ...liveExtra]);
  }, [
    data,
    enrolledProgram?.title,
    enrolledProgramId,
    hasLiveGeneralProgram,
    liveGeneralPrograms,
  ]);

  if (isLoading) {
    return (
      <div className="flex min-h-[320px] items-center justify-center">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-[#D4E2D8] border-t-[#4E845F]" />
      </div>
    );
  }

  if (!enrolledProgramId) {
    return (
      <DashboardEmptyState
        icon={GraduationCap}
        title="You are not enrolled in a course yet"
        description="When you enroll in a program, your classroom will appear here."
      />
    );
  }

  const program = data?.program ?? enrolledProgram;
  const isLive = Boolean(nextSession?.isLive);
  const sessionEnded = nextSession
    ? resolveLessonSessionPhase(
        nextSession.startsAt,
        nextSession.durationMinutes,
        nextSession.isLive,
      ) === "ended"
    : false;
  const hasModules = modules.length > 0;
  const hasTodaySession = Boolean(nextSession);

  const toggleModule = (moduleId: string) => {
    setOpenModules((prev) => {
      const next = new Set(prev);
      if (next.has(moduleId)) next.delete(moduleId);
      else next.add(moduleId);
      return next;
    });
  };

  return (
    <div className="space-y-5">
      <section className="grid gap-4 xl:grid-cols-[1.8fr_0.95fr]">
        <div className="rounded-[18px] bg-[#EEF9ED] p-6">
          <div className="inline-flex rounded-full bg-white px-2 py-1 text-[9px] font-medium text-[#7A8594]">
            Enrolled
          </div>

          <h1 className="mt-2 text-[18px] font-bold text-[#1D1D1D] md:text-[20px]">
            {program?.title || "Your course"}
          </h1>

          <p className="mt-2 text-[15px] leading-7 text-[#495057]">
            {program?.description ||
              "Course details will appear here once your classroom is published."}
          </p>

          <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-4">
            <div>
              <div className="flex items-center gap-2 text-[13px] font-medium text-[#4A4F59]">
                <Clock3 className="h-3 w-3" />
                <span>Duration</span>
              </div>
              <p className="mt-1 text-[13px] text-[#6B7280]">
                {displayValue(program?.duration)}
              </p>
            </div>

            <div>
              <div className="flex items-center gap-2 text-[13px] font-medium text-[#4A4F59]">
                <CalendarDays className="h-3 w-3" />
                <span>Start Date</span>
              </div>
              <p className="mt-1 text-[13px] text-[#6B7280]">
                {formatDate(program?.startDate)}
              </p>
            </div>

            <div>
              <div className="flex items-center gap-2 text-[13px] font-medium text-[#4A4F59]">
                <CalendarDays className="h-3 w-3" />
                <span>End Date</span>
              </div>
              <p className="mt-1 text-[13px] text-[#6B7280]">
                {formatDate(program?.endDate)}
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-[18px] border border-[#EEF2F6] bg-white p-5 md:p-4">
          {!hasTodaySession ? (
            <DashboardEmptyState
              icon={GraduationCap}
              title="No class scheduled for today"
              description="Your next live session will appear here when one is scheduled for today."
            />
          ) : (
            <>
              {isLive ? (
                <LiveIndicator label="Live" size="md" tone="classroom" />
              ) : (
                <span className="inline-flex items-center rounded-full bg-[#E8F4FC] px-3 py-1.5 text-[13px] font-semibold text-[#2B6CB0]">
                  Upcoming
                </span>
              )}

              <h2 className="mt-5 text-[16px] font-medium leading-9 text-[#1D1D1D]">
                {nextSession?.title}
              </h2>

              <div className="mt-3 flex items-center gap-5 text-[16px] text-[#6B7280]">
                <div className="flex items-center gap-2">
                  <Clock3 size={12} />
                  <span className="text-[12px]">
                    {nextSession?.startsAt
                      ? new Date(nextSession.startsAt).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })
                      : "—"}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <CalendarDays size={12} />
                  <span className="text-[12px]">Today</span>
                </div>
              </div>

              <div className="mt-10 flex justify-end">
                {nextSession?.recordingUrl ? (
                  <button
                    type="button"
                    onClick={() =>
                      handleOpenLesson(nextSession.id, nextSession.recordingUrl)
                    }
                    className="inline-flex items-center gap-2 rounded-full bg-[#4E845F] px-4 py-2 text-[12px] font-medium text-white transition hover:bg-[#3D6E4D]"
                  >
                    Watch live class
                    <ChevronRight size={16} />
                  </button>
                ) : sessionEnded ? (
                  <span className="inline-flex items-center gap-2 rounded-full bg-[#E8EDF3] px-4 py-2 text-[12px] font-medium text-[#9AA3AF]">
                    This class has ended
                  </span>
                ) : (
                  <button
                    type="button"
                    onClick={() => handleOpenLesson(nextSession!.id)}
                    className="inline-flex items-center gap-2 rounded-full bg-[#4E845F] px-4 py-2 text-[12px] font-medium text-white transition hover:bg-[#3D6E4D]"
                  >
                    Join live session
                    <ChevronRight size={16} />
                  </button>
                )}
              </div>
            </>
          )}
        </div>
      </section>

      <section className="rounded-[18px] border border-[#EEF2F6] bg-white p-4 md:p-5">
        <div className="mb-4 flex items-center gap-2">
          <h2 className="text-[18px] font-semibold text-[#1D1D1D]">
            Curriculum
          </h2>
          <span className="text-[#D2D8E2]">|</span>
          <span className="text-[13px] text-[#7A8594]">
            {modules.length} {modules.length === 1 ? "module" : "modules"}
          </span>
        </div>

        {!hasModules ? (
          <DashboardEmptyState
            icon={GraduationCap}
            title="No modules available yet"
            description="Your course modules will appear here once they are published."
          />
        ) : (
          <div className="space-y-3">
            {modules.map((module, index) => {
              const expanded = openModules.has(module.id);
              const lessons = module.lessons ?? [];
              const weekLabel =
                module.weekLabel || `Week ${module.order || index + 1}`;

              return (
                <div
                  key={module.id}
                  className="rounded-[10px] border border-[#EEF2F6] bg-[#FAFBFD]"
                >
                  <button
                    type="button"
                    onClick={() => toggleModule(module.id)}
                    className="flex w-full items-start justify-between gap-3 px-4 py-3 text-left"
                  >
                    <div>
                      <p className="text-[12px] font-bold text-[#7A8594]">
                        {weekLabel}
                      </p>
                      <p className="mt-1 text-[15px] font-medium text-[#1D1D1D]">
                        {module.title}
                      </p>
                      <p className="mt-1 text-[12px] text-[#6B7280]">
                        {lessons.length}{" "}
                        {lessons.length === 1 ? "lesson" : "lessons"}
                      </p>
                    </div>
                    <ChevronDown
                      className={cn(
                        "mt-1 h-5 w-5 shrink-0 text-[#2F3540] transition-transform",
                        expanded && "rotate-180",
                      )}
                    />
                  </button>

                  {expanded ? (
                    <div className="space-y-1 border-t border-[#EEF2F6] px-2 py-2">
                      {lessons.length === 0 ? (
                        <p className="px-3 py-2 text-[13px] text-[#6B7280]">
                          No lessons in this module yet.
                        </p>
                      ) : (
                        lessons.map((lesson) => {
                          const action = lessonActionLabel(lesson);
                          const phase = resolveLessonSessionPhase(
                            lesson.startsAt,
                            lesson.durationMinutes,
                            lesson.isLiveNow,
                          );
                          const disabled =
                            !lesson.recordingUrl?.trim() &&
                            lesson.lessonType === "live_session" &&
                            phase === "ended";

                          return (
                            <button
                              key={lesson.id}
                              type="button"
                              disabled={disabled}
                              onClick={() => {
                                if (disabled) return;
                                handleOpenLesson(
                                  lesson.id,
                                  lesson.recordingUrl,
                                );
                              }}
                              className={cn(
                                "flex w-full items-center justify-between gap-3 rounded-[8px] px-3 py-2.5 text-left transition",
                                disabled
                                  ? "cursor-not-allowed opacity-60"
                                  : "hover:bg-white",
                              )}
                            >
                              <div className="flex min-w-0 items-start gap-3">
                                <Circle className="mt-0.5 h-4 w-4 shrink-0 text-[#C5D2E1]" />
                                <div className="min-w-0">
                                  <p className="truncate text-[14px] font-medium text-[#1D1D1D]">
                                    {lesson.title}
                                  </p>
                                  {lesson.isLiveNow ? (
                                    <p className="mt-0.5 text-[12px] font-medium text-[#C92A2A]">
                                      Live now
                                    </p>
                                  ) : disabled ? (
                                    <p className="mt-0.5 text-[12px] text-[#6B7280]">
                                      Class ended
                                    </p>
                                  ) : lesson.recordingUrl ? (
                                    <p className="mt-0.5 text-[12px] text-[#6B7280]">
                                      Recording available
                                    </p>
                                  ) : null}
                                </div>
                              </div>
                              {action ? (
                                <span className="inline-flex shrink-0 items-center gap-1 text-[12px] font-medium text-[#4E845F]">
                                  {action}
                                  <ChevronRight className="h-3.5 w-3.5" />
                                </span>
                              ) : null}
                            </button>
                          );
                        })
                      )}
                    </div>
                  ) : null}
                </div>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}
