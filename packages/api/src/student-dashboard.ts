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

  const program = profileRes.data.program;

  return {
    programId: readString(program?.id),
    programTitle: readString(program?.title),
  };
}

function mapLiveGeneralToSessions(
  liveGeneralPrograms: Array<{
    lessonId: string;
    lessonTitle: string;
    programTitle: string;
    programId: string;
    startsAt: string;
    liveSessionUrl?: string | null;
    zoomJoinUrl?: string | null;
  }>,
): LiveSessionItem[] {
  return liveGeneralPrograms
    .filter((item) => item.lessonId && item.lessonTitle)
    .map((item) => ({
      id: item.lessonId,
      title: item.lessonTitle,
      courseName: item.programTitle || "",
      startsAt: item.startsAt || new Date().toISOString(),
      isLive: true,
      meetingUrl: item.liveSessionUrl ?? undefined,
      zoomJoinUrl: item.zoomJoinUrl ?? undefined,
      programId: item.programId,
    }));
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
    const profileRes = await getStudentPofile();
    if (!profileRes.ok) return [];

    const {
      program,
      generalPrograms,
      liveGeneralPrograms,
      hasLiveGeneralProgram,
    } = profileRes.data;
    const programId = readString(program?.id);
    const programTitle = readString(program?.title);

    const sessionSources: LiveSessionItem[] = [];

    if (programId) {
      const classroomRes = await getStudentClassroom(programId);
      if (classroomRes.ok) {
        sessionSources.push(
          ...mapClassroomLessonsToSessions(
            classroomRes.data.classroom.modules,
            classroomRes.data.program.title || programTitle,
          ).map((session) => ({
            ...session,
            programId,
          })),
        );
      }
    }

    const generalClassroomResults = await Promise.all(
      generalPrograms.map(async (gp) => {
        const gpId = readString(gp.id);
        if (!gpId) return null;
        const classroomRes = await getStudentClassroom(gpId);
        if (!classroomRes.ok) return null;
        return {
          gpId,
          title: classroomRes.data.program.title || readString(gp.title),
          modules: classroomRes.data.classroom.modules,
        };
      }),
    );

    for (const result of generalClassroomResults) {
      if (!result) continue;
      sessionSources.push(
        ...mapClassroomLessonsToSessions(result.modules, result.title).map(
          (session) => ({
            ...session,
            programId: result.gpId,
          }),
        ),
      );
    }

    if (hasLiveGeneralProgram) {
      sessionSources.push(...mapLiveGeneralToSessions(liveGeneralPrograms));
    }

    const byId = new Map<string, LiveSessionItem>();
    for (const session of sessionSources) {
      const existing = byId.get(session.id);
      if (!existing || (!existing.isLive && session.isLive)) {
        byId.set(session.id, session);
      }
    }

    return Array.from(byId.values()).sort(
      (a, b) => new Date(a.startsAt).getTime() - new Date(b.startsAt).getTime(),
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
