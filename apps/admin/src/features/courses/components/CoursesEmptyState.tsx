"use client";

import { NotebookPen } from "lucide-react";
import { AddItemLink } from "./AddItemLink";

interface CoursesEmptyStateProps {
  onAddCourse?: () => void;
  variant?: "admin" | "tutor";
}

export function CoursesEmptyState({
  onAddCourse,
  variant = "admin",
}: CoursesEmptyStateProps) {
  const isTutor = variant === "tutor";

  return (
    <div className="flex min-h-[420px] flex-col items-center justify-center rounded-[18px] bg-[#F7F9FB] px-6 py-16 text-center">
      <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#E8F3EC]">
        <NotebookPen className="h-7 w-7 text-[#94A3B8]" aria-hidden />
      </div>
      <h2 className="text-[16px] font-semibold text-[#1D1D1D]">
        {isTutor ? "No courses assigned yet" : "You haven't added a course yet"}
      </h2>
      <p className="mt-2 max-w-sm text-[14px] text-[#94A3B8]">
        {isTutor
          ? "When an admin assigns you to a course, it will show up here."
          : "When you do, they'll show up here"}
      </p>
      {onAddCourse ? (
        <div className="mt-6">
          <AddItemLink label="Add a course" onClick={onAddCourse} />
        </div>
      ) : null}
    </div>
  );
}
