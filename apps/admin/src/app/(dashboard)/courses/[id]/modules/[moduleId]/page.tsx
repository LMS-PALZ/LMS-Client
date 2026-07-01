import { CourseModuleEditPage } from "@/views/CourseModuleEditPage";

interface CourseModuleRouteProps {
  params: Promise<{ id: string; moduleId: string }>;
}

export default async function CourseModuleRoute({
  params,
}: CourseModuleRouteProps) {
  const { id, moduleId } = await params;
  return <CourseModuleEditPage courseId={id} moduleId={moduleId} />;
}
