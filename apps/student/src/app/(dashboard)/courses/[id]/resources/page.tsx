import { notFound } from "next/navigation";

import { getClassroomCourseById } from "@/lib/classroom-data";
import { ClassroomResourcesPage } from "@/views/Classroom/ClassroomResourcesPage";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const course = getClassroomCourseById(id);

  if (!course) {
    notFound();
  }

  return <ClassroomResourcesPage course={course} />;
}
