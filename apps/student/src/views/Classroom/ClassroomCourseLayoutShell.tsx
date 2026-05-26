"use client";

import { cn } from "@ssu/utils";
import { CheckCircle2, ChevronDown, ChevronLeft, Circle } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { useMemo, useState } from "react";

import type {
  ClassroomCourseDetail,
  ClassroomWeek,
} from "@/lib/classroom-data";

interface ClassroomCourseLayoutShellProps {
  course: ClassroomCourseDetail;
  weeks: ClassroomWeek[];
  children: ReactNode;
}

export function ClassroomCourseLayoutShell({
  course,
  weeks,
  children,
}: ClassroomCourseLayoutShellProps) {
  const pathname = usePathname();
  const [openWeeks, setOpenWeeks] = useState(
    () => new Set(weeks.filter((week) => week.expanded).map((week) => week.id)),
  );

  const tabs = useMemo(
    () => [
      {
        label: "Overview",
        href: `/courses/${course.id}`,
        active: pathname === `/courses/${course.id}`,
      },
      {
        label: "Recording",
        href: `/courses/${course.id}/recording`,
        active: pathname === `/courses/${course.id}/recording`,
      },
      {
        label: "Resources",
        href: `/courses/${course.id}/resources`,
        active: pathname === `/courses/${course.id}/resources`,
      },
    ],
    [course.id, pathname],
  );

  const toggleWeek = (weekId: string) => {
    setOpenWeeks((prev) => {
      const next = new Set(prev);
      if (next.has(weekId)) {
        next.delete(weekId);
      } else {
        next.add(weekId);
      }
      return next;
    });
  };

  return (
    <div className="grid gap-3 xl:grid-cols-[1.9fr_0.78fr]">
      <div className="rounded-[20px] flex flex-col bg-white p-2 md:p-8">
        <Link
          href="/courses"
          className="inline-flex items-center gap-2 text-[15px] font-bold text-[#4E845F] transition hover:opacity-80"
        >
          <ChevronLeft className="h-5 w-5" />
          Back
        </Link>

        <div className="mt-8 inline-flex w-[230px] items-center justify-center rounded-full bg-[#F3F6F8] px-2 py-2 text-[14px] text-[#6B7280]">
          <span className="mr-2 h-3 w-3 rounded-full bg-[#436E53]" />
          {course.sessionLabel}
          <span className="mx-2 text-[#D1D5DB]">|</span>
          {course.sessionDuration}
        </div>
        <div className="mt-4 overflow-hidden rounded-[22px] bg-black">
          <img
            src={course.imageUrl}
            alt={course.title}
            className="h-auto w-full object-cover"
          />
        </div>

        <h1 className="mt-4 text-[22px] font-semibold text-[#1D1D1D] md:text-[24px]">
          Client Communications Essentials
        </h1>

        <div className="mt-6 rounded-[18px] border border-[#ECF0F7] bg-[#FAFBFD] p-3">
          <div className="flex w-[300px] flex-row items-center justify-between bg-[#ECF0F7] p-2 rounded-[12px]">
            {tabs.map((tab) => (
              <Link
                key={tab.href}
                href={tab.href}
                className={cn(
                  "rounded-[9px] px-3 py-1 text-[12px] font-medium transition",
                  tab.active
                    ? "border border-[#D4E2D8] bg-white text-[#4E845F]"
                    : "text-[#2F3540] hover:bg-white",
                )}
              >
                {tab.label}
              </Link>
            ))}
          </div>

          <div className="mt-6">{children}</div>
        </div>
      </div>

      <aside className="rounded-[18px] bg-white p-3 md:p-4">
        <h2 className="text-[15px] font-semibold text-[#1D1D1D] md:text-[15px]">
          {course.title}
        </h2>

        <div className="mt-6 space-y-4">
          {weeks.map((week) => {
            const expanded = openWeeks.has(week.id);

            return (
              <div key={week.id} className="rounded-[6px] bg-[#FAFBFD] p-3">
                <button
                  type="button"
                  onClick={() => toggleWeek(week.id)}
                  className="flex w-full items-start justify-between gap-3 text-left"
                >
                  <div>
                    <p className="text-[12px] font-bold text-[#7A8594]">
                      {week.label}
                    </p>
                    <p className="mt-1 text-[15px] font-medium text-[#1D1D1D]">
                      {week.topic}
                    </p>
                  </div>

                  <ChevronDown
                    className={cn(
                      "mt-1 h-5 w-5 shrink-0 text-[#2F3540] transition-transform",
                      expanded && "rotate-180",
                    )}
                  />
                </button>

                {expanded && week.lessons.length > 0 && (
                  <div className="mt-5 space-y-5">
                    {week.lessons.map((lesson) => (
                      <div key={lesson.id} className="flex items-start gap-3">
                        <div className="pt-1">
                          {lesson.completed ? (
                            <CheckCircle2 className="h-5 w-5 fill-[#4E845F] text-white" />
                          ) : (
                            <Circle className="h-5 w-5 text-[#C5D2E1]" />
                          )}
                        </div>

                        <div>
                          <p className="text-[14px] font-medium text-[#1D1D1D]">
                            {lesson.title}
                          </p>
                          <p className="mt-1 text-[12px] text-[#6B7280]">
                            {lesson.subtitle}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </aside>
    </div>
  );
}
