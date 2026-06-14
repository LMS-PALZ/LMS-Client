"use client";

import { EmptyState, PageHeader } from "@ssu/ui";
import { Calendar } from "lucide-react";

export function CalenderPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Calender"
        breadcrumbs={[{ label: "Admin" }, { label: "Calender" }]}
      />
      <EmptyState
        icon={Calendar}
        title="Calender (demo)"
        description="Connect your API to list and edit training Calender here."
      />
    </div>
  );
}
