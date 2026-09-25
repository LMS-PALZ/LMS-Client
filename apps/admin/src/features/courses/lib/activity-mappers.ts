import type {
  ClassroomLessonResource,
  ClassroomLessonType,
  ProgramClassroomLesson,
  ProgramClassroomModule,
} from "@ssu/types";
import type { ActivityResourceDraft } from "../types/activity";
import { combineDateAndTime, createId, isHttpUrl } from "./course-utils";

export interface BuildLessonInput {
  existingLesson: ProgramClassroomLesson | null;
  activityType: ClassroomLessonType;
  title: string;
  overview: string;
  sessionDate: Date | null;
  sessionTime: string | null;
  description: string;
  recordingUrl: string;
  resources: ActivityResourceDraft[];
}

function toResourcePayload(
  resources: ActivityResourceDraft[],
): ClassroomLessonResource[] {
  const payload: ClassroomLessonResource[] = [];

  resources.forEach((resource, index) => {
    const url = resource.url?.trim() ?? "";
    if (!isHttpUrl(url)) return;
    const id = resource.id?.trim();
    payload.push({
      ...(id && !id.startsWith("temp-") ? { id } : {}),
      title: resource.title?.trim() || url,
      url,
      type: resource.type?.trim() || "link",
      order: index + 1,
    });
  });

  return payload;
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
    resources: isLiveSession ? toResourcePayload(input.resources) : undefined,
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
