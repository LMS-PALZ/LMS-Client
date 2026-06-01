"use client";

import { tutorPath } from "@ssu/config/portal-paths";
import { useEnrolledCourses } from "@ssu/queries";
import { AlertBanner, CardSkeleton, PageHeader, StatCard } from "@ssu/ui";
import { BookOpen, ClipboardList, Users, Video } from "lucide-react";
import Link from "next/link";

export function HomePage() {
  const q = useEnrolledCourses();
  return (
    <div className="space-y-8">
      <PageHeader title="Your Dashboard" />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Courses published"
          value={q.data?.length ?? 0}
          icon={BookOpen}
        />
        <StatCard
          label="Active students"
          value={48}
          icon={Users}
          accent="amber"
        />
        <StatCard label="Sessions this week" value={3} icon={Video} />
        <StatCard
          label="Pending reviews"
          value={5}
          icon={ClipboardList}
          accent="amber"
        />
      </div>
      {q.isError && (
        <AlertBanner variant="error">Could not load courses.</AlertBanner>
      )}
      <div className="rounded-xl border bg-white p-4 shadow-card">
        <h2 className="text-h3 text-neutral-900 mb-3">Quick links</h2>
        <div className="flex flex-wrap gap-2">
          <Link
            href={tutorPath("/courses/new")}
            className="text-small font-medium text-brand-green hover:underline"
          >
            New course
          </Link>
          <span className="text-neutral-300">|</span>
          <Link
            href={tutorPath("/assignments")}
            className="text-small font-medium text-brand-green hover:underline"
          >
            Submissions
          </Link>
        </div>
        {q.isLoading ? (
          <div className="mt-4 space-y-2">
            <CardSkeleton lines={1} className="min-h-[48px]" />
            <CardSkeleton lines={1} className="min-h-[48px]" />
            <CardSkeleton lines={1} className="min-h-[48px]" />
          </div>
        ) : (
          <ul className="mt-4 space-y-2">
            {(q.data ?? []).map((c) => (
              <li key={c.id} className="text-body text-neutral-800">
                {c.title}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
