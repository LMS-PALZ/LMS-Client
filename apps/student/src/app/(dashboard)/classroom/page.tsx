import { MyClassroomPage } from "@/views/Classroom/MyClassroomPage";
import { Suspense } from "react";

export default function Page() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[320px] items-center justify-center">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-[#D4E2D8] border-t-[#4E845F]" />
        </div>
      }
    >
      <MyClassroomPage />
    </Suspense>
  );
}
