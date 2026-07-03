"use client";

import type { EventClickArg, DatesSetArg } from "@fullcalendar/core";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import FullCalendar from "@fullcalendar/react";
import timeGridPlugin from "@fullcalendar/timegrid";
import type { AdminCalendarEvent } from "@/lib/calendar/types";
import { useRouter } from "next/navigation";
import { useCallback, useMemo, useState } from "react";
import "./admin-calendar.css";

function overlapsRange(
  event: AdminCalendarEvent,
  start: Date,
  end: Date,
): boolean {
  const eventStart = new Date(event.start).getTime();
  const eventEnd = new Date(event.end).getTime();
  return eventStart < end.getTime() && eventEnd >= start.getTime();
}

export interface AdminCalendarProps {
  events: AdminCalendarEvent[];
  onRangeEmptyChange?: (empty: boolean) => void;
}

export function AdminCalendar({
  events,
  onRangeEmptyChange,
}: AdminCalendarProps) {
  const router = useRouter();
  const [rangeEmpty, setRangeEmpty] = useState(false);

  const calendarEvents = useMemo(
    () =>
      events.map((event) => ({
        id: event.id,
        title: event.title,
        start: event.start,
        end: event.end,
        classNames: ["ssu-cal-event", `ssu-cal-event--${event.sessionPhase}`],
        extendedProps: {
          href: event.href,
          programTitle: event.programTitle,
          cohortName: event.cohortName,
          moduleTitle: event.moduleTitle,
          lessonTitle: event.lessonTitle,
          durationMinutes: event.durationMinutes,
          tutorCount: event.tutorCount,
        },
      })),
    [events],
  );

  const handleEventClick = useCallback(
    (info: EventClickArg) => {
      const href = info.event.extendedProps.href as string | undefined;
      if (href) {
        router.push(href);
      }
    },
    [router],
  );

  const handleDatesSet = useCallback(
    (arg: DatesSetArg) => {
      const visible = events.some((event) =>
        overlapsRange(event, arg.start, arg.end),
      );
      setRangeEmpty(!visible);
      onRangeEmptyChange?.(!visible);
    },
    [events, onRangeEmptyChange],
  );

  return (
    <div className="ssu-calendar">
      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        initialView="timeGridWeek"
        headerToolbar={{
          left: "prev,next today",
          center: "title",
          right: "timeGridWeek,timeGridDay,dayGridMonth",
        }}
        height="auto"
        nowIndicator
        slotMinTime="07:00:00"
        slotMaxTime="22:00:00"
        allDaySlot={false}
        events={calendarEvents}
        eventClick={handleEventClick}
        datesSet={handleDatesSet}
        eventTimeFormat={{
          hour: "numeric",
          minute: "2-digit",
          meridiem: "short",
        }}
        dayMaxEvents={6}
        eventDisplay="block"
      />
      {rangeEmpty && events.length > 0 ? (
        <p className="mt-4 text-center text-[13px] text-neutral-500">
          No classes scheduled in this period. Browse other days or switch to
          week or month view.
        </p>
      ) : null}
    </div>
  );
}
