import type { ClassroomCourseDetail } from "@/lib/classroom-data";

export function ClassroomRecordingPage({
  course,
}: {
  course: ClassroomCourseDetail;
}) {
  return (
    <div className="space-y-4">
      <div className="rounded-[15px] bg-[#F4F7FA] p-5">
        <p className="text-[14px] font-medium uppercase tracking-[0.08em] text-[#7A8594]">
          Latest Recording
        </p>
        <p className="mt-3 text-[14px] leading-7 text-[#2F3540]">
          {course.recordingSummary}
        </p>
      </div>

      <div className="rounded-[18px] border border-[#E8EDF5] p-5">
        <p className="text-[14px] font-medium text-[#1D1D1D]">Replay Notes</p>
        <p className="mt-2 text-[14px] leading-8 text-[#6B7280]">
          Use this page to rewatch the class and follow along with the same
          weekly syllabus on the right.
        </p>
      </div>
    </div>
  );
}
