import { CourseCurriculumPage } from "@/views/CourseCurriculumPage";

interface CourseCurriculumRouteProps {
  params: Promise<{ id: string }>;
}

export default async function CourseCurriculumRoute({
  params,
}: CourseCurriculumRouteProps) {
  const { id } = await params;
  return <CourseCurriculumPage courseId={id} />;
}
