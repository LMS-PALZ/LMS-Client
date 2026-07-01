import { CourseDetailPage } from "@/views/CourseDetailPage";

interface CoursePageProps {
  params: Promise<{ id: string }>;
}

export default async function CoursePage({ params }: CoursePageProps) {
  const { id } = await params;
  return <CourseDetailPage courseId={id} />;
}
