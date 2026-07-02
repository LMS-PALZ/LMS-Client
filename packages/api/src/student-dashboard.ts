import type {
  AssignmentListItem,
  LiveSessionItem,
  ProgramClassroomLesson,
  ProgramClassroomModule,
  StudentProgress,
} from "@ssu/types";
import { getStudentPofile } from "./auth";
import {
  getStudentAssessmentGrades,
  getStudentAssessments,
  calculateOverallScorePercent,
} from "./student-assessments";
import { getStudentClassroom } from "./student-classroom";

function readIsoDate(value: unknown): Date | null {
  if (typeof value !== "string" || value.trim() === "") return null;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}

function isLessonLive(
  startsAt: string | undefined,
  isLiveNow?: boolean,
): boolean {
  if (isLiveNow) return true;
  const start = readIsoDate(startsAt);
  if (!start) return false;
  const now = Date.now();
  const end = start.getTime() + 2 * 60 * 60 * 1000;
  return now >= start.getTime() && now <= end;
}

export function mapClassroomLessonsToSessions(
  modules: ProgramClassroomModule[],
  programTitle: string,
): LiveSessionItem[] {
  const lessons = modules.flatMap((module) => module.lessons ?? []);

  return lessons
    .filter((lesson) => lesson.lessonType === "live_session")
    .map((lesson) => {
      const startsAt = lesson.startsAt ?? "";
      const extended = lesson as ProgramClassroomLesson & {
        isLiveNow?: boolean;
      };
      return {
        id: lesson.id,
        title: lesson.title,
        courseName: programTitle,
        startsAt: startsAt || new Date().toISOString(),
        isLive: isLessonLive(startsAt, extended.isLiveNow),
        meetingUrl: lesson.liveSessionUrl,
        description: lesson.overview ?? lesson.summary,
      };
    })
    .filter((lesson) => lesson.id && lesson.title)
    .sort(
      (a, b) => new Date(a.startsAt).getTime() - new Date(b.startsAt).getTime(),
    );
}

function readString(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

async function resolveEnrolledProgram(): Promise<{
  programId: string;
  programTitle: string;
}> {
  const profileRes = await getStudentPofile();
  if (!profileRes.ok) {
    return { programId: "", programTitle: "" };
  }

  const profile = profileRes.data as Record<string, unknown>;
  const program =
    profile.program && typeof profile.program === "object"
      ? (profile.program as Record<string, unknown>)
      : null;

  return {
    programId: readString(program?.id ?? program?._id),
    programTitle: readString(program?.title ?? program?.name),
  };
}

export const studentDashboardApi = {
  async getProgress(): Promise<StudentProgress> {
    const { programId, programTitle } = await resolveEnrolledProgram();
    if (!programId) {
      return { overallScorePercent: 0, enrolledProgramTitle: "" };
    }

    const classroomRes = await getStudentClassroom(programId);
    if (!classroomRes.ok) {
      return {
        overallScorePercent: 0,
        enrolledProgramTitle: programTitle,
      };
    }

    const { program, classroom } = classroomRes.data;
    const gradesRes = await getStudentAssessmentGrades(classroom.id);
    const assignments = gradesRes.ok ? gradesRes.data : [];

    return {
      overallScorePercent: calculateOverallScorePercent(assignments),
      enrolledProgramTitle: program.title || programTitle,
    };
  },

  async getSessions(): Promise<LiveSessionItem[]> {
    const { programId, programTitle } = await resolveEnrolledProgram();
    if (!programId) return [];

    const classroomRes = await getStudentClassroom(programId);
    if (!classroomRes.ok) return [];

    return mapClassroomLessonsToSessions(
      classroomRes.data.classroom.modules,
      classroomRes.data.program.title || programTitle,
    );
  },

  async getAssignments(): Promise<AssignmentListItem[]> {
    const { programId } = await resolveEnrolledProgram();
    if (!programId) return [];

    const classroomRes = await getStudentClassroom(programId);
    if (!classroomRes.ok) return [];

    const classroomId = classroomRes.data.classroom.id;
    const [assessmentsRes, gradesRes] = await Promise.all([
      getStudentAssessments(classroomId),
      getStudentAssessmentGrades(classroomId),
    ]);

    const byId = new Map<string, AssignmentListItem>();

    for (const item of assessmentsRes.ok ? assessmentsRes.data : []) {
      byId.set(item.id, item);
    }

    for (const item of gradesRes.ok ? gradesRes.data : []) {
      byId.set(item.id, { ...byId.get(item.id), ...item });
    }

    return Array.from(byId.values()).sort(
      (a, b) => new Date(a.dueAt).getTime() - new Date(b.dueAt).getTime(),
    );
  },
};
