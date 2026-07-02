import type { SessionPhase } from "@/lib/classroom/types";

export type CalendarEventKind = "class-session" | "assignment-due";

export interface StudentCalendarEvent {
  id: string;
  title: string;
  start: string;
  end: string;
  allDay?: boolean;
  href: string;
  sessionPhase?: SessionPhase;
  kind: CalendarEventKind;
  courseTitle: string;
}
