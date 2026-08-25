"use client";

import { CalendarLegend } from "@/components/calendar/CalendarLegend";
import { StudentCalendar } from "@/components/calendar/StudentCalendar";
import { useStudentCalendar } from "@/lib/calendar";
import { DashboardEmptyState, PageHeader, Skeleton } from "@ssu/ui";
import { CalendarDays } from "lucide-react";

function CalendarLoadingState() {
  return (
    <div className="space-y-6">
      <PageHeader title="Calendar" />
      <Skeleton className="h-4 w-full max-w-xl rounded-md" />
      <div className="flex flex-wrap gap-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <Skeleton key={index} className="h-4 w-28 rounded-md" />
        ))}
      </div>
      <div className="rounded-2xl border border-neutral-200/80 bg-white p-5 shadow-[0_1px_3px_rgba(15,23,42,0.06)]">
        <Skeleton className="h-[480px] w-full rounded-xl" />
      </div>
    </div>
  );
}

export function CalendarPage() {
  const { events, isLoading, isError, hasEnrollment } = useStudentCalendar();

  if (isLoading) {
    return <CalendarLoadingState />;
  }

  if (!hasEnrollment || events.length === 0) {
    return (
      <div className="space-y-6">
        <PageHeader title="Calendar" />
        <div className="rounded-2xl border border-neutral-200/80 bg-white shadow-[0_1px_3px_rgba(15,23,42,0.06)]">
          <DashboardEmptyState
            icon={CalendarDays}
            title="Your calendar will appear here"
            description={
              isError
                ? "We couldn't load your schedule right now. Please refresh and try again."
                : "When you have live classes, upcoming sessions, and assignment due dates, they will show up here so you can plan your week and never miss a session."
            }
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
        your program. Click a live class to join, or open a past session for
        recordings and resources.
      </p>

      <CalendarLegend />

      <div className="rounded-2xl border border-neutral-200/80 bg-white p-3 shadow-[0_1px_3px_rgba(15,23,42,0.06)] sm:p-5">
        <StudentCalendar events={events} />
      </div>
    </div>
  );
}
