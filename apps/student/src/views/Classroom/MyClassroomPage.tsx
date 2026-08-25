"use client";

import { useProfileSetup } from "@/contexts/ProfileSetupContext";
import { findNextTodaySession } from "@/lib/sessions/today-sessions";
import { mapClassroomLessonsToSessions } from "@ssu/api";
import { useEnrolledProgram, useStudentclassroom } from "@ssu/queries";
import { DashboardEmptyState, LiveIndicator } from "@ssu/ui";
import {
  CalendarDays,
  ChevronRight,
  Clock3,
  GraduationCap,
} from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useMemo } from "react";
import { ClassroomCourseCard } from "./ClassroomCourseCard";

function formatDate(dateStr?: string): string {
  if (!dateStr) return "—";
  const date = new Date(dateStr);
  if (Number.isNaN(date.getTime())) return "—";

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

export function MyClassroomPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { ensureProfileForAction } = useProfileSetup();
  const {
    programId: enrolledProgramId,
    program: enrolledProgram,
    generalPrograms,
    liveGeneralPrograms,
    hasLiveGeneralProgram,
    isLoading: isProfileLoading,
  } = useEnrolledProgram();

  const selectedProgramId = searchParams.get("programId")?.trim() ?? "";
  const selectedProgramFromList =
    generalPrograms.find((item) => item.id === selectedProgramId) ?? null;
  const activeProgramId = selectedProgramId || enrolledProgramId;

  const { data, isLoading: isClassroomLoading } =
    useStudentclassroom(activeProgramId);

  const isLoading =
    isProfileLoading || (Boolean(activeProgramId) && isClassroomLoading);

  const handleJoinSession = (sessionId: string, sessionProgramId?: string) => {
    if (!ensureProfileForAction()) return;
    const query = sessionProgramId
      ? `?programId=${encodeURIComponent(sessionProgramId)}`
      : "";
    router.push(`/classroom/${sessionId}${query}`);
  };

  const nextSession = useMemo(() => {
    const enrolledSessions = data
      ? mapClassroomLessonsToSessions(
          data.classroom.modules,
          data.program.title ||
            selectedProgramFromList?.title ||
            enrolledProgram?.title ||
            "",
        ).map((session) => ({
          ...session,
          programId: activeProgramId,
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
    activeProgramId,
    data,
    enrolledProgram?.title,
    hasLiveGeneralProgram,
    liveGeneralPrograms,
    selectedProgramFromList?.title,
  ]);

  if (isLoading) {
    return (
      <div className="flex min-h-[320px] items-center justify-center">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-[#D4E2D8] border-t-[#4E845F]" />
      </div>
    );
  }

  if (!enrolledProgramId && generalPrograms.length === 0) {
    return (
      <DashboardEmptyState
        icon={GraduationCap}
        title="You are not enrolled in a course yet"
        description="When you enroll in a program, your classroom will appear here."
      />
    );
  }

  const program = data?.program ?? selectedProgramFromList ?? enrolledProgram;
  const modules = data?.classroom?.modules ?? [];
  const isLive = Boolean(nextSession?.isLive);
  const hasModules = modules.length > 0;
  const hasTodaySession = Boolean(nextSession);

  return (
    <div className="space-y-5">
      {enrolledProgramId || selectedProgramId || hasTodaySession ? (
        <section className="grid gap-4 xl:grid-cols-[1.8fr_0.95fr]">
          {enrolledProgramId || selectedProgramId ? (
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
                    {program?.duration || "—"}
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
          ) : (
            <div />
          )}

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
                        ? new Date(nextSession.startsAt).toLocaleTimeString(
                            [],
                            {
                              hour: "2-digit",
                              minute: "2-digit",
                            },
                          )
                        : "—"}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <CalendarDays size={12} />
                    <span className="text-[12px]">Today</span>
                  </div>
                </div>

                <div className="mt-10 flex justify-end">
                  {isLive ? (
                    <button
                      type="button"
                      onClick={() =>
                        handleJoinSession(
                          nextSession!.id,
                          nextSession?.programId,
                        )
                      }
                      className="inline-flex items-center gap-2 rounded-full bg-[#4E845F] px-4 py-2 text-[12px] font-medium text-white transition hover:bg-[#3D6E4D]"
                    >
                      Join Session
                      <ChevronRight size={16} />
                    </button>
                  ) : (
                    <span className="inline-flex items-center gap-2 rounded-full bg-[#E8EDF3] px-4 py-2 text-[12px] font-medium text-[#9AA3AF]">
                      Join Session
                      <ChevronRight size={16} />
                    </span>
                  )}
                </div>
              </>
            )}
          </div>
        </section>
      ) : null}

      {generalPrograms.length > 0 ? (
        <section>
          <div className="mb-6 flex items-center gap-2">
            <h2 className="text-[18px] font-semibold text-[#1D1D1D]">
              Courses
            </h2>
            <span className="text-[#D2D8E2]">|</span>
          </div>
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            {generalPrograms.map((item) => {
              const liveFromList = hasLiveGeneralProgram
                ? liveGeneralPrograms.find((live) => live.programId === item.id)
                : undefined;
              const lessonId =
                liveFromList?.lessonId ??
                (item.isLiveNow && item.liveLesson?.lessonId
                  ? item.liveLesson.lessonId
                  : undefined);
              const href = lessonId
                ? `/classroom/${lessonId}?programId=${encodeURIComponent(item.id)}`
                : `/classroom?programId=${encodeURIComponent(item.id)}`;

              return (
                <ClassroomCourseCard
                  key={item.id}
                  course={{ id: item.id, title: item.title }}
                  href={href}
                  subtitle={item.cohortName || item.description}
                  meta={item.duration}
                />
              );
            })}
          </div>
        </section>
      ) : null}

      {activeProgramId ? (
        <section>
          <div className="mb-6 flex items-center gap-2">
            <h2 className="text-[18px] font-semibold text-[#1D1D1D]">
              Modules
            </h2>
            <span className="text-[#D2D8E2]">|</span>
          </div>

          {!hasModules ? (
            <DashboardEmptyState
              icon={GraduationCap}
              title="No modules available yet"
              description="Your course modules will appear here once they are published."
            />
          ) : (
            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
              {modules.map((module) => (
                <ClassroomCourseCard key={module.id} course={module} />
              ))}
            </div>
          )}
        </section>
      ) : null}
    </div>
  );
}
