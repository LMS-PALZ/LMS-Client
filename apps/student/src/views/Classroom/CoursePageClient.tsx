"use client";

import { useStudentclassroom } from "@ssu/queries";
import { mapClassroomResponse } from "@/lib/classroom/mappers";
import { Spinner } from "@ssu/ui";
import type { ClassroomCourseDetail } from "@/lib/classroom-data";

interface Props {
  render: (course: ClassroomCourseDetail) => React.ReactNode;
}

export function CoursePageClient({ render }: Props) {
  const Id = localStorage.getItem("profileId") ?? "";
  const { data, isLoading } = useStudentclassroom(Id);

  if (isLoading) {
    return (
      <div className="flex min-h-[200px] items-center justify-center">
        <Spinner className="h-6 w-6 animate-spin text-[#4E845F]" />
      </div>
    );
  }

  if (!data) return null;

  const { course } = mapClassroomResponse(data);

  return <>{render(course)}</>;
}
