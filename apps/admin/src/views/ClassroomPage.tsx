"use client";

import { EmptyState, PageHeader } from "@ssu/ui";
import { School } from "lucide-react";

export function ClassroomPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Classroom"
        breadcrumbs={[{ label: "Admin" }, { label: "Classroom" }]}
      />
      <EmptyState
        icon={School}
        title="Classroom (demo)"
        description="Connect your API to list and edit training Classroom here."
      />
    </div>
  );
}
