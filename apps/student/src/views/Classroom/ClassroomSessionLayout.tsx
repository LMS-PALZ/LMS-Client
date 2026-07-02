"use client";

import { ClassroomCourseLayoutShell } from "@/views/Classroom/ClassroomCourseLayoutShell";
import { resolveLessonSessionPhase } from "@/lib/calendar/session-phase";
import { mapClassroomResponse } from "@/lib/classroom/mappers";
import { ClassroomCourseProvider } from "@/contexts/ClassroomCourseContext";
import {
  useEnrolledProgram,
  useSession,
  useStudentclassroom,
} from "@ssu/queries";
import { EmptyState } from "@ssu/ui";
import { Megaphone } from "lucide-react";
import type { ReactNode } from "react";
import { useMemo } from "react";

export function ClassroomSessionLayout({
  sessionId,
  children,
}: {
  sessionId: string;
  children: ReactNode;
}) {
  const { data: user } = useSession();
  const { programId } = useEnrolledProgram();
  const classroomQuery = useStudentclassroom(programId);
  const displayName =
    [user?.firstName, user?.lastName].filter(Boolean).join(" ").trim() ||
    "Student";

  const lesson = useMemo(() => {
    return (
      classroomQuery.data?.classroom?.modules
        ?.flatMap((module) => module.lessons ?? [])
        ?.find((item) => item.id === sessionId) ?? null
    );
  }, [classroomQuery.data, sessionId]);

  if (!programId) {
    return (
      <EmptyState
        icon={Megaphone}
        title="No enrolled course"
        description="Enroll in a program to access live sessions."
      />
    );
  }

  if (classroomQuery.isLoading) {
    return (
      <div className="flex min-h-[240px] items-center justify-center">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-[#D4E2D8] border-t-[#4E845F]" />
      </div>
    );
  }

  if (!classroomQuery.data) {
    return (
      <EmptyState
        icon={Megaphone}
        title="Session not found"
        description="This class is not available right now."
      />
    );
  }

  const mapped = mapClassroomResponse(classroomQuery.data);
  const extendedLesson = lesson as
    | (NonNullable<typeof lesson> & {
        isLiveNow?: boolean;
        resources?: Array<{
          id?: string;
          title?: string;
          type?: string;
          url?: string | null;
          content?: string | null;
        }>;
      })
    | null;
  const sessionPhase = resolveLessonSessionPhase(
    lesson?.startsAt,
    lesson?.durationMinutes,
    extendedLesson?.isLiveNow,
  );
  const isLive = sessionPhase === "live";
  const meetUrl = lesson?.liveSessionUrl ?? mapped.course.meetUrl;
  const course = {
    ...mapped.course,
    sessionId,
    sessionPhase,
    scheduledAt: lesson?.startsAt ?? mapped.course.scheduledAt,
    meetUrl,
    recordingTitle: lesson?.title ?? mapped.course.recordingTitle,
    recordingEmbedUrl:
      lesson?.recordingUrl ?? mapped.course.recordingEmbedUrl ?? null,
    sessionDuration: lesson?.durationMinutes
      ? `${lesson.durationMinutes} mins`
      : mapped.course.sessionDuration,
    resources:
      extendedLesson?.resources?.map((resource, index) => ({
        id: resource.id ?? `${sessionId}-resource-${index}`,
        title: resource.title ?? "Resource",
        type: resource.type,
        url: resource.url ?? null,
        content: resource.content ?? null,
      })) ?? mapped.course.resources,
  };
  const weeks = mapped.weeks;

  return (
    <ClassroomCourseProvider value={{ course, weeks, meetUrl, isLive }}>
      <ClassroomCourseLayoutShell
        course={course}
        weeks={weeks}
        backFallbackHref="/classroom"
        meetUrl={meetUrl}
        isLive={isLive}
        displayName={displayName}
      >
        {children}
      </ClassroomCourseLayoutShell>
    </ClassroomCourseProvider>
  );
}
