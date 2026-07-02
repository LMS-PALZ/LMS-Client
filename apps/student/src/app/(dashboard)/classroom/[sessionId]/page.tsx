"use client";

import { useClassroomCourse } from "@/contexts/ClassroomCourseContext";
import { ClassroomOverviewPage } from "@/views/Classroom/ClassroomOverviewPage";

export default function ClassroomSessionOverviewPage() {
  const { course } = useClassroomCourse();
  return <ClassroomOverviewPage course={course} />;
}
