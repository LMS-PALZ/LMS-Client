"use client";

import { EmptyState, PageHeader } from "@ssu/ui";
import { BookOpen } from "lucide-react";

export function ProgramsPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Programs"
        breadcrumbs={[{ label: "Admin" }, { label: "Programs" }]}
      />
      <EmptyState
        icon={BookOpen}
        title="Nothing here yet"
        description="Check back later."
      />
    </div>
  );
}
