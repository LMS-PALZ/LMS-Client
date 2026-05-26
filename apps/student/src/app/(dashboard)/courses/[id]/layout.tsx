import type { ReactNode } from "react";

import { classroomWeeks, getClassroomCourseById } from "@/lib/classroom-data";
import { ClassroomCourseLayoutShell } from "@/views/Classroom/ClassroomCourseLayoutShell";
import { EmptyState } from "@ssu/ui";
import { Megaphone } from "lucide-react";

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
    return (
      <EmptyState
        icon={Megaphone}
        title="You don't have any course video yet"
        description="When you do, they'll show up here"
      />
    );
  }
  return (
    <ClassroomCourseLayoutShell course={course} weeks={classroomWeeks}>
      {children}
    </ClassroomCourseLayoutShell>
  );
}
