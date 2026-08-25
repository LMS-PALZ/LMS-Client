import type { ProgramClassroomLesson } from "@ssu/types";

export function resolveLessonMeetUrl(lesson: ProgramClassroomLesson): string {
  return lesson.zoomJoinUrl?.trim() || lesson.liveSessionUrl?.trim() || "";
}

export function resolveLessonMeetingNumber(
  lesson: ProgramClassroomLesson,
): string {
  const fromId = (lesson.zoomMeetingId ?? "").replace(/\D/g, "");
  if (fromId) return fromId;

  const meetUrl = resolveLessonMeetUrl(lesson);
  const match =
    meetUrl.match(/\/j\/(\d+)/i) ||
    meetUrl.match(/\/wc\/join\/(\d+)/i) ||
    meetUrl.match(/\/s\/(\d+)/i);

  return match?.[1] ?? "";
}

export function formatLessonSchedule(startsAt?: string): string {
  if (!startsAt) return "Schedule not set";

  const date = new Date(startsAt);
  if (Number.isNaN(date.getTime())) return "Schedule not set";

  return new Intl.DateTimeFormat(undefined, {
    dateStyle: "full",
    timeStyle: "short",
  }).format(date);
}
