import type { SessionPhase } from "@/lib/classroom/types";

export type CalendarEventKind = "class-session" | "assignment-due";

export interface CalendarClassSessionSeed {
  id: string;
  title: string;
  courseId: string;
  courseTitle: string;
  sessionPhase: SessionPhase;
  sessionId?: string;
  startOffsetDays: number;
  startTime: string;
  durationMinutes: number;
}

export interface CalendarAssignmentSeed {
  id: string;
  assignmentId: string;
  title: string;
  courseId: string;
  courseTitle: string;
  dueOffsetDays: number;
  dueTime: string;
}

export interface StudentCalendarDataFile {
  events: CalendarClassSessionSeed[];
  assignments: CalendarAssignmentSeed[];
}

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
