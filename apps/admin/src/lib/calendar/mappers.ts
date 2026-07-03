import { adminPath } from "@ssu/config/portal-paths";
import type { AdminProgramClassroomSnapshot } from "@ssu/api";
import type { ProgramClassroomLesson } from "@ssu/types";
import { resolveLessonSessionPhase } from "./session-phase";
import type { AdminCalendarEvent } from "./types";

const DEFAULT_DURATION_MINUTES = 120;

function addMinutes(date: Date, minutes: number): Date {
  return new Date(date.getTime() + minutes * 60_000);
}

function readIsLiveNow(lesson: ProgramClassroomLesson): boolean {
  const extended = lesson as ProgramClassroomLesson & { isLiveNow?: boolean };
  return Boolean(extended.isLiveNow);
}

export function buildAdminCalendarEvents(
  snapshots: AdminProgramClassroomSnapshot[],
): AdminCalendarEvent[] {
  const events: AdminCalendarEvent[] = [];

  for (const { program, modules } of snapshots) {
    for (const module of modules) {
      for (const lesson of module.lessons ?? []) {
        if (lesson.lessonType !== "live_session" || !lesson.startsAt) continue;

        const phase = resolveLessonSessionPhase(
          lesson.startsAt,
          lesson.durationMinutes,
          readIsLiveNow(lesson),
        );
        const start = new Date(lesson.startsAt);
        const duration =
          lesson.durationMinutes && lesson.durationMinutes > 0
            ? lesson.durationMinutes
            : DEFAULT_DURATION_MINUTES;
        const end = addMinutes(start, duration);
        const programLabel = program.cohortName
          ? `${program.title} (${program.cohortName})`
          : program.title;

        events.push({
          id: `admin-session-${program.id}-${lesson.id}`,
          title:
            phase === "live"
              ? `${programLabel}: ${lesson.title} · Live`
              : `${programLabel}: ${lesson.title}`,
          start: start.toISOString(),
          end: end.toISOString(),
          href: adminPath(`/courses/${program.id}`),
          sessionPhase: phase,
          programId: program.id,
          programTitle: program.title,
          cohortName: program.cohortName,
          moduleTitle: module.title,
          lessonId: lesson.id,
          lessonTitle: lesson.title,
          durationMinutes: duration,
          tutorCount: program.assignedTutorIds.length,
        });
      }
    }
  }

  return events.sort(
    (a, b) => new Date(a.start).getTime() - new Date(b.start).getTime(),
  );
}
