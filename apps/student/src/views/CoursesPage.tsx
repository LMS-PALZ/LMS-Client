"use client";

import { useEnrolledCourses } from "@ssu/queries";
import { AlertBanner, EmptyState, PageHeader, Skeleton } from "@ssu/ui";
import { BookOpen } from "lucide-react";
import { CourseCard } from "../components/CourseCard";

export function CoursesPage() {
  const q = useEnrolledCourses();
  return (
    <div className="space-y-6">
      <PageHeader
        title="Courses"
        breadcrumbs={[{ label: "Student" }, { label: "Courses" }]}
      />
      {q.isError && (
        <AlertBanner variant="error">Unable to load courses.</AlertBanner>
      )}
      {q.isLoading ? (
        <Skeleton className="h-64 rounded-xl" />
      ) : !q.data?.length ? (
        <EmptyState icon={BookOpen} title="No enrollments" />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {q.data.map((c) => (
            <CourseCard
              key={c.id}
              id={c.id}
              title={c.title}
              trainerName={c.trainerName}
              progressPercent={c.progressPercent}
              bannerUrl={c.bannerUrl}
            />
          ))}
        </div>
      )}
    </div>
  );
}
