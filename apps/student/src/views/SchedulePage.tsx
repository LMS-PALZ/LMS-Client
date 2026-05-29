"use client";

import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { PageHeader } from "@ssu/ui";

export function ScheduleCalendar() {
  return (
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
            title: "Social Media Strategy: Viral Campaigns",
            start: new Date(Date.now() + 86400000).toISOString(),
            end: new Date(Date.now() + 86400000 + 3600000).toISOString(),
          },
        ]}
      />
    </div>
  );
}

export function SchedulePage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Calendar"
        breadcrumbs={[{ label: "Student" }, { label: "Calendar" }]}
      />
      <ScheduleCalendar />
    </div>
  );
}
