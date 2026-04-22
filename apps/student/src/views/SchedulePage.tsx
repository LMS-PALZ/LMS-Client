"use client";

import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { PageHeader } from "@ssu/ui";

export function SchedulePage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Schedule"
        breadcrumbs={[{ label: "Student" }, { label: "Schedule" }]}
      />
      <div className="rounded-xl border bg-white p-2 shadow-card">
        <FullCalendar
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          initialView="timeGridWeek"
          headerToolbar={{
            left: "prev,next today",
            center: "title",
            right: "dayGridMonth,timeGridWeek,timeGridDay",
          }}
          height="auto"
          events={[
            {
              title: "Live Q&A",
              start: new Date(Date.now() + 86400000).toISOString(),
              end: new Date(Date.now() + 86400000 + 3600000).toISOString(),
            },
          ]}
        />
      </div>
    </div>
  );
}
