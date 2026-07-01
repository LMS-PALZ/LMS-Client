"use client";

import { BookOpen } from "lucide-react";
import type { ProgramClassroomModule } from "@ssu/types";

interface CourseModuleRowProps {
  module: ProgramClassroomModule;
  index: number;
}

function formatModuleType(value?: string): string {
  if (!value) return "Module";
  return value
    .replace(/_/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

export function CourseModuleRow({ module, index }: CourseModuleRowProps) {
  const lessonLabel =
    module.lessonCount === 1 ? "1 lesson" : `${module.lessonCount} lessons`;

  return (
    <div className="flex items-start gap-3 rounded-[12px] border border-[#EEF2F6] bg-white px-4 py-3">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#E8F3EC] text-[#4C7D5B]">
        <BookOpen className="h-4 w-4" aria-hidden />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-[12px] font-medium uppercase tracking-wide text-[#94A3B8]">
          {module.weekLabel || `Module ${index + 1}`}
        </p>
        <p className="mt-0.5 text-[14px] font-semibold text-[#1D1D1D]">
          {module.title}
        </p>
        {module.description && (
          <p className="mt-1 line-clamp-2 text-[13px] text-[#6B7280]">
            {module.description}
          </p>
        )}
        <p className="mt-2 text-[12px] text-[#94A3B8]">
          {formatModuleType(module.moduleType)} · {lessonLabel}
        </p>
      </div>
    </div>
  );
}
