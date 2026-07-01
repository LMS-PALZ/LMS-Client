import { CourseCurriculumPage } from "@/views/CourseCurriculumPage";

interface CourseDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function CourseDetailPage({
  params,
}: CourseDetailPageProps) {
  const { id } = await params;
  return <CourseCurriculumPage courseId={id} />;
}
