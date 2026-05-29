"use client";

import { PageHeader } from "@ssu/ui";
import dynamic from "next/dynamic";

const ScheduleCalendar = dynamic(
  () => import("./SchedulePage").then((m) => m.ScheduleCalendar),
  {
    ssr: false,
    loading: () => <p className="text-neutral-500">Loading calendar…</p>,
  },
);

export function CalendarPage() {
  return (
    <div className="space-y-6">
      <PageHeader title="Calendar" />
      <p className="text-body text-neutral-600 -mt-4">
        Your upcoming classes and events.
      </p>
      <ScheduleCalendar />
    </div>
  );
}
