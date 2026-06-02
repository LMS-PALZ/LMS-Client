"use client";

import type { EventClickArg, DatesSetArg } from "@fullcalendar/core";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import FullCalendar from "@fullcalendar/react";
import timeGridPlugin from "@fullcalendar/timegrid";
import type { StudentCalendarEvent } from "@/lib/calendar";
import { useRouter } from "next/navigation";
import { useCallback, useMemo, useState } from "react";
import "./student-calendar.css";

function eventClassNames(event: StudentCalendarEvent): string[] {
  if (event.kind === "assignment-due") {
    return ["ssu-cal-event", "ssu-cal-event--assignment"];
  }
  return [
    "ssu-cal-event",
    `ssu-cal-event--${event.sessionPhase ?? "upcoming"}`,
  ];
}

function overlapsRange(
  event: StudentCalendarEvent,
  start: Date,
  end: Date,
): boolean {
  const eventStart = new Date(event.start).getTime();
  const eventEnd = new Date(event.end).getTime();
  return eventStart < end.getTime() && eventEnd >= start.getTime();
}

export interface StudentCalendarProps {
  events: StudentCalendarEvent[];
  onRangeEmptyChange?: (empty: boolean) => void;
}

export function StudentCalendar({
  events,
  onRangeEmptyChange,
}: StudentCalendarProps) {
  const router = useRouter();
  const [rangeEmpty, setRangeEmpty] = useState(false);

  const calendarEvents = useMemo(
    () =>
      events.map((event) => ({
        id: event.id,
        title: event.title,
        start: event.start,
        end: event.end,
        allDay: event.allDay,
        classNames: eventClassNames(event),
        extendedProps: {
          href: event.href,
          kind: event.kind,
          sessionPhase: event.sessionPhase,
          courseTitle: event.courseTitle,
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
          right: "dayGridMonth,timeGridWeek,timeGridDay",
        }}
        height="auto"
        nowIndicator
        slotMinTime="07:00:00"
        slotMaxTime="22:00:00"
        allDaySlot
        events={calendarEvents}
        eventClick={handleEventClick}
        datesSet={handleDatesSet}
        eventTimeFormat={{
          hour: "numeric",
          minute: "2-digit",
          meridiem: "short",
        }}
        dayMaxEvents={3}
      />
      {rangeEmpty && events.length > 0 ? (
        <p className="mt-4 text-center text-[13px] text-neutral-500">
          No classes or due dates in this period. Use the arrows to browse other
          weeks or switch to month view.
        </p>
      ) : null}
    </div>
  );
}
