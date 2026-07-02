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

  const currentModule = data.classroom.modules.find(
    (module) => module.id === moduleId,
  );
  const meetUrl = currentModule?.lessons?.[0]?.liveSessionUrl ?? "";

  return (
    <ClassroomCourseLayoutShell
      course={course}
      weeks={allWeeks}
      meetUrl={meetUrl}
      backFallbackHref="/classroom"
    >
      {children}
    </ClassroomCourseLayoutShell>
  );
}
