"use client";

import { CoursePageClient } from "@/views/Classroom/CoursePageClient";
import { ClassroomResourcesPage } from "@/views/Classroom/ClassroomResourcesPage";

export default function Page() {
  return (
    <CoursePageClient
      render={(course) => <ClassroomResourcesPage course={course} />}
    />
  );
}
