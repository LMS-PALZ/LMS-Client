import type { ClassroomCourseDetail } from "@/lib/classroom/types";

export function ClassroomOverviewPage({
  course,
}: {
  course: ClassroomCourseDetail;
}) {
  return (
    <div className="space-y-4">
      <h2 className="text-[16px] font-semibold text-[#1D1D1D]">Overview</h2>
      <p className="text-[14px] leading-7 text-[#495057]">
        {course.overview || "No overview available for this course."}
      </p>
    </div>
  );
}
