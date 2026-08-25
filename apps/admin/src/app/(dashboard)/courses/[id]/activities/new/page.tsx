import { Suspense } from "react";
import { AdminActivityFormSkeleton } from "@/components/skeletons";
import { CourseActivityPage } from "@/views/CourseActivityPage";

interface CourseActivityRouteProps {
  params: Promise<{ id: string }>;
}

export default async function CourseActivityRoute({
  params,
}: CourseActivityRouteProps) {
  const { id } = await params;

  return (
    <Suspense fallback={<AdminActivityFormSkeleton />}>
      <CourseActivityPage courseId={id} />
    </Suspense>
  );
}
