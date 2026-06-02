"use client";

import {
  DEFAULT_MEET_LINK,
  getClassroomCourseById,
  getClassroomSessionCourseId,
  getClassroomWeeksForCourse,
} from "@/lib/classroom-data";
import { ClassroomCourseLayoutShell } from "@/views/Classroom/ClassroomCourseLayoutShell";
import { useSession, useSessionDetail } from "@ssu/queries";
import { EmptyState } from "@ssu/ui";
import { Megaphone } from "lucide-react";
import type { ReactNode } from "react";

export function ClassroomSessionLayout({
  sessionId,
  children,
}: {
  sessionId: string;
  children: ReactNode;
}) {
  const courseId = getClassroomSessionCourseId(sessionId);
  const course = courseId ? getClassroomCourseById(courseId) : null;
  const { data: user } = useSession();
  const sessionQuery = useSessionDetail(sessionId);
  const weeks = courseId ? getClassroomWeeksForCourse(courseId) : [];
  const displayName =
    [user?.firstName, user?.lastName].filter(Boolean).join(" ").trim() ||
    "Student";

  if (!course) {
    return (
      <EmptyState
        icon={Megaphone}
        title="Session not found"
        description="This class is not available right now."
      />
    );
  }

  const meetUrl =
    sessionQuery.data?.meetingUrl ?? course.meetUrl ?? DEFAULT_MEET_LINK;
  const isLive = course.sessionPhase === "live" || sessionQuery.data?.isLive;

  return (
    <ClassroomCourseLayoutShell
      course={course}
      weeks={weeks}
      backFallbackHref="/classroom"
      meetUrl={meetUrl}
      isLive={!!isLive}
      displayName={displayName}
    >
      {children}
    </ClassroomCourseLayoutShell>
  );
}
