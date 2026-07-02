"use client";

import { ClassroomResourcesPage } from "@/views/Classroom/ClassroomResourcesPage";
import { useClassroomCourse } from "@/contexts/ClassroomCourseContext";

export default function ClassroomSessionResourcesPage() {
  const { course } = useClassroomCourse();
  return <ClassroomResourcesPage course={course} />;
}
