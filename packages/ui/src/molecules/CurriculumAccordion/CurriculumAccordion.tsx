"use client";

import { cn } from "@ssu/utils";
import { CheckCircle2, ChevronDown, Circle } from "lucide-react";
import { useState } from "react";
export interface CurriculumLessonItem {
  id: string;
  title: string;
  type: "live" | "recorded" | "reading";
  scheduledAt?: string;
  completed: boolean;
  sessionId?: string;
}

export interface CurriculumWeekItem {
  id: string;
  title: string;
  subtitle?: string;
  lessons: CurriculumLessonItem[];
}

export interface CurriculumAccordionProps {
  weeks: CurriculumWeekItem[];
  className?: string;
  onLessonClick?: (lesson: CurriculumLessonItem) => void;
}

export function CurriculumAccordion({
  weeks,
  className,
  onLessonClick,
}: CurriculumAccordionProps) {
  const [expanded, setExpanded] = useState<Record<string, boolean>>(() =>
    Object.fromEntries(weeks.map((w, i) => [w.id, i === 0])),
  );

  return (
    <div className={cn("space-y-2", className)}>
      {weeks.map((week) => {
        const open = expanded[week.id];
        return (
          <section
            key={week.id}
            className="rounded-xl border bg-white overflow-hidden"
          >
            <button
              type="button"
              onClick={() =>
                setExpanded((e) => ({ ...e, [week.id]: !e[week.id] }))
              }
              className="flex w-full items-center justify-between gap-2 px-4 py-3 text-left hover:bg-neutral-50"
            >
              <div>
                <p className="text-small font-semibold text-neutral-900">
                  {week.title}
                </p>
                {week.subtitle && (
                  <p className="text-micro text-neutral-500">{week.subtitle}</p>
                )}
              </div>
              <ChevronDown
                className={cn(
                  "h-5 w-5 text-neutral-400 transition-transform",
                  open && "rotate-180",
                )}
              />
            </button>
            {open && (
              <ul className="border-t px-2 py-2 space-y-1">
                {week.lessons.map((lesson) => (
                  <li key={lesson.id}>
                    <button
                      type="button"
                      onClick={() => onLessonClick?.(lesson)}
                      className="flex w-full items-start gap-2 rounded-lg px-2 py-2 text-left hover:bg-neutral-50"
                    >
                      {lesson.completed ? (
                        <CheckCircle2 className="h-5 w-5 shrink-0 text-brand-green mt-0.5" />
                      ) : (
                        <Circle className="h-5 w-5 shrink-0 text-neutral-300 mt-0.5" />
                      )}
                      <span className="text-micro text-neutral-700">
                        <span className="font-medium">{lesson.title}</span>
                        {lesson.scheduledAt && (
                          <span className="text-neutral-500">
                            {" "}
                            |{" "}
                            {lesson.type === "live"
                              ? "Live Session"
                              : "Reading"}{" "}
                            - {lesson.scheduledAt}
                          </span>
                        )}
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </section>
        );
      })}
    </div>
  );
}
