import type { StudentClassroomData } from "@ssu/api";
import type { AssignmentListItem } from "@ssu/types";
import { classroomSessionHref } from "@/lib/classroom/recording-embed";
import type { StudentCalendarEvent } from "./types";
import { resolveLessonSessionPhase } from "./session-phase";

const DEFAULT_DURATION_MINUTES = 120;

function addMinutes(date: Date, minutes: number): Date {
  return new Date(date.getTime() + minutes * 60_000);
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
    .filter((lesson) => {
      if (!lesson.startsAt) return false;
      return (
        lesson.lessonType === "live_session" ||
        lesson.lessonType === "recording" ||
        Boolean(lesson.recordingUrl?.trim())
      );
    })
    .map((lesson) => {
      const extended = lesson as typeof lesson & { isLiveNow?: boolean };
      const hasRecording = Boolean(lesson.recordingUrl?.trim());
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

      let title = lesson.title;
      if (hasRecording && phase !== "upcoming") {
        title = `${lesson.title} · Recording`;
      } else if (phase === "live" && !hasRecording) {
        title = `${lesson.title} · Live`;
      }

      // Always link to the class detail page (resources). Join/watch is gated there.
      const href = classroomSessionHref({
        lessonId: lesson.id,
        recordingUrl: lesson.recordingUrl,
        mode:
          hasRecording && phase !== "upcoming"
            ? "watch"
            : phase === "live"
              ? "join"
              : "view",
      });

      return {
        id: `session-${lesson.id}`,
        title,
        start: start.toISOString(),
        end: end.toISOString(),
        href,
        sessionPhase: phase,
        kind: "class-session" as const,
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
