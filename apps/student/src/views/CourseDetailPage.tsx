"use client";

import { useCourse } from "@ssu/queries";
import { AlertBanner, PageHeader, ProgressBar, Skeleton } from "@ssu/ui";
import Link from "next/link";
import { useParams } from "next/navigation";

export function CourseDetailPage() {
  const params = useParams();
  const id = typeof params.id === "string" ? params.id : "";
  const q = useCourse(id);

  if (q.isLoading) return <Skeleton className="h-40 w-full rounded-xl" />;
  if (q.isError || !q.data)
    return <AlertBanner variant="error">Course not found.</AlertBanner>;

  const c = q.data;
  return (
    <div className="space-y-6">
      <PageHeader
        title={c.title}
        breadcrumbs={[
          { label: "Courses", href: "/courses" },
          { label: c.title },
        ]}
        action={
          <Link
            href="/courses"
            className="text-small font-medium text-brand-green hover:underline"
          >
            Back
          </Link>
        }
      />
      <div className="rounded-xl border bg-white p-6 shadow-card space-y-4">
        <p className="text-body text-neutral-600">Trainer: {c.trainerName}</p>
        <ProgressBar value={c.progressPercent} showLabel />
      </div>
    </div>
  );
}
