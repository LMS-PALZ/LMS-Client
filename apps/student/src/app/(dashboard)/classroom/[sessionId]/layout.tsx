import { ClassroomSessionLayout } from "@/views/Classroom/ClassroomSessionLayout";
import type { ReactNode } from "react";

export default async function SessionLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ sessionId: string }>;
}) {
  const { sessionId } = await params;
  return (
    <ClassroomSessionLayout sessionId={sessionId}>
      {children}
    </ClassroomSessionLayout>
  );
}
