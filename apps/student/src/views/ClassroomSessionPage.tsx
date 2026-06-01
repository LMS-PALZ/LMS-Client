"use client";

import {
  classroomWeeks,
  DEFAULT_MEET_LINK,
  getClassroomCourseById,
  getClassroomSessionCourseId,
} from "@/lib/classroom-data";
import { ClassroomCourseLayoutShell } from "@/views/Classroom/ClassroomCourseLayoutShell";
import { ClassroomOverviewPage } from "@/views/Classroom/ClassroomOverviewPage";
import { useSessionDetail } from "@ssu/queries";
import { EmptyState, Skeleton } from "@ssu/ui";
import { Megaphone } from "lucide-react";
import { useParams } from "next/navigation";

export function ClassroomSessionPage() {
  const params = useParams();
  const sessionId =
    typeof params.sessionId === "string" ? params.sessionId : "";
  const courseId = getClassroomSessionCourseId(sessionId);
  const course = courseId ? getClassroomCourseById(courseId) : null;
  const sessionQuery = useSessionDetail(sessionId);

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
      weeks={classroomWeeks}
      backHref="/classroom"
      showLiveSession
      meetUrl={meetUrl}
      isLive={!!isLive}
    >
      {sessionQuery.isLoading ? (
        <Skeleton className="h-24 rounded-xl" />
      ) : (
        <ClassroomOverviewPage course={course} />
      )}
    </ClassroomCourseLayoutShell>
  );
}
