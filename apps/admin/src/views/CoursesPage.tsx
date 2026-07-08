"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { adminPath } from "@ssu/config/portal-paths";
import { useAdminPrograms } from "@ssu/queries";
import { AlertBanner, Button } from "@ssu/ui";
import {
  CoursesEmptyState,
  CoursesList,
  CoursesToolbar,
} from "@/features/courses/components";
import { AdminCoursesPageSkeleton } from "@/components/skeletons";
import { mapProgramToCourse } from "@/features/courses/lib/program-mappers";
import type { Course } from "@/features/courses/types";

function filterCourses(
  courses: Course[],
  search: string,
  statusFilter: string,
): Course[] {
  const query = search.trim().toLowerCase();

  return courses.filter((course) => {
    const matchesSearch =
      !query ||
      course.name.toLowerCase().includes(query) ||
      course.description.toLowerCase().includes(query);

    const matchesStatus =
      statusFilter === "All statuses" ||
      course.status.toLowerCase() === statusFilter.toLowerCase();

    return matchesSearch && matchesStatus;
  });
}

export function CoursesPage() {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All statuses");

  const { data, isLoading, isError, error } = useAdminPrograms({
    page: 1,
    limit: 100,
    search,
    status: statusFilter,
  });

  const courses = useMemo(
    () => (data?.items ?? []).map(mapProgramToCourse),
    [data?.items],
  );

  const filteredCourses = useMemo(
    () => filterCourses(courses, search, statusFilter),
    [courses, search, statusFilter],
  );

  const goToBuilder = () => {
    router.push(adminPath("/courses/builder"));
  };

  if (isLoading && !data) {
    return <AdminCoursesPageSkeleton />;
  }

  return (
    <section className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <h1 className="text-[24px] font-semibold text-[#1D1D1D]">Courses</h1>
        <Button
          type="button"
          onClick={goToBuilder}
          className="h-11 rounded-full bg-[#4C7D5B] px-6 text-[14px] font-medium text-white hover:bg-[#3d6549]"
        >
          + Add course
        </Button>
      </div>

      {isError && (
        <AlertBanner variant="error">
          {error instanceof Error ? error.message : "Failed to load courses."}
        </AlertBanner>
      )}

      <CoursesToolbar
        count={filteredCourses.length}
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
        search={search}
        onSearchChange={setSearch}
      />

      {courses.length === 0 ? (
        <CoursesEmptyState onAddCourse={goToBuilder} />
      ) : filteredCourses.length === 0 ? (
        <div className="flex min-h-[320px] items-center justify-center rounded-[18px] bg-[#F7F9FB] px-6 text-center text-[14px] text-[#94A3B8]">
          No courses match your search or filter.
        </div>
      ) : (
        <CoursesList courses={filteredCourses} />
      )}
    </section>
  );
}
