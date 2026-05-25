import { notFound } from "next/navigation";
import type { ReactNode } from "react";

import { classroomWeeks, getClassroomCourseById } from "@/lib/classroom-data";
import { ClassroomCourseLayoutShell } from "@/views/Classroom/ClassroomCourseLayoutShell";

export default async function CourseLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const course = getClassroomCourseById(id);

  if (!course) {
    notFound();
  }

  return (
    <ClassroomCourseLayoutShell course={course} weeks={classroomWeeks}>
      {children}
    </ClassroomCourseLayoutShell>
  );
}
