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
  ClassroomLesson,
} from "@/lib/classroom-data";

interface ClassroomCourseLayoutShellProps {
  course: ClassroomCourseDetail;
  weeks: ClassroomWeek[];
  children: ReactNode;
  backHref?: string;
  /** Live class view at /classroom/:sessionId — no course tabs */
  showLiveSession?: boolean;
  meetUrl?: string;
  isLive?: boolean;
}

export function ClassroomCourseLayoutShell({
  course,
  weeks,
  children,
  backHref = "/classroom",
  showLiveSession = false,
  meetUrl,
  isLive = false,
}: ClassroomCourseLayoutShellProps) {
  const pathname = usePathname();

  const [openWeeks, setOpenWeeks] = useState(
    () => new Set(weeks.filter((week) => week.expanded).map((week) => week.id)),
  );

  const [selectedLesson, setSelectedLesson] = useState<ClassroomLesson | null>(
    null,
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

  const showTabs = !showLiveSession;

  return (
    <div className="grid gap-3 xl:grid-cols-[1.9fr_0.78fr]">
      <div className="flex flex-col rounded-[20px] bg-white p-2 md:p-8">
        {selectedLesson ? (
          <>
            <button
              type="button"
              onClick={() => setSelectedLesson(null)}
              className="inline-flex items-center gap-2 text-[15px] font-bold text-[#4E845F] transition hover:opacity-80"
            >
              <ChevronLeft className="h-5 w-5" />
              Back
            </button>

            <div className="mt-8">
              <p className="text-[12px] font-medium text-[#7A8594]">Lesson</p>
              <h1 className="mt-2 text-[22px] font-semibold text-[#1D1D1D] md:text-[24px]">
                {selectedLesson.title}
              </h1>
              {selectedLesson.subtitle && (
                <p className="mt-2 text-[15px] text-[#6B7280]">
                  {selectedLesson.subtitle}
                </p>
              )}
              {selectedLesson.description && (
                <div className="mt-6 rounded-[18px] border border-[#ECF0F7] bg-[#FAFBFD] p-5">
                  <p className="text-[15px] leading-7 text-[#495057]">
                    {selectedLesson.description}
                  </p>
                </div>
              )}
              {selectedLesson.content && (
                <div className="mt-4">{selectedLesson.content}</div>
              )}
            </div>
          </>
        ) : (
          <>
            <Link
              href={backHref}
              className="inline-flex items-center gap-2 text-[15px] font-bold text-[#4E845F] transition hover:opacity-80"
            >
              <ChevronLeft className="h-5 w-5" />
              Back
            </Link>

            <div className="mt-8 inline-flex w-fit max-w-full items-center justify-center rounded-full bg-[#F3F6F8] px-3 py-2 text-[14px] text-[#6B7280]">
              <span
                className={cn(
                  "mr-2 h-3 w-3 rounded-full",
                  isLive ? "bg-[#D14B3D]" : "bg-[#436E53]",
                )}
              />
              {isLive ? "LIVE SESSION" : course.sessionLabel}
              <span className="mx-2 text-[#D1D5DB]">|</span>
              {course.sessionDuration}
            </div>

            <div className="relative mt-4 overflow-hidden rounded-[22px] bg-[#1a1a1a]">
              <img
                src={course.imageUrl}
                alt={course.title}
                className="h-auto min-h-[220px] w-full object-cover opacity-90"
              />
              {showLiveSession && isLive && meetUrl && (
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-black/40 p-6">
                  <a
                    href={meetUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-full bg-[#4E845F] px-6 py-3 text-[14px] font-semibold text-white shadow-lg transition hover:bg-[#3D6E4D]"
                  >
                    Join class on Google Meet
                  </a>
                  <p className="text-center text-[13px] text-white/90">
                    Opens Google Meet in a new tab
                  </p>
                </div>
              )}
            </div>

            <h1 className="mt-4 text-[22px] font-semibold text-[#1D1D1D] md:text-[24px]">
              {course.title}
            </h1>

            {showTabs ? (
              <div className="mt-6 rounded-[18px] border border-[#ECF0F7] bg-[#FAFBFD] p-3">
                <div className="flex w-full max-w-[300px] flex-row items-center justify-between rounded-[12px] bg-[#ECF0F7] p-2">
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
            ) : (
              <div className="mt-6 rounded-[18px] border border-[#ECF0F7] bg-[#FAFBFD] p-5">
                {children}
              </div>
            )}
          </>
        )}
      </div>

      <aside className="rounded-[18px] bg-white p-3 md:p-4">
        <h2 className="text-[15px] font-semibold text-[#1D1D1D]">
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
                      <button
                        key={lesson.id}
                        type="button"
                        onClick={() => setSelectedLesson(lesson)}
                        className="flex w-full items-start gap-3 text-left transition hover:opacity-80"
                      >
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
                      </button>
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
