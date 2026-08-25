import type { ReactNode } from "react";
import { CourseLayoutClient } from "@/views/Classroom/CourseLayoutClient";

export default async function CourseLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return <CourseLayoutClient moduleId={id}>{children}</CourseLayoutClient>;
}
