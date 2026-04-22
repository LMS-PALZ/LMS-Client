"use client";

import { GradeForm } from "../components/GradeForm";
import { PageHeader } from "@ssu/ui";
import { useParams } from "next/navigation";

export function SubmissionsPage() {
  const params = useParams();
  const id = typeof params.id === "string" ? params.id : "";
  return (
    <div className="space-y-6">
      <PageHeader
        title={`Assignment ${id} — Submissions`}
        breadcrumbs={[
          { label: "Assignments", href: "/assignments" },
          { label: "Submissions" },
        ]}
      />
      <GradeForm />
    </div>
  );
}
