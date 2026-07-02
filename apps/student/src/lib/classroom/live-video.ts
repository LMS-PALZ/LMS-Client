import type { ClassroomCourseDetail } from "./types";

export type LiveVideoProvider = "zoom";

export function resolveLiveVideoForCourse(
  course: ClassroomCourseDetail,
  meetUrlOverride?: string,
) {
  return {
    provider: "zoom" as const,
    meetUrl: meetUrlOverride ?? course.meetUrl,
  };
}
