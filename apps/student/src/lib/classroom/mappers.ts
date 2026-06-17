import type {
  ClassroomCourseDetail,
  ClassroomWeek,
  ClassroomLesson,
} from "@/lib/classroom-data";

export function mapClassroomResponse(data: any): {
  course: ClassroomCourseDetail;
  weeks: ClassroomWeek[];
} {
  const { program, classroom } = data;

  const allLessons = classroom.modules.flatMap((m: any) => m.lessons);
  const liveLesson = allLessons.find((l: any) => l.isLiveNow);

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
    sessionPhase: liveLesson ? "live" : "upcoming",
    sessionId: undefined,
    sessionLabel: program.cohortCode,
    sessionDuration: program.duration,
    meetUrl: liveLesson?.liveSessionUrl ?? "",
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
    lessons: module.lessons.map(
      (lesson: any): ClassroomLesson => ({
        id: lesson.id,
        title: lesson.title,
        type: lesson.lessonType === "live_session" ? "live" : "recorded",
        subtitle: `${lesson.durationMinutes} mins`,
        completed: false,
        description: lesson.overview,
      }),
    ),
  }));

  return { course, weeks };
}
