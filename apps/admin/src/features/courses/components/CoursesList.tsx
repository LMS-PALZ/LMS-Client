"use client";

import { useRouter } from "next/navigation";
import { adminPath } from "@ssu/config/portal-paths";
import { cn } from "@ssu/utils";
import type { Course } from "../types";
import { formatCourseListDate, formatCourseStatus } from "../lib/course-utils";

interface CoursesListProps {
  courses: Course[];
}

export function CoursesList({ courses }: CoursesListProps) {
  const router = useRouter();

  return (
    <div className="overflow-hidden rounded-[18px] border border-[#EEF2F6]">
      <table className="w-full text-left">
        <thead className="bg-[#F7F9FB] text-[13px] text-[#6B7280]">
          <tr>
            <th className="px-5 py-3 font-medium">Course name</th>
            <th className="px-5 py-3 font-medium">Status</th>
            <th className="px-5 py-3 font-medium">Price</th>
            <th className="px-5 py-3 font-medium">Date updated</th>
            <th className="px-5 py-3 font-medium">Date added</th>
          </tr>
        </thead>
        <tbody>
          {courses.map((course) => (
            <tr
              key={course.id}
              onClick={() => router.push(adminPath(`/courses/${course.id}`))}
              className="cursor-pointer border-t border-[#EEF2F6] text-[14px] text-[#1D1D1D] transition hover:bg-[#F7F9FB]"
            >
              <td className="px-5 py-4 font-medium">{course.name}</td>
              <td className="px-5 py-4">
                <span
                  className={cn(
                    "rounded-full px-3 py-1 text-xs font-medium",
                    course.status === "published"
                      ? "bg-[#DBF1DC] text-[#1F6E2A]"
                      : "bg-[#FFF4E5] text-[#B45309]",
                  )}
                >
                  {formatCourseStatus(course.status)}
                </span>
              </td>
              <td className="px-5 py-4 text-[#6B7280]">{course.price}</td>
              <td className="px-5 py-4 text-[#6B7280]">
                {formatCourseListDate(course.updatedAt)}
              </td>
              <td className="px-5 py-4 text-[#6B7280]">
                {formatCourseListDate(course.createdAt)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
