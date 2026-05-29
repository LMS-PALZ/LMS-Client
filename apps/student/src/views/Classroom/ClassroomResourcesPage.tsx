import type { ClassroomCourseDetail } from "@/lib/classroom-data";

export function ClassroomResourcesPage({
  course,
}: {
  course: ClassroomCourseDetail;
}) {
  return (
    <div className="space-y-3">
      {course.resources.map((resource) => (
        <div
          key={resource.id}
          className="rounded-[15px] border border-[#E8EDF5] bg-white p-5"
        >
          <p className="text-[14px] font-medium text-[#1D1D1D]">
            {resource.title}
          </p>
          <p className="mt-2 text-[14px] text-[#7A8594]">{resource.meta}</p>
        </div>
      ))}
    </div>
  );
}
