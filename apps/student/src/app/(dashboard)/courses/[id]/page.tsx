"use client";

import { CoursePageClient } from "@/views/Classroom/CoursePageClient";
import { ClassroomOverviewPage } from "@/views/Classroom/ClassroomOverviewPage";

export default function Page() {
  return (
    <CoursePageClient
      render={(course) => <ClassroomOverviewPage course={course} />}
    />
  );
}
