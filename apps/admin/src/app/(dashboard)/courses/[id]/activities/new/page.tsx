import { Suspense } from "react";
import { Spinner } from "@ssu/ui";
import { CourseActivityPage } from "@/views/CourseActivityPage";

interface CourseActivityRouteProps {
  params: Promise<{ id: string }>;
}

export default async function CourseActivityRoute({
  params,
}: CourseActivityRouteProps) {
  const { id } = await params;

  return (
    <Suspense
      fallback={
        <div className="flex min-h-[420px] items-center justify-center">
          <Spinner />
        </div>
      }
    >
      <CourseActivityPage courseId={id} />
    </Suspense>
  );
}
