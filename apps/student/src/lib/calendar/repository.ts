import calendarJson from "@/data/student-calendar.json";
import { getClassroomEventHref } from "@/lib/classroom/repository";
import type {
  CalendarAssignmentSeed,
  CalendarClassSessionSeed,
  StudentCalendarDataFile,
  StudentCalendarEvent,
} from "./types";

const data = calendarJson as StudentCalendarDataFile;

function parseTime(time: string): { hours: number; minutes: number } {
  const [h, m] = time.split(":").map((part) => Number.parseInt(part, 10));
  return {
    hours: Number.isFinite(h) ? h : 0,
    minutes: Number.isFinite(m) ? m : 0,
  };
}

function dateWithOffset(offsetDays: number): Date {
  const date = new Date();
  date.setHours(0, 0, 0, 0);
  date.setDate(date.getDate() + offsetDays);
  return date;
}

function applyTime(base: Date, time: string): Date {
  const { hours, minutes } = parseTime(time);
  const next = new Date(base);
  next.setHours(hours, minutes, 0, 0);
  return next;
}

function addMinutes(date: Date, minutes: number): Date {
  return new Date(date.getTime() + minutes * 60_000);
}

function toIso(date: Date): string {
  return date.toISOString();
}

function mapClassSession(seed: CalendarClassSessionSeed): StudentCalendarEvent {
  const day = dateWithOffset(seed.startOffsetDays);
  const start = applyTime(day, seed.startTime);
  const end = addMinutes(start, seed.durationMinutes);

  return {
    id: seed.id,
    title: seed.title,
    start: toIso(start),
    end: toIso(end),
    href: getClassroomEventHref(
      seed.courseId,
      seed.sessionPhase,
      seed.sessionId,
    ),
    sessionPhase: seed.sessionPhase,
    kind: "class-session",
    courseTitle: seed.courseTitle,
  };
}

function mapAssignmentDue(seed: CalendarAssignmentSeed): StudentCalendarEvent {
  const day = dateWithOffset(seed.dueOffsetDays);
  const dueAt = applyTime(day, seed.dueTime);

  const end = addMinutes(dueAt, 30);

  return {
    id: seed.id,
    title: `${seed.title} — due`,
    start: toIso(dueAt),
    end: toIso(end),
    href: `/assessments/${seed.assignmentId}`,
    kind: "assignment-due",
    courseTitle: seed.courseTitle,
  };
}

function isEmptyVariant(): boolean {
  return process.env.NEXT_PUBLIC_STUDENT_CALENDAR_VARIANT === "empty";
}

export function getStudentCalendarEvents(): StudentCalendarEvent[] {
  if (isEmptyVariant()) {
    return [];
  }

  return [
    ...data.events.map(mapClassSession),
    ...data.assignments.map(mapAssignmentDue),
  ];
}

export function hasStudentCalendarData(): boolean {
  return getStudentCalendarEvents().length > 0;
}
