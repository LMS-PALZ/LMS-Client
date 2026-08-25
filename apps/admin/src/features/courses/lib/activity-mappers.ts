import type {
  ClassroomLessonType,
  ProgramClassroomLesson,
  ProgramClassroomModule,
} from "@ssu/types";
import { combineDateAndTime, createId } from "./course-utils";

export interface BuildLessonInput {
  existingLesson: ProgramClassroomLesson | null;
  activityType: ClassroomLessonType;
  title: string;
  overview: string;
  sessionDate: Date | null;
  sessionTime: string | null;
  description: string;
  recordingUrl: string;
}

export function buildLessonPayload(
  input: BuildLessonInput,
): ProgramClassroomLesson {
  const isLiveSession = input.activityType === "live_session";

  let startsAt: string | undefined;
  if (isLiveSession && input.sessionDate && input.sessionTime) {
    startsAt = combineDateAndTime(input.sessionDate, input.sessionTime);
  }

  return {
    id: input.existingLesson?.id ?? createId("temp-lesson"),
    title: input.title.trim(),
    overview: isLiveSession
      ? input.description.trim()
      : input.overview.trim() || undefined,
    summary: isLiveSession ? input.description.trim() : undefined,
    lessonType: input.activityType,
    isPublished: true,
    startsAt: isLiveSession ? startsAt : undefined,
    recordingUrl: isLiveSession
      ? input.recordingUrl.trim() || undefined
      : undefined,
  };
}

export function upsertLessonInModules(
  modules: ProgramClassroomModule[],
  targetModuleId: string,
  lessonId: string | null,
  nextLesson: ProgramClassroomLesson,
): ProgramClassroomModule[] {
  return modules.map((module) => {
    if (module.id !== targetModuleId) return module;

    const lessons = [...(module.lessons ?? [])];
    const existingIndex = lessonId
      ? lessons.findIndex((lesson) => lesson.id === lessonId)
      : -1;

    if (existingIndex >= 0) {
      lessons[existingIndex] = { ...lessons[existingIndex], ...nextLesson };
    } else {
      lessons.push(nextLesson);
    }

    return { ...module, lessons, lessonCount: lessons.length };
  });
}
