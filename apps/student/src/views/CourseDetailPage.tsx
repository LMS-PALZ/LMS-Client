import { getClassroomCourseById } from "@/lib/classroom-data";
import { ClassroomOverviewPage } from "./Classroom/ClassroomOverviewPage";

export function CourseDetailPage({ id }: { id: string }) {
  const course = getClassroomCourseById(id);

  if (!course) {
    return null;
  }

  return <ClassroomOverviewPage course={course} />;
}
