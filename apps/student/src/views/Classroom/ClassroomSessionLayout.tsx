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
import { useSearchParams } from "next/navigation";

export function ClassroomSessionLayout({
  sessionId,
  children,
}: {
  sessionId: string;
  children: ReactNode;
}) {
  const { data: user } = useSession();
  const searchParams = useSearchParams();
  const {
    programId: enrolledProgramId,
    generalPrograms,
    liveGeneralPrograms,
  } = useEnrolledProgram();

  const programIdFromQuery = searchParams.get("programId")?.trim() ?? "";
  const programIdFromLive = useMemo(() => {
    const match = liveGeneralPrograms.find(
      (item) => item.lessonId === sessionId,
    );
    return match?.programId ?? "";
  }, [liveGeneralPrograms, sessionId]);

  const knownGeneralIds = useMemo(
    () => new Set(generalPrograms.map((program) => program.id)),
    [generalPrograms],
  );

  const programId =
    programIdFromQuery ||
    programIdFromLive ||
    (knownGeneralIds.has(enrolledProgramId) ? enrolledProgramId : "") ||
    enrolledProgramId;

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

  // Live general sessions can be joined from me payload even before classroom loads.
  const liveGeneralFallback = useMemo(() => {
    return (
      liveGeneralPrograms.find((item) => item.lessonId === sessionId) ?? null
    );
  }, [liveGeneralPrograms, sessionId]);

  if (!programId && !liveGeneralFallback) {
    return (
      <EmptyState
        icon={Megaphone}
        title="No enrolled course"
        description="Enroll in a program to access live sessions."
      />
    );
  }

  if (classroomQuery.isLoading && !liveGeneralFallback) {
    return (
      <div className="flex min-h-[240px] items-center justify-center">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-[#D4E2D8] border-t-[#4E845F]" />
      </div>
    );
  }

  if (!classroomQuery.data && !liveGeneralFallback) {
    return (
      <EmptyState
        icon={Megaphone}
        title="Session not found"
        description="This class is not available right now."
      />
    );
  }

  if (!classroomQuery.data && liveGeneralFallback) {
    const meetUrl =
      liveGeneralFallback.zoomJoinUrl ||
      liveGeneralFallback.liveSessionUrl ||
      "";
    const course: import("@/lib/classroom/types").ClassroomCourseDetail = {
      id: liveGeneralFallback.programId,
      title: liveGeneralFallback.programTitle || "Live class",
      courseLabel: liveGeneralFallback.programTitle || "Live",
      syllabusCount: 0,
      sessionPhase: "live",
      sessionId,
      sessionLabel: "Live",
      sessionDuration: liveGeneralFallback.durationMinutes
        ? `${liveGeneralFallback.durationMinutes} mins`
        : "",
      scheduledAt: liveGeneralFallback.startsAt,
      meetUrl,
      liveVideoProvider: "zoom",
      description: liveGeneralFallback.lessonTitle,
      overview: liveGeneralFallback.lessonTitle,
      recordingSummary: "",
      recordingTitle: liveGeneralFallback.lessonTitle,
      recordingEmbedUrl: null,
      resources: [],
      href: `/classroom/${sessionId}?programId=${encodeURIComponent(liveGeneralFallback.programId)}`,
    };

    return (
      <ClassroomCourseProvider
        value={{ course, weeks: [], meetUrl, isLive: true }}
      >
        <ClassroomCourseLayoutShell
          course={course}
          weeks={[]}
          backFallbackHref="/classroom"
          meetUrl={meetUrl}
          isLive
          displayName={displayName}
          programId={liveGeneralFallback.programId}
        >
          {children}
        </ClassroomCourseLayoutShell>
      </ClassroomCourseProvider>
    );
  }

  const mapped = mapClassroomResponse(classroomQuery.data!);
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
    lesson?.startsAt ?? liveGeneralFallback?.startsAt,
    lesson?.durationMinutes ?? liveGeneralFallback?.durationMinutes,
    extendedLesson?.isLiveNow || Boolean(liveGeneralFallback),
  );
  const isLive = sessionPhase === "live";
  const meetUrl =
    lesson?.zoomJoinUrl ||
    lesson?.liveSessionUrl ||
    liveGeneralFallback?.zoomJoinUrl ||
    liveGeneralFallback?.liveSessionUrl ||
    mapped.course.meetUrl;
  const meetingNumber = (lesson?.zoomMeetingId ?? "").replace(/\D/g, "");
  const course = {
    ...mapped.course,
    sessionId,
    sessionPhase,
    scheduledAt:
      lesson?.startsAt ??
      liveGeneralFallback?.startsAt ??
      mapped.course.scheduledAt,
    meetUrl,
    recordingTitle:
      lesson?.title ??
      liveGeneralFallback?.lessonTitle ??
      mapped.course.recordingTitle,
    recordingEmbedUrl:
      lesson?.recordingUrl ?? mapped.course.recordingEmbedUrl ?? null,
    sessionDuration: lesson?.durationMinutes
      ? `${lesson.durationMinutes} mins`
      : liveGeneralFallback?.durationMinutes
        ? `${liveGeneralFallback.durationMinutes} mins`
        : mapped.course.sessionDuration || "",
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
        meetingNumber={meetingNumber}
        isLive={isLive}
        displayName={displayName}
        programId={programId}
      >
        {children}
      </ClassroomCourseLayoutShell>
    </ClassroomCourseProvider>
  );
}
