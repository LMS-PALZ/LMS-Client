import {
  getClassroomSessionCourseId,
  getClassroomCourseById,
} from "@/lib/classroom-data";
import { ClassroomRecordingPage } from "@/views/Classroom/ClassroomRecordingPage";
import { redirect } from "next/navigation";

export default async function ClassroomSessionRecordingPage({
  params,
}: {
  params: Promise<{ sessionId: string }>;
}) {
  const { sessionId } = await params;
  const courseId = getClassroomSessionCourseId(sessionId);
  const course = courseId ? getClassroomCourseById(courseId) : null;

  if (!course) {
    redirect("/classroom");
  }

  return <ClassroomRecordingPage course={course} />;
}
