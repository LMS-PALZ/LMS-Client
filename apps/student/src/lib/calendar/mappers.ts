import type { StudentClassroomData } from "@ssu/api";
import type { AssignmentListItem } from "@ssu/types";
import type { StudentCalendarEvent } from "./types";
import { resolveLessonSessionPhase } from "./session-phase";

const DEFAULT_DURATION_MINUTES = 120;

function addMinutes(date: Date, minutes: number): Date {
  return new Date(date.getTime() + minutes * 60_000);
}

function getCalendarSessionHref(lessonId: string): string {
  return `/classroom/${lessonId}`;
}

export function buildCalendarEvents(
  classroom: StudentClassroomData,
  assignments: AssignmentListItem[],
): StudentCalendarEvent[] {
  const programTitle = classroom.program.title || "Your program";
  const lessons = classroom.classroom.modules.flatMap(
    (module) => module.lessons ?? [],
  );

  const classEvents: StudentCalendarEvent[] = lessons
    .filter((lesson) => lesson.lessonType === "live_session" && lesson.startsAt)
    .map((lesson) => {
      const extended = lesson as typeof lesson & { isLiveNow?: boolean };
      const phase = resolveLessonSessionPhase(
        lesson.startsAt,
        lesson.durationMinutes,
        extended.isLiveNow,
      );
      const start = new Date(lesson.startsAt!);
      const duration =
        lesson.durationMinutes && lesson.durationMinutes > 0
          ? lesson.durationMinutes
          : DEFAULT_DURATION_MINUTES;
      const end = addMinutes(start, duration);

      return {
        id: `session-${lesson.id}`,
        title: phase === "live" ? `${lesson.title} · Live` : lesson.title,
        start: start.toISOString(),
        end: end.toISOString(),
        href: getCalendarSessionHref(lesson.id),
        sessionPhase: phase,
        kind: "class-session",
        courseTitle: programTitle,
      };
    });

  const assignmentEvents: StudentCalendarEvent[] = assignments
    .filter((assignment) => assignment.dueAt)
    .map((assignment) => {
      const dueAt = new Date(assignment.dueAt);
      const end = addMinutes(dueAt, 30);

      return {
        id: `assignment-${assignment.id}`,
        title: `${assignment.title} — due`,
        start: dueAt.toISOString(),
        end: end.toISOString(),
        href: `/assessments/${assignment.id}`,
        kind: "assignment-due",
        courseTitle: assignment.courseName || programTitle,
      };
    });

  return [...classEvents, ...assignmentEvents].sort(
    (a, b) => new Date(a.start).getTime() - new Date(b.start).getTime(),
  );
}
