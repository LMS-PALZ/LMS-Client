import { getClassroomCourseById } from "@/lib/classroom-data";
import { ClassroomResourcesPage } from "@/views/Classroom/ClassroomResourcesPage";
import { EmptyState } from "@ssu/ui";
import { Megaphone } from "lucide-react";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const course = getClassroomCourseById(id);

  if (!course) {
    return (
      <EmptyState
        icon={Megaphone}
        title="You don't have any Resources yet"
        description="When you do, they'll show up here"
      />
    );
  }
  return <ClassroomResourcesPage course={course} />;
}
