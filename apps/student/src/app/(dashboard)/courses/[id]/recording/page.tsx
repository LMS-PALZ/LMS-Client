import { notFound } from "next/navigation";

import { getClassroomCourseById } from "@/lib/classroom-data";
import { ClassroomRecordingPage } from "@/views/Classroom/ClassroomRecordingPage";

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

  return <ClassroomRecordingPage course={course} />;
}
