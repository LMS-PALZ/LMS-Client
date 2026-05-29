import type { ClassroomCourseDetail } from "@/lib/classroom-data";

export function ClassroomOverviewPage({
  course,
}: {
  course: ClassroomCourseDetail;
}) {
  return (
    <div className="text-[14px] leading-6 font-medium text-[#2F3540]">
      {course.overview}
    </div>
  );
}
