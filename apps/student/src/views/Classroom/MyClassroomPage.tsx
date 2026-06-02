"use client";

import { useProfileSetup } from "@/contexts/ProfileSetupContext";
import { resolveLiveVideoForCourse } from "@/lib/classroom/live-video";
import { classroomProgram, getClassroomCourseById } from "@/lib/classroom-data";
import { BookCopy, CalendarDays, ChevronRight, Clock3 } from "lucide-react";
import { useRouter } from "next/navigation";
import { ClassroomCourseCard } from "./ClassroomCourseCard";

export function MyClassroomPage() {
  const router = useRouter();
  const { ensureProfileForAction } = useProfileSetup();
  const { liveSession } = classroomProgram;
  const isLive = liveSession.phase === "live";
  const sessionHref = `/classroom/${liveSession.sessionId}`;

  const handleJoinSession = () => {
    if (!ensureProfileForAction()) return;
    const course = getClassroomCourseById(liveSession.courseId);
    if (course) {
      const liveVideo = resolveLiveVideoForCourse(course, liveSession.meetUrl);
      if (liveVideo.provider === "google-meet" && liveVideo.meetUrl) {
        window.open(liveVideo.meetUrl, "_blank", "noopener,noreferrer");
      }
    }
    router.push(sessionHref);
  };

  return (
    <div className="space-y-5">
      <section className="grid gap-4 xl:grid-cols-[1.8fr_0.95fr]">
        <div className="rounded-[18px] bg-[#EEF9ED] p-6">
          <div className="inline-flex rounded-full bg-white px-2 py-1 text-[9px] font-medium text-[#7A8594]">
            Enrolled
          </div>

          <h1 className="mt-2 text-[18px] font-bold text-[#1D1D1D] md:text-[20px]">
            {classroomProgram.title}
          </h1>

          <p className="mt-2 text-[15px] leading-7 text-[#495057]">
            {classroomProgram.description}
          </p>

          <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div>
              <div className="flex items-center gap-2 text-[13px] font-medium text-[#4A4F59]">
                <BookCopy className="h-3 w-3" />
                <span>Contents</span>
              </div>
              <p className="mt-1 text-[13px] text-[#6B7280]">
                {classroomProgram.contentCount}
              </p>
            </div>

            <div>
              <div className="flex items-center gap-2 text-[13px] font-medium text-[#4A4F59]">
                <Clock3 className="h-3 w-3" />
                <span>Duration</span>
              </div>
              <p className="mt-1 text-[13px] text-[#6B7280]">
                {classroomProgram.duration}
              </p>
            </div>

            <div>
              <div className="flex items-center gap-2 text-[13px] font-medium text-[#4A4F59]">
                <CalendarDays className="h-3 w-3" />
                <span>Start Date</span>
              </div>
              <p className="mt-1 text-[13px] text-[#6B7280]">
                {classroomProgram.startDate}
              </p>
            </div>

            <div>
              <div className="flex items-center gap-2 text-[13px] font-medium text-[#4A4F59]">
                <CalendarDays className="h-3 w-3" />
                <span>End Date</span>
              </div>
              <p className="mt-1 text-[13px] text-[#6B7280]">
                {classroomProgram.endDate}
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-[18px] border border-[#EEF2F6] bg-white p-5 md:p-4">
          <div
            className={`inline-flex items-center rounded-full px-3 py-1 text-[13px] font-medium ${
              isLive
                ? "bg-[#FCE3DE] text-[#D14B3D]"
                : "bg-[#E8F4FC] text-[#2B6CB0]"
            }`}
          >
            <span
              className={`mr-2 h-2 w-2 rounded-full ${
                isLive ? "bg-[#D14B3D]" : "bg-[#2B6CB0]"
              }`}
            />
            {isLive ? "Live" : "Upcoming"}
          </div>

          <h2 className="mt-5 text-[16px] font-medium leading-9 text-[#1D1D1D]">
            {liveSession.title}
          </h2>

          <div className="mt-3 flex items-center gap-5 text-[16px] text-[#6B7280]">
            <div className="flex items-center gap-2">
              <Clock3 size={12} />
              <span className="text-[12px]">{liveSession.time}</span>
            </div>

            <div className="flex items-center gap-2">
              <CalendarDays size={12} />
              <span className="text-[12px]">{liveSession.date}</span>
            </div>
          </div>

          <div className="mt-10 flex justify-end">
            {isLive ? (
              <button
                type="button"
                onClick={handleJoinSession}
                className="inline-flex items-center gap-2 rounded-full bg-[#4E845F] px-4 py-2 text-[12px] font-medium text-white transition hover:bg-[#3D6E4D]"
              >
                Join Session
                <ChevronRight size={16} />
              </button>
            ) : (
              <span className="inline-flex items-center gap-2 rounded-full bg-[#E8EDF3] px-4 py-2 text-[12px] font-medium text-[#9AA3AF]">
                Join Session
                <ChevronRight size={16} />
              </span>
            )}
          </div>
        </div>
      </section>

      <section>
        <div className="mb-6 flex items-center gap-2">
          <h2 className="text-[18px] font-semibold text-[#1D1D1D]">Courses</h2>
          <span className="text-[#D2D8E2]">|</span>
        </div>

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {classroomProgram.courseItems.map((course) => (
            <ClassroomCourseCard key={course.id} course={course} />
          ))}
        </div>
      </section>
    </div>
  );
}
