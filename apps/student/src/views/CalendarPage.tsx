"use client";

import { CalendarLegend } from "@/components/calendar/CalendarLegend";
import { StudentCalendar } from "@/components/calendar/StudentCalendar";
import { getStudentCalendarEvents } from "@/lib/calendar";
import { DashboardEmptyState, PageHeader } from "@ssu/ui";
import { CalendarDays } from "lucide-react";
import { useMemo } from "react";

export function CalendarPage() {
  const events = useMemo(() => getStudentCalendarEvents(), []);
  const hasEvents = events.length > 0;

  if (!hasEvents) {
    return (
      <div className="space-y-6">
        <PageHeader title="Calendar" />
        <div className="rounded-2xl border border-neutral-200/80 bg-white shadow-[0_1px_3px_rgba(15,23,42,0.06)]">
          <DashboardEmptyState
            icon={CalendarDays}
            title="Your calendar will appear here"
            description="When you have live classes, upcoming sessions, and assignment due dates, they will show up here so you can plan your week and never miss a session."
            className="py-16"
          />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader title="Calendar" />
      <p className="-mt-2 text-[14px] leading-relaxed text-neutral-600 sm:text-[15px]">
        Live classes, upcoming and past sessions, and assignment due dates for
        your program. Select an event to open the classroom or assessment.
      </p>

      <CalendarLegend />

      <div className="rounded-2xl border border-neutral-200/80 bg-white p-3 shadow-[0_1px_3px_rgba(15,23,42,0.06)] sm:p-5">
        <StudentCalendar events={events} />
      </div>
    </div>
  );
}
