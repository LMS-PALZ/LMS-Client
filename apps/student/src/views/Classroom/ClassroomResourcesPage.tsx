import type { ClassroomCourseDetail } from "@/lib/classroom-data";
import { ClassroomResourceRow } from "@/components/classroom/ClassroomResourceRow";

export function ClassroomResourcesPage({
  course,
}: {
  course: ClassroomCourseDetail;
}) {
  return (
    <div className="space-y-3">
      {course.resources.map((resource) => (
        <ClassroomResourceRow key={resource.id} resource={resource} />
      ))}
    </div>
  );
}
