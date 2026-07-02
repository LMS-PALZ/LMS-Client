"use client";

import Link from "next/link";
import { BookCopy, GraduationCap } from "lucide-react";

interface Module {
  id: string;
  title: string;
  weekLabel?: string;
  lessons?: {
    id: string;
    title: string;
  }[];
}

export function ClassroomCourseCard({ course }: { course: Module }) {
  return (
    <Link
      href={`/courses/${course.id}`}
      className="overflow-hidden rounded-[18px] border border-[#EEF2F6] bg-white transition hover:-translate-y-0.5 hover:shadow-[0_20px_40px_rgba(15,23,42,0.08)]"
    >
      <div className="flex h-[128px] items-center justify-center bg-[#E2E8F0]">
        <img
          src="/firstlogo.png"
          alt="Skill Scale Up"
          className="h-[76px] w-auto object-contain"
        />
      </div>

      <div className="space-y-3 px-4 py-2">
        <h3 className="text-[14px] font-medium leading-5 text-[#1D1D1D]">
          {course?.title}
        </h3>

        <div className="space-y-2 text-[12px] text-[#7A8594]">
          <div className="flex items-center gap-2">
            <div className="flex h-5 w-5 items-center justify-center rounded-full bg-[#FFF4E8] text-[#F39A2E]">
              <GraduationCap className="h-3.5 w-3.5" />
            </div>
            <span>{course?.lessons?.[0]?.title}</span>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex h-5 w-5 items-center justify-center rounded-full bg-[#FFF4E8] text-[#F39A2E]">
              <BookCopy className="h-3.5 w-3.5" />
            </div>
            <span>
              {course?.lessons?.length}{" "}
              {course?.lessons?.length === 1 ? "Lesson" : "Lessons"}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
