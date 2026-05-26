"use client";

import { BookCopy, CalendarDays, ChevronRight, Clock3 } from "lucide-react";
import Link from "next/link";
import { ClassroomCourseCard } from "./ClassroomCourseCard";
import { classroomProgram } from "@/lib/classroom-data";

export function MyClassroomPage() {
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
          <div className="inline-flex items-center rounded-full bg-[#FCE3DE] px-3 py-1 text-[13px] font-medium text-[#D14B3D]">
            <span className="mr-2 h-2 w-2 rounded-full bg-[#D14B3D]" />
            Live
          </div>

          <h2 className="mt-5 text-[16px] font-medium  leading-9 text-[#1D1D1D]">
            {classroomProgram.liveSession.title}
          </h2>

          <div className="mt-3 flex items-center gap-5 text-[16px] text-[#6B7280]">
            <div className="flex items-center gap-2">
              <Clock3 size={12} />
              <span className="text-[12px]">
                {classroomProgram.liveSession.time}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <CalendarDays size={12} />
              <span className="text-[12px]">
                {classroomProgram.liveSession.date}
              </span>
            </div>
          </div>

          <div className="mt-10 flex justify-end">
            <Link
              href={`/courses/${classroomProgram.liveSession.courseId}`}
              className="inline-flex items-center gap-2 rounded-full bg-[#4E845F] px-4 py-2 text-[12px] font-medium text-white transition hover:bg-[#3D6E4D]"
            >
              Join Session
              <ChevronRight size={16} />
            </Link>
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
