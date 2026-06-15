"use client";

import { EmptyState, PageHeader } from "@ssu/ui";
import { BookOpenText } from "lucide-react";

export function AssessmentsPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Assessments"
        breadcrumbs={[{ label: "Admin" }, { label: "Assessments" }]}
      />
      <EmptyState
        icon={BookOpenText}
        title="Assessments (demo)"
        description="Connect your API to list and edit training Assessments here."
      />
    </div>
  );
}
