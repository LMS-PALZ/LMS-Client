"use client";

import { useClassroomCourse } from "@/contexts/ClassroomCourseContext";
import { ClassroomOverviewPage } from "@/views/Classroom/ClassroomOverviewPage";

export default function ClassroomSessionRecordingPage() {
  const { course } = useClassroomCourse();
  return <ClassroomOverviewPage course={course} />;
}
