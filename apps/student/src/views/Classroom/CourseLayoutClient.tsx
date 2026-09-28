"use client";

import { useEnrolledProgram, useStudentclassroom } from "@ssu/queries";
import { mapClassroomResponse } from "@/lib/classroom/mappers";
import { ClassroomCourseLayoutShell } from "@/views/Classroom/ClassroomCourseLayoutShell";
import { Spinner, EmptyState } from "@ssu/ui";
import { Megaphone } from "lucide-react";
import type { ReactNode } from "react";

interface Props {
  moduleId: string;
  children: ReactNode;
}

export function CourseLayoutClient({ moduleId, children }: Props) {
  const { programId } = useEnrolledProgram();
  const { data, isLoading, isError } = useStudentclassroom(programId);

  if (isLoading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <Spinner className="h-8 w-8 animate-spin text-[#4E845F]" />
      </div>
    );
  }

  if (isError || !data) {
    return (
      <EmptyState
        icon={Megaphone}
        title="You don't have any course video yet"
        description="When you do, they'll show up here"
      />
    );
  }

  const { course, weeks } = mapClassroomResponse(data);

  const allWeeks = weeks.map((week) => ({
    ...week,
    expanded: week.id === moduleId,
  }));

  // Module routes are curriculum entry points — do not auto-play the first lesson.
  const courseForShell = {
    ...course,
    recordingEmbedUrl: null,
    meetUrl: "",
    sessionPhase: "upcoming" as const,
    sessionLabel: course.sessionLabel || "MODULE",
  };

  return (
    <ClassroomCourseLayoutShell
      course={courseForShell}
      weeks={allWeeks}
      meetUrl=""
      backFallbackHref="/classroom"
      programId={programId}
      isLive={false}
    >
      {children}
    </ClassroomCourseLayoutShell>
  );
}
