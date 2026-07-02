"use client";

import { ClassroomRecordingPage } from "@/views/Classroom/ClassroomRecordingPage";
import { useClassroomCourse } from "@/contexts/ClassroomCourseContext";

export default function ClassroomSessionRecordingPage() {
  const { course } = useClassroomCourse();
  return <ClassroomRecordingPage course={course} />;
}
