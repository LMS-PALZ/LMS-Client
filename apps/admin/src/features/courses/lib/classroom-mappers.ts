import type {
  AdminProgram,
  ProgramClassroomModule,
  UpsertProgramClassroomPayload,
} from "@ssu/types";
import type { CourseStatus } from "../types";

function isTemporaryId(id: string): boolean {
  return id.startsWith("temp-");
}

function isPublishedLesson(lesson: { isPublished?: boolean }): boolean {
  return lesson.isPublished !== false;
}

export function countPublishedLessons(
  modules: ProgramClassroomModule[],
): number {
  return modules.reduce(
    (total, module) =>
      total +
      (module.lessons ?? []).filter((lesson) => isPublishedLesson(lesson))
        .length,
    0,
  );
}

/**
 * Classroom publish rules from the API:
 * - `status: "published"` requires at least one lesson with `isPublished: true`
 * - Modules alone (no lessons) can only be saved as draft
 */
export function resolveClassroomStatus(
  modules: ProgramClassroomModule[],
  requestedStatus: CourseStatus,
): CourseStatus {
  if (requestedStatus === "draft") return "draft";
  return countPublishedLessons(modules) > 0 ? "published" : "draft";
}

export function countTotalLessons(modules: ProgramClassroomModule[]): number {
  return modules.reduce(
    (total, module) => total + (module.lessons?.length ?? module.lessonCount),
    0,
  );
}

export function buildUpsertClassroomPayload(
  program: AdminProgram,
  modules: ProgramClassroomModule[],
  status: CourseStatus = "draft",
): UpsertProgramClassroomPayload {
  const resolvedStatus = resolveClassroomStatus(modules, status);

  return {
    title: program.title,
    description: program.description,
    status: resolvedStatus,
    modules: modules.map((module, moduleIndex) => ({
      ...(isTemporaryId(module.id) ? {} : { id: module.id }),
      title: module.title,
      summary: module.summary ?? module.description,
      weekLabel: module.weekLabel ?? `Week ${moduleIndex + 1}`,
      order: module.order ?? moduleIndex + 1,
      lessons: (module.lessons ?? []).map((lesson, lessonIndex) => ({
        ...(isTemporaryId(lesson.id) ? {} : { id: lesson.id }),
        title: lesson.title,
        summary: lesson.summary,
        overview: lesson.overview,
        lessonType: lesson.lessonType,
        order: lesson.order ?? lessonIndex + 1,
        isPublished: lesson.isPublished ?? true,
        durationMinutes: lesson.durationMinutes,
        liveSessionUrl: lesson.liveSessionUrl,
        startsAt: lesson.startsAt,
        recordingUrl: lesson.recordingUrl,
      })),
    })),
  };
}

export function formatModuleSummary(
  moduleCount: number,
  lessonCount: number,
): string {
  const moduleLabel = moduleCount === 1 ? "module" : "modules";
  const unitLabel = lessonCount === 1 ? "unit" : "units";
  return `${moduleCount} ${moduleLabel} and ${lessonCount} ${unitLabel}`;
}
