"use client";

import { useCourse } from "@ssu/queries";
import {
  AlertBanner,
  Button,
  PageHeader,
  ProgressBar,
  DetailPageSkeleton,
} from "@ssu/ui";
import Link from "next/link";
import { useParams } from "next/navigation";

export function CourseDetailPage() {
  const params = useParams();
  const id = typeof params.id === "string" ? params.id : "";
  const q = useCourse(id);
  if (q.isLoading) return <DetailPageSkeleton />;
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
          <Button variant="secondary" size="sm" asChild>
            <Link href={`/courses/${id}/edit`}>Edit</Link>
          </Button>
        }
      />
      <div className="rounded-xl border bg-white p-6 shadow-card">
        <ProgressBar value={c.progressPercent} showLabel />
      </div>
    </div>
  );
}
