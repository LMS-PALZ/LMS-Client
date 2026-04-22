"use client";

import { SubmissionInbox } from "../components/SubmissionInbox";
import { PageHeader } from "@ssu/ui";

export function AssignmentsPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Assignments"
        breadcrumbs={[{ label: "Tutor" }, { label: "Assignments" }]}
      />
      <SubmissionInbox />
    </div>
  );
}
