"use client";

import { useAssignment } from "@ssu/queries";
import { AlertBanner, Badge, PageHeader, Skeleton } from "@ssu/ui";
import { formatDate } from "@ssu/utils";
import Link from "next/link";
import { useParams } from "next/navigation";
import { SubmissionForm } from "../components/SubmissionForm";

export function AssignmentDetailPage() {
  const params = useParams();
  const id = typeof params.id === "string" ? params.id : "";
  const q = useAssignment(id);

  if (q.isLoading) return <Skeleton className="h-40 w-full rounded-xl" />;
  if (q.isError || !q.data)
    return <AlertBanner variant="error">Assignment not found.</AlertBanner>;

  const a = q.data;
  const past = new Date(a.dueAt).getTime() < Date.now();

  return (
    <div className="space-y-6">
      <PageHeader
        title={a.title}
        breadcrumbs={[
          { label: "Assignments", href: "/assignments" },
          { label: a.title },
        ]}
        action={
          <Link
            href="/assignments"
            className="text-small text-brand-green hover:underline"
          >
            Back
          </Link>
        }
      />
      <div className="rounded-xl border bg-white p-6 shadow-card space-y-3">
        <p className="text-body text-neutral-700">{a.courseName}</p>
        <p className="text-small text-neutral-500">Due {formatDate(a.dueAt)}</p>
        <Badge variant={a.status === "not-started" ? "not-started" : a.status}>
          {a.status}
        </Badge>
      </div>
      <SubmissionForm
        assignmentId={a.id}
        disabled={past && a.status !== "overdue"}
      />
    </div>
  );
}
