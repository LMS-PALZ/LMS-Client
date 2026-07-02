import type { ClassroomCourseDetail } from "./types";

export type LiveVideoProvider = "zoom" | "jitsi";

const DEFAULT_JITSI_DOMAIN = "meet.jit.si";

export function getLiveVideoProvider(): LiveVideoProvider {
  const env = process.env.NEXT_PUBLIC_LIVE_VIDEO_PROVIDER;
  if (env === "jitsi" || env === "zoom") return env;
  return "zoom";
}

export function resolveJitsiDomain(): string {
  return process.env.NEXT_PUBLIC_JITSI_DOMAIN ?? DEFAULT_JITSI_DOMAIN;
}

export function resolveJitsiRoomName(
  course: Pick<ClassroomCourseDetail, "id" | "sessionId" | "jitsiRoomName">,
): string {
  if (course.jitsiRoomName) return course.jitsiRoomName;
  const id = course.sessionId ?? course.id;
  return `SSU-WebDev-${id}`.replace(/[^a-zA-Z0-9-_]/g, "-");
}

export function resolveLiveVideoForCourse(
  course: ClassroomCourseDetail,
  meetUrlOverride?: string,
) {
  const provider = course.liveVideoProvider ?? getLiveVideoProvider();
  const meetUrl = meetUrlOverride ?? course.meetUrl;

  return {
    provider,
    meetUrl,
    jitsiRoomName: resolveJitsiRoomName(course),
    jitsiDomain: resolveJitsiDomain(),
  };
}
