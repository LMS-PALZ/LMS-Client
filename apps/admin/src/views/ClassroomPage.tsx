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
        title="Nothing here yet"
        description="Check back later."
      />
    </div>
  );
}
