"use client";

import { CoursePageClient } from "@/views/Classroom/CoursePageClient";
import { ClassroomRecordingPage } from "@/views/Classroom/ClassroomRecordingPage";

export default function Page() {
  return (
    <CoursePageClient
      render={(course) => <ClassroomRecordingPage course={course} />}
    />
  );
}
