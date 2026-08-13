import { resolveLessonSessionPhase } from "@/lib/calendar/session-phase";
import type {
  ClassroomCourseDetail,
  ClassroomWeek,
  ClassroomLesson,
} from "@/lib/classroom/types";

function readIsoDate(value: unknown): Date | null {
  if (typeof value !== "string" || value.trim() === "") return null;
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? null : d;
}

function formatLessonDuration(value: unknown): string {
  const minutes =
    typeof value === "number"
      ? value
      : typeof value === "string" && value.trim() !== ""
        ? Number(value)
        : NaN;
  if (!Number.isFinite(minutes) || minutes <= 0) return "";
  return `${minutes} mins`;
}

function findActiveLiveLesson(lessons: any[]): any | null {
  const liveNow = lessons.find(
    (l) => l?.lessonType === "live_session" && l?.isLiveNow,
  );
  if (liveNow) return liveNow;

  const upcoming = lessons
    .filter((l) => l?.lessonType === "live_session" && readIsoDate(l?.startsAt))
    .map((l) => ({ lesson: l, startsAt: readIsoDate(l?.startsAt)! }))
    .sort((a, b) => a.startsAt.getTime() - b.startsAt.getTime())[0];

  return upcoming?.lesson ?? null;
}

export function mapClassroomResponse(data: any): {
  course: ClassroomCourseDetail;
  weeks: ClassroomWeek[];
} {
  const { program, classroom } = data;

  const allLessons = classroom.modules.flatMap((m: any) => m.lessons);
  const liveLesson = findActiveLiveLesson(allLessons);
  const liveStartsAt = readIsoDate(liveLesson?.startsAt)?.toISOString();

  const recordings = allLessons.map((lesson: any) => ({
    id: lesson.id,
    title: lesson.title,
    recordingUrl: lesson.recordingUrl,
    duration: lesson.durationMinutes,
  }));

  const course: ClassroomCourseDetail = {
    id: classroom.id,
    title: classroom.title,
    courseLabel: program.cohortName,
    syllabusCount: data.summary.totalLessons,
    sessionPhase: liveLesson?.isLiveNow ? "live" : "upcoming",
    sessionId: liveLesson?.id,
    sessionLabel: program.cohortCode,
    sessionDuration: formatLessonDuration(liveLesson?.durationMinutes),
    meetUrl: liveLesson?.zoomJoinUrl || liveLesson?.liveSessionUrl || "",
    scheduledAt: liveStartsAt ?? undefined,
    liveVideoProvider: "zoom",
    description: classroom.description,
    overview: program.description,

    recordingSummary: "",

    recordingTitle: recordings[0]?.title,
    recordingEmbedUrl: recordings[0]?.recordingUrl ?? null,

    recordings,

    resources: allLessons.flatMap((l: any) =>
      (l.resources ?? []).map((r: any) => ({
        id: r.id,
        title: r.title,
        type: r.type,
        url: r.url ?? null,
        content: r.content ?? null,
      })),
    ),

    href: `/courses/${classroom.id}`,
  };

  const weeks: ClassroomWeek[] = classroom.modules.map((module: any) => ({
    id: module.id,
    label: module.weekLabel,
    topic: module.title,
    expanded: false,
    lessons: module.lessons.map((lesson: any): ClassroomLesson => {
      const type = lesson.lessonType === "live_session" ? "live" : "recorded";
      const isLive =
        type === "live" &&
        resolveLessonSessionPhase(
          lesson.startsAt,
          lesson.durationMinutes,
          lesson.isLiveNow,
        ) === "live";

      return {
        id: lesson.id,
        title: lesson.title,
        type,
        subtitle: formatLessonDuration(lesson.durationMinutes),
        completed: false,
        description: lesson.overview ?? lesson.summary,
        isLive,
      };
    }),
  }));

  return { course, weeks };
}
