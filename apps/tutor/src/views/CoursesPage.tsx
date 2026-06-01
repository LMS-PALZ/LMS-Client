"use client";

import { useEnrolledCourses } from "@ssu/queries";
import {
  AlertBanner,
  Button,
  CourseCardSkeleton,
  EmptyState,
  GridSkeleton,
  PageHeader,
} from "@ssu/ui";
import { BookOpen } from "lucide-react";
import { tutorPath } from "@ssu/config/portal-paths";
import Link from "next/link";

export function CoursesPage() {
  const q = useEnrolledCourses();
  return (
    <div className="space-y-6">
      <PageHeader
        title="Courses"
        breadcrumbs={[{ label: "Tutor" }, { label: "Courses" }]}
        action={
          <Button asChild variant="primary" size="sm">
            <Link href={tutorPath("/courses/new")}>New course</Link>
          </Button>
        }
      />
      {q.isError && (
        <AlertBanner variant="error">Unable to load courses.</AlertBanner>
      )}
      {q.isLoading ? (
        <GridSkeleton
          count={6}
          columnsClassName="sm:grid-cols-2 lg:grid-cols-3"
        >
          <CourseCardSkeleton />
        </GridSkeleton>
      ) : !q.data?.length ? (
        <EmptyState
          icon={BookOpen}
          title="No courses yet"
          action={
            <Button asChild variant="primary">
              <Link href={tutorPath("/courses/new")}>Create course</Link>
            </Button>
          }
        />
      ) : (
        <ul className="space-y-2">
          {q.data.map((c) => (
            <li
              key={c.id}
              className="flex justify-between rounded-xl border bg-white p-4 shadow-card"
            >
              <span className="text-h4 text-neutral-900">{c.title}</span>
              <div className="flex gap-2">
                <Button variant="secondary" size="sm" asChild>
                  <Link href={`/courses/${c.id}`}>View</Link>
                </Button>
                <Button variant="ghost" size="sm" asChild>
                  <Link href={`/courses/${c.id}/edit`}>Edit</Link>
                </Button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
