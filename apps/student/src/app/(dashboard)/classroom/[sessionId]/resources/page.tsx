import {
  getClassroomSessionCourseId,
  getClassroomCourseById,
} from "@/lib/classroom-data";
import { ClassroomResourcesPage } from "@/views/Classroom/ClassroomResourcesPage";
import { redirect } from "next/navigation";

export default async function ClassroomSessionResourcesPage({
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

  return <ClassroomResourcesPage course={course} />;
}
