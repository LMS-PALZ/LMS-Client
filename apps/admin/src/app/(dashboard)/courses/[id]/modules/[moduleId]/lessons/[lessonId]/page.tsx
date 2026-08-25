import { CourseLessonDetailPage } from "@/views/CourseLessonDetailPage";

interface CourseLessonRouteProps {
  params: Promise<{ id: string; moduleId: string; lessonId: string }>;
}

export default async function CourseLessonRoute({
  params,
}: CourseLessonRouteProps) {
  const { id, moduleId, lessonId } = await params;
  return (
    <CourseLessonDetailPage
      courseId={id}
      moduleId={moduleId}
      lessonId={lessonId}
    />
  );
}
