"use client";

import type { Cohort } from "../types";
import { cn } from "@ssu/utils";
import { formatCourseListDate } from "../lib/course-utils";

interface CourseCohortsTabProps {
  cohorts: Cohort[];
}

function cohortStatus(
  startDate: string,
  endDate: string,
): {
  label: string;
  className: string;
} {
  const now = Date.now();
  const start = new Date(startDate).getTime();
  const end = new Date(endDate).getTime();

  if (Number.isNaN(start) || Number.isNaN(end)) {
    return { label: "Upcoming", className: "bg-[#E0F2FE] text-[#0369A1]" };
  }
  if (now > end) {
    return { label: "Completed", className: "bg-[#DBF1DC] text-[#1F6E2A]" };
  }
  if (now >= start) {
    return { label: "In progress", className: "bg-[#FFF4E5] text-[#B45309]" };
  }
  return { label: "Upcoming", className: "bg-[#E0F2FE] text-[#0369A1]" };
}

export function CourseCohortsTab({ cohorts }: CourseCohortsTabProps) {
  if (cohorts.length === 0) {
    return (
      <div className="flex min-h-[280px] items-center justify-center text-[14px] text-[#94A3B8]">
        No cohorts have been added to this course yet.
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-[18px] border border-[#EEF2F6]">
      <table className="w-full text-left">
        <thead className="bg-[#F7F9FB] text-[13px] text-[#6B7280]">
          <tr>
            <th className="px-5 py-3 font-medium">Name</th>
            <th className="px-5 py-3 font-medium">Status</th>
            <th className="px-5 py-3 font-medium">Start date</th>
            <th className="px-5 py-3 font-medium">End date</th>
          </tr>
        </thead>
        <tbody>
          {cohorts.map((cohort) => {
            const status = cohortStatus(cohort.startDate, cohort.endDate);
            return (
              <tr
                key={cohort.id}
                className="border-t border-[#EEF2F6] text-[14px] text-[#1D1D1D]"
              >
                <td className="px-5 py-4 font-medium">{cohort.name}</td>
                <td className="px-5 py-4">
                  <span
                    className={cn(
                      "rounded-full px-3 py-1 text-xs font-medium",
                      status.className,
                    )}
                  >
                    {status.label}
                  </span>
                </td>
                <td className="px-5 py-4 text-[#6B7280]">
                  {formatCourseListDate(cohort.startDate)}
                </td>
                <td className="px-5 py-4 text-[#6B7280]">
                  {formatCourseListDate(cohort.endDate)}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
