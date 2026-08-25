import { ClassroomSessionLayout } from "@/views/Classroom/ClassroomSessionLayout";
import type { ReactNode } from "react";
import { Suspense } from "react";

export default async function SessionLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ sessionId: string }>;
}) {
  const { sessionId } = await params;
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[240px] items-center justify-center">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-[#D4E2D8] border-t-[#4E845F]" />
        </div>
      }
    >
      <ClassroomSessionLayout sessionId={sessionId}>
        {children}
      </ClassroomSessionLayout>
    </Suspense>
  );
}
