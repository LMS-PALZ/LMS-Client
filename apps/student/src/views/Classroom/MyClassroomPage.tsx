"use client";

import { resolveLessonSessionPhase } from "@/lib/calendar/session-phase";
import {
  classroomSessionHref,
  type ClassroomSessionOpenMode,
} from "@/lib/classroom/recording-embed";
import {
  hasRecordingUrl,
  isLiveJoinEnabled,
  isRecordingPlayEnabled,
} from "@/lib/sessions/session-access";
import { findNextTodaySession } from "@/lib/sessions/today-sessions";
import { mapClassroomLessonsToSessions } from "@ssu/api";
import { useEnrolledProgram, useStudentclassroom } from "@ssu/queries";
import { DashboardEmptyState, LiveIndicator } from "@ssu/ui";
import {
  cn,
  displayValue,
  EMPTY_DISPLAY,
  CLASS_ENDED_LABEL,
  CLASS_NOT_STARTED_LABEL,
  JOIN_LIVE_CLASS_LABEL,
  WATCH_RECORDED_CLASS_LABEL,
} from "@ssu/utils";
import {
  CalendarDays,
  ChevronDown,
  ChevronRight,
  Circle,
  Clock3,
  GraduationCap,
  Play,
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
}): string {
  const hasRecording = Boolean(lesson.recordingUrl?.trim());
  const phase = resolveLessonSessionPhase(
    lesson.startsAt,
    lesson.durationMinutes,
    lesson.isLiveNow,
  );
  const canPlayRecording = isRecordingPlayEnabled({
    startsAt: lesson.startsAt ?? "",
  });
  const canJoinLive = isLiveJoinEnabled({
    startsAt: lesson.startsAt ?? "",
    durationMinutes: lesson.durationMinutes,
    isLive: Boolean(lesson.isLiveNow),
  });

  if (hasRecording) {
    if (!canPlayRecording) return CLASS_NOT_STARTED_LABEL;
    return WATCH_RECORDED_CLASS_LABEL;
  }

  if (lesson.lessonType === "live_session") {
    if (phase === "ended") return CLASS_ENDED_LABEL;
    if (!canJoinLive) return CLASS_NOT_STARTED_LABEL;
    return JOIN_LIVE_CLASS_LABEL;
  }

  return "View Details";
}

function lessonOpenMode(lesson: {
  recordingUrl?: string;
  startsAt?: string;
  durationMinutes?: number;
  isLiveNow?: boolean;
}): ClassroomSessionOpenMode {
  const hasRecording = Boolean(lesson.recordingUrl?.trim());
  if (
    hasRecording &&
    isRecordingPlayEnabled({ startsAt: lesson.startsAt ?? "" })
  ) {
    return "watch";
  }
  if (
    !hasRecording &&
    isLiveJoinEnabled({
      startsAt: lesson.startsAt ?? "",
      durationMinutes: lesson.durationMinutes,
      isLive: Boolean(lesson.isLiveNow),
    })
  ) {
    return "join";
  }
  return "view";
}

export function MyClassroomPage() {
  const router = useRouter();
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

  const handleOpenLesson = (
    lessonId: string,
    options?: {
      recordingUrl?: string | null;
      mode?: ClassroomSessionOpenMode;
    },
  ) => {
    // Classroom watch/view/join is not gated on profile setup — enrolled
    // students should reach recordings and class details immediately.
    router.push(
      classroomSessionHref({
        lessonId,
        programId: enrolledProgramId,
        recordingUrl: options?.recordingUrl,
        mode: options?.mode,
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
      ? liveGeneralPrograms.map((item) => {
          const recordingUrl = item.recordingUrl?.trim() || undefined;
          return {
            id: item.lessonId,
            title: item.lessonTitle,
            courseName: item.programTitle || "",
            startsAt: item.startsAt?.trim() ?? "",
            isLive: !recordingUrl,
            meetingUrl: item.liveSessionUrl ?? undefined,
            zoomJoinUrl: item.zoomJoinUrl ?? undefined,
            recordingUrl,
            programId: item.programId,
          };
        })
      : [];

    return findNextTodaySession([...enrolledSessions, ...liveExtra]);
  }, [
    data,
    enrolledProgram?.title,
    enrolledProgramId,
    hasLiveGeneralProgram,
    liveGeneralPrograms,
  ]);

  /** Posted recordings students can rewatch anytime (after release time). */
  const availableRecordings = useMemo(() => {
    const classroomModules = data?.classroom?.modules ?? [];
    return classroomModules.flatMap((module) =>
      (module.lessons ?? [])
        .filter(
          (lesson) =>
            Boolean(lesson.recordingUrl?.trim()) &&
            isRecordingPlayEnabled({ startsAt: lesson.startsAt ?? "" }),
        )
        .map((lesson) => ({
          id: lesson.id,
          title: lesson.title,
          recordingUrl: lesson.recordingUrl,
          moduleTitle: module.title,
          weekLabel: module.weekLabel,
        })),
    );
  }, [data?.classroom?.modules]);

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
        title="Nothing here yet"
        description="Ask your admin for access."
      />
    );
  }

  const program = data?.program ?? enrolledProgram;
  const isLive = Boolean(nextSession?.isLive);
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
              title="Nothing here yet"
              description="Open a class when it's ready."
            />
          ) : (
            <>
              {isLive ? (
                <LiveIndicator label="Live" size="md" tone="classroom" />
              ) : (
                <span className="inline-flex items-center rounded-full bg-[#E8F4FC] px-3 py-1.5 text-[13px] font-semibold text-[#2B6CB0]">
                  {CLASS_NOT_STARTED_LABEL}
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
                {(() => {
                  if (!nextSession) return null;
                  const isRecording = hasRecordingUrl(nextSession);
                  const canPlay =
                    isRecording && isRecordingPlayEnabled(nextSession);
                  const canJoin =
                    !isRecording && isLiveJoinEnabled(nextSession);

                  if (isRecording && !canPlay) {
                    return (
                      <span className="inline-flex items-center gap-2 rounded-full bg-[#E8EDF3] px-4 py-2.5 text-[14px] font-semibold text-[#9AA3AF]">
                        {CLASS_NOT_STARTED_LABEL}
                      </span>
                    );
                  }

                  if (!isRecording && !canJoin) {
                    const phase = resolveLessonSessionPhase(
                      nextSession.startsAt,
                      nextSession.durationMinutes,
                      nextSession.isLive,
                    );
                    const statusLabel =
                      phase === "ended"
                        ? CLASS_ENDED_LABEL
                        : CLASS_NOT_STARTED_LABEL;
                    return (
                      <button
                        type="button"
                        onClick={() =>
                          handleOpenLesson(nextSession.id, { mode: "view" })
                        }
                        className="inline-flex items-center gap-2 rounded-full bg-[#4E845F] px-5 py-2.5 text-[15px] font-semibold text-white transition hover:bg-[#3D6E4D]"
                      >
                        {statusLabel}
                        <ChevronRight className="h-5 w-5" />
                      </button>
                    );
                  }

                  return (
                    <button
                      type="button"
                      onClick={() =>
                        handleOpenLesson(nextSession.id, {
                          recordingUrl: nextSession.recordingUrl,
                          mode: isRecording ? "watch" : "join",
                        })
                      }
                      className="inline-flex items-center gap-2 rounded-full bg-[#4E845F] px-5 py-2.5 text-[15px] font-semibold text-white transition hover:bg-[#3D6E4D]"
                    >
                      {isRecording
                        ? WATCH_RECORDED_CLASS_LABEL
                        : JOIN_LIVE_CLASS_LABEL}
                      <ChevronRight className="h-5 w-5" />
                    </button>
                  );
                })()}
              </div>
            </>
          )}
        </div>
      </section>

      {availableRecordings.length > 0 ? (
        <section className="rounded-[18px] border border-[#EEF2F6] bg-white p-4 md:p-5">
          <div className="mb-1 flex items-center gap-2">
            <h2 className="text-[18px] font-semibold text-[#1D1D1D]">
              Class recordings
            </h2>
            <span className="text-[#D2D8E2]">|</span>
            <span className="text-[13px] text-[#7A8594]">
              {availableRecordings.length}{" "}
              {availableRecordings.length === 1 ? "recording" : "recordings"}
            </span>
          </div>
          <p className="mb-4 text-[13px] text-[#6B7280]">
            Your class recordings.
          </p>
          <ul className="space-y-2">
            {availableRecordings.map((recording) => (
              <li key={recording.id}>
                <button
                  type="button"
                  onClick={() =>
                    handleOpenLesson(recording.id, {
                      recordingUrl: recording.recordingUrl,
                      mode: "watch",
                    })
                  }
                  className="flex w-full items-center justify-between gap-3 rounded-[10px] border border-[#EEF2F6] bg-[#FAFBFD] px-3 py-3 text-left transition hover:border-[#D4E2D8] hover:bg-[#F3F8F4]"
                >
                  <div className="flex min-w-0 items-start gap-3">
                    <span className="mt-0.5 inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#E8F3EC] text-[#4C7D5B]">
                      <Play className="h-3.5 w-3.5 fill-current" aria-hidden />
                    </span>
                    <div className="min-w-0">
                      <p className="truncate text-[14px] font-medium text-[#1D1D1D]">
                        {recording.title}
                      </p>
                      <p className="mt-0.5 truncate text-[12px] text-[#6B7280]">
                        {[recording.weekLabel, recording.moduleTitle]
                          .filter(Boolean)
                          .join(" · ")}
                      </p>
                    </div>
                  </div>
                  <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-[#4E845F] px-4 py-2 text-[15px] font-semibold text-white">
                    {WATCH_RECORDED_CLASS_LABEL}
                    <ChevronRight className="h-5 w-5" />
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

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
            title="Nothing here yet"
            description="Check back when your course is ready."
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
                          const openMode = lessonOpenMode(lesson);
                          const phase = resolveLessonSessionPhase(
                            lesson.startsAt,
                            lesson.durationMinutes,
                            lesson.isLiveNow,
                          );
                          const recorded = Boolean(lesson.recordingUrl?.trim());
                          const canPlayRecording =
                            recorded &&
                            isRecordingPlayEnabled({
                              startsAt: lesson.startsAt ?? "",
                            });
                          const canJoinLive =
                            !recorded &&
                            isLiveJoinEnabled({
                              startsAt: lesson.startsAt ?? "",
                              durationMinutes: lesson.durationMinutes,
                              isLive: Boolean(lesson.isLiveNow),
                            });
                          const ended =
                            !recorded &&
                            lesson.lessonType === "live_session" &&
                            phase === "ended";
                          // Only lock recordings before their release time.
                          // Ended live rows stay clickable for details/resources.
                          const locked = recorded && !canPlayRecording;
                          const actionActive = canPlayRecording || canJoinLive;

                          return (
                            <button
                              key={lesson.id}
                              type="button"
                              disabled={locked}
                              onClick={() => {
                                if (locked) return;
                                handleOpenLesson(lesson.id, {
                                  recordingUrl: lesson.recordingUrl,
                                  mode: openMode,
                                });
                              }}
                              className={cn(
                                "flex w-full items-center justify-between gap-3 rounded-[8px] px-3 py-2.5 text-left transition",
                                locked
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
                                  {!recorded &&
                                  (lesson.isLiveNow || phase === "live") ? (
                                    <p className="mt-0.5 text-[12px] font-medium text-[#C92A2A]">
                                      Live now
                                    </p>
                                  ) : ended ? (
                                    <p className="mt-0.5 text-[12px] text-[#6B7280]">
                                      {CLASS_ENDED_LABEL}
                                    </p>
                                  ) : locked || phase === "upcoming" ? (
                                    <p className="mt-0.5 text-[12px] text-[#6B7280]">
                                      {CLASS_NOT_STARTED_LABEL}
                                    </p>
                                  ) : recorded ? (
                                    <p className="mt-0.5 text-[12px] text-[#6B7280]">
                                      Recording
                                    </p>
                                  ) : null}
                                </div>
                              </div>
                              <span
                                className={cn(
                                  "inline-flex shrink-0 items-center gap-1.5 text-[15px] font-semibold",
                                  actionActive
                                    ? "text-[#4E845F]"
                                    : "text-[#94A3B8]",
                                )}
                              >
                                {action}
                                <ChevronRight className="h-5 w-5" />
                              </span>
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
