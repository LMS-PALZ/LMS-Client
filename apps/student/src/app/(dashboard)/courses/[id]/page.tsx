import { classroomProgram, getClassroomCourseById } from "@/lib/classroom-data";
import { ClassroomOverviewPage } from "@/views/Classroom/ClassroomOverviewPage";
import { EmptyState } from "@ssu/ui";
import { Megaphone } from "lucide-react";
import { redirect } from "next/navigation";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const course = getClassroomCourseById(id);

  if (!course) {
    return (
      <EmptyState
        icon={Megaphone}
        title="Course not found"
        description="This course is not available in your classroom."
      />
    );
  }

  if (
    course.sessionPhase === "live" &&
    id === classroomProgram.liveSession.courseId
  ) {
    redirect(`/classroom/${classroomProgram.liveSession.sessionId}`);
  }

  return <ClassroomOverviewPage course={course} />;
}
