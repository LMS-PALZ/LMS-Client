"use client";

import { useProfileSetup } from "@/contexts/ProfileSetupContext";
import { resolveLiveVideoForCourse } from "@/lib/classroom/live-video";
import { classroomProgram, getClassroomCourseById } from "@/lib/classroom-data";
import { LiveIndicator } from "@ssu/ui";
import { CalendarDays, ChevronRight, Clock3 } from "lucide-react";
import { useRouter } from "next/navigation";
import { ClassroomCourseCard } from "./ClassroomCourseCard";
import { useStudentclassroom } from "@ssu/queries";

export function MyClassroomPage() {
  const router = useRouter();
  const { ensureProfileForAction } = useProfileSetup();
  const { liveSession } = classroomProgram;
  const isLive = liveSession.phase === "live";
  const sessionHref = `/classroom/${liveSession.sessionId}`;

  const Id = localStorage.getItem("profileId") ?? "";
  const { data } = useStudentclassroom(Id);

  console.log("classroom data", data?.modules?.createdAt);

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

  function formatDate(dateStr: string): string {
    const date = new Date(dateStr);

    const day = date.getDate();
    const month = date.toLocaleString("en-US", { month: "long" });
    const year = date.getFullYear();

    const suffix =
      day % 10 === 1 && day !== 11
        ? "st"
        : day % 10 === 2 && day !== 12
          ? "nd"
          : day % 10 === 3 && day !== 13
            ? "rd"
            : "th";

    return `${day}${suffix} ${month}, ${year}`;
  }

  console.log("modules", data?.classroom?.modules);

  return (
    <div className="space-y-5">
      <section className="grid gap-4 xl:grid-cols-[1.8fr_0.95fr]">
        <div className="rounded-[18px] bg-[#EEF9ED] p-6">
          <div className="inline-flex rounded-full bg-white px-2 py-1 text-[9px] font-medium text-[#7A8594]">
            Enrolled
          </div>

          <h1 className="mt-2 text-[18px] font-bold text-[#1D1D1D] md:text-[20px]">
            {data?.program?.title}
          </h1>

          <p className="mt-2 text-[15px] leading-7 text-[#495057]">
            {data?.program?.description}
          </p>

          <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div>
              <div className="flex items-center gap-2 text-[13px] font-medium text-[#4A4F59]">
                <Clock3 className="h-3 w-3" />
                <span>Duration</span>
              </div>
              <p className="mt-1 text-[13px] text-[#6B7280]">
                {data?.program?.duration}
              </p>
            </div>

            <div>
              <div className="flex items-center gap-2 text-[13px] font-medium text-[#4A4F59]">
                <CalendarDays className="h-3 w-3" />
                <span>Start Date</span>
              </div>
              <p className="mt-1 text-[13px] text-[#6B7280]">
                {formatDate(data?.program?.startDate)}
              </p>
            </div>

            <div>
              <div className="flex items-center gap-2 text-[13px] font-medium text-[#4A4F59]">
                <CalendarDays className="h-3 w-3" />
                <span>End Date</span>
              </div>
              <p className="mt-1 text-[13px] text-[#6B7280]">
                {formatDate(data?.program?.endDate)}
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-[18px] border border-[#EEF2F6] bg-white p-5 md:p-4">
          {isLive ? (
            <LiveIndicator label="Live" size="md" tone="classroom" />
          ) : (
            <span className="inline-flex items-center rounded-full bg-[#E8F4FC] px-3 py-1.5 text-[13px] font-semibold text-[#2B6CB0]">
              Upcoming
            </span>
          )}

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
          <h2 className="text-[18px] font-semibold text-[#1D1D1D]">Modules</h2>
          <span className="text-[#D2D8E2]">|</span>
        </div>

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {data?.classroom?.modules?.map((module: any) => (
            <ClassroomCourseCard key={module?.id} course={module} />
          ))}
        </div>
      </section>
    </div>
  );
}
