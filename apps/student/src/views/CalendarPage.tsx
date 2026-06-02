"use client";

import { DashboardEmptyState, PageHeader } from "@ssu/ui";
import { CalendarDays } from "lucide-react";

export function CalendarPage() {
  return (
    <div className="space-y-6">
      <PageHeader title="Calendar" />

      <div className="rounded-2xl border border-neutral-200/80 bg-white shadow-[0_1px_3px_rgba(15,23,42,0.06)]">
        <DashboardEmptyState
          icon={CalendarDays}
          title="Your calendar will appear here"
          description="Soon you will see live classes, assignment due dates, and program milestones in one place so you can plan your week and never miss a session."
          className="py-16"
        />
      </div>
    </div>
  );
}
