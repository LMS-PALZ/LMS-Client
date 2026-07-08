"use client";

import { AdminCalendar } from "@/components/calendar/AdminCalendar";
import { AdminCalendarLegend } from "@/components/calendar/AdminCalendarLegend";
import { useAdminCalendar } from "@ssu/queries";
import { DashboardEmptyState, PageHeader, Skeleton } from "@ssu/ui";
import { CalendarDays } from "lucide-react";
import { useMemo } from "react";

function CalendarLoadingState() {
  return (
    <div className="space-y-6">
      <PageHeader title="Calendar" />
      <Skeleton className="h-4 w-full max-w-xl rounded-md" />
      <div className="flex flex-wrap gap-4">
        {Array.from({ length: 3 }).map((_, index) => (
          <Skeleton key={index} className="h-4 w-28 rounded-md" />
        ))}
      </div>
      <div className="rounded-2xl border border-neutral-200/80 bg-white p-5 shadow-[0_1px_3px_rgba(15,23,42,0.06)]">
        <Skeleton className="h-[560px] w-full rounded-xl" />
      </div>
    </div>
  );
}

function formatTimeRange(start: string, end: string) {
  const startDate = new Date(start);
  const endDate = new Date(end);
  if (Number.isNaN(startDate.getTime())) return "—";

  const time = (date: Date) =>
    date.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });

  return `${time(startDate)} – ${time(endDate)}`;
}

export function CalenderPage() {
  const { data, isLoading, isError } = useAdminCalendar();

  const todayEvents = useMemo(() => {
    if (!data?.events.length) return [];

    const now = new Date();
    const dayStart = new Date(now);
    dayStart.setHours(0, 0, 0, 0);
    const dayEnd = new Date(now);
    dayEnd.setHours(23, 59, 59, 999);

    return data.events.filter((event) => {
      const start = new Date(event.start).getTime();
      const end = new Date(event.end).getTime();
      return start < dayEnd.getTime() && end >= dayStart.getTime();
    });
  }, [data?.events]);

  if (isLoading) {
    return <CalendarLoadingState />;
  }

  if (!data?.events.length) {
    return (
      <div className="space-y-6">
        <PageHeader title="Calendar" />
        <div className="rounded-2xl border border-neutral-200/80 bg-white shadow-[0_1px_3px_rgba(15,23,42,0.06)]">
          <DashboardEmptyState
            icon={CalendarDays}
            title="No classes scheduled yet"
            description={
              isError
                ? "We couldn't load the schedule right now. Please refresh and try again."
                : "When live sessions are scheduled across your courses, they will appear here so you can follow up with students and tutors."
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
        All live classes across every course and cohort. Week view is the
        default so you can see what is happening across the week and follow up
        with students and tutors. Click a class to open the course.
      </p>

      <AdminCalendarLegend />

      {todayEvents.length > 0 ? (
        <section className="rounded-2xl border border-neutral-200/80 bg-white p-5 shadow-[0_1px_3px_rgba(15,23,42,0.06)]">
          <h2 className="text-[16px] font-semibold text-[#1D1D1D]">
            Today&apos;s classes ({todayEvents.length})
          </h2>
          <ul className="mt-4 space-y-3">
            {todayEvents.map((event) => (
              <li
                key={event.id}
                className="flex flex-col gap-1 rounded-[14px] border border-[#EEF2F6] px-4 py-3 sm:flex-row sm:items-center sm:justify-between"
              >
                <div>
                  <p className="text-[14px] font-medium text-[#1D1D1D]">
                    {event.lessonTitle}
                  </p>
                  <p className="text-[13px] text-[#6B7280]">
                    {event.programTitle}
                    {event.cohortName ? ` · ${event.cohortName}` : ""}
                    {event.moduleTitle ? ` · ${event.moduleTitle}` : ""}
                  </p>
                </div>
                <div className="text-[13px] text-[#6B7280]">
                  {formatTimeRange(event.start, event.end)}
                  {event.tutorCount > 0
                    ? ` · ${event.tutorCount} tutor${event.tutorCount === 1 ? "" : "s"} assigned`
                    : " · No tutor assigned"}
                </div>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      <div className="rounded-2xl border border-neutral-200/80 bg-white p-3 shadow-[0_1px_3px_rgba(15,23,42,0.06)] sm:p-5">
        <AdminCalendar events={data.events} />
      </div>
    </div>
  );
}
