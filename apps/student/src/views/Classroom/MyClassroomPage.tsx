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
import { useRouter } from "next/navigation";
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
  const { ensureProfileForAction } = useProfileSetup();
  const {
    programId,
    program: enrolledProgram,
    isLoading: isProfileLoading,
  } = useEnrolledProgram();
  const { data, isLoading: isClassroomLoading } =
    useStudentclassroom(programId);

  const isLoading =
    isProfileLoading || (Boolean(programId) && isClassroomLoading);

  const handleJoinSession = (sessionId: string) => {
    if (!ensureProfileForAction()) return;
    router.push(`/classroom/${sessionId}`);
  };

  const nextSession = useMemo(() => {
    if (!data) return null;

    const sessions = mapClassroomLessonsToSessions(
      data.classroom.modules,
      data.program.title || enrolledProgram?.title || "",
    );

    return findNextTodaySession(sessions);
  }, [data, enrolledProgram?.title]);

  if (isLoading) {
    return (
      <div className="flex min-h-[320px] items-center justify-center">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-[#D4E2D8] border-t-[#4E845F]" />
      </div>
    );
  }

  if (!programId) {
    return (
      <DashboardEmptyState
        icon={GraduationCap}
        title="You are not enrolled in a course yet"
        description="When you enroll in a program, your classroom will appear here."
      />
    );
  }

  const program = data?.program ?? enrolledProgram;
  const modules = data?.classroom?.modules ?? [];
  const isLive = Boolean(nextSession?.isLive);
  const hasModules = modules.length > 0;
  const hasTodaySession = Boolean(nextSession);

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
                {isLive ? (
                  <button
                    type="button"
                    onClick={() => handleJoinSession(nextSession!.id)}
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

      <section>
        <div className="mb-6 flex items-center gap-2">
          <h2 className="text-[18px] font-semibold text-[#1D1D1D]">Modules</h2>
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
    </div>
  );
}
