import classroomJson from "@/data/classroom.json";
import type {
  ClassroomCourseDetail,
  ClassroomCourseItem,
  ClassroomDataFile,
  ClassroomLiveSession,
  ClassroomProgram,
  ClassroomWeek,
  SessionPhase,
} from "./types";

const data = classroomJson as ClassroomDataFile;

export function getClassroomEventHref(
  courseId: string,
  sessionPhase: SessionPhase,
  sessionId?: string,
): string {
  if (sessionPhase === "live" && sessionId) {
    return `/classroom/${sessionId}`;
  }
  return `/courses/${courseId}`;
}

function courseHref(
  course: Pick<ClassroomCourseDetail, "id" | "sessionPhase" | "sessionId">,
): string {
  return getClassroomEventHref(
    course.id,
    course.sessionPhase,
    course.sessionId,
  );
}

function withHref(
  course: Omit<ClassroomCourseDetail, "href">,
): ClassroomCourseDetail {
  const detail: ClassroomCourseDetail = {
    ...course,
    href: courseHref(course),
  };
  return detail;
}

const courses = data.courses.map(withHref);

export function getClassroomProgram(): ClassroomProgram {
  return data.program;
}

export function getClassroomLiveSession(): ClassroomLiveSession {
  return data.liveSession;
}

export function getDefaultMeetUrl(): string {
  return data.defaultMeetUrl;
}

export function getDefaultRecordingEmbedUrl(): string {
  return data.defaultRecordingEmbedUrl;
}

export function getClassroomCourseItems(): ClassroomCourseItem[] {
  return courses.map(
    ({
      id,
      title,
      courseLabel,
      syllabusCount,
      sessionPhase,
      sessionId,
      href,
    }) => ({
      id,
      title,
      courseLabel,
      syllabusCount,
      sessionPhase,
      sessionId,
      href,
    }),
  );
}

export function getClassroomCourseById(
  id: string,
): ClassroomCourseDetail | null {
  return courses.find((course) => course.id === id) ?? null;
}

export function getClassroomWeeksForCourse(courseId: string): ClassroomWeek[] {
  return data.weeksByCourse[courseId] ?? [];
}

export function getClassroomSessionCourseId(sessionId: string): string | null {
  if (sessionId === data.liveSession.sessionId) {
    return data.liveSession.courseId;
  }
  const course = courses.find((c) => c.sessionId === sessionId);
  return course?.id ?? null;
}

export function isRecordingAvailable(phase: SessionPhase): boolean {
  return phase === "ended";
}

export const classroomProgram = {
  ...data.program,
  liveSession: data.liveSession,
  courseItems: getClassroomCourseItems(),
};
