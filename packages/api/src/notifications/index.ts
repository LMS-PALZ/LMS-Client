import type {
  AdminProgram,
  LiveSessionItem,
  NotificationDto,
  ProgramClassroomModule,
} from "@ssu/types";
import { filterProgramsForTutor, listAdminPrograms } from "../admin-programs";
import { getStudentPofile, isStudentAuthenticated, readSession } from "../auth";
import { getProgramClassroomModules } from "../program-classroom";
import { getStudentClassroom } from "../student-classroom";
import { mapClassroomLessonsToSessions } from "../student-dashboard";
import { getStoredAuthToken } from "../student-login";
import { buildClassNotifications } from "./build-class-notifications";

function readString(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

function isTutorRole(role: string | undefined): boolean {
  const normalized = (role ?? "").toLowerCase().trim();
  return (
    normalized === "tutor" ||
    normalized === "trainer" ||
    normalized === "instructor"
  );
}

function isStaffRole(role: string | undefined): boolean {
  const normalized = (role ?? "").toLowerCase().trim();
  return (
    normalized === "admin" ||
    normalized === "super_admin" ||
    normalized === "superadmin" ||
    isTutorRole(normalized)
  );
}

const MAX_STAFF_NOTIFICATIONS = 20;

function lessonsToSessions(
  programTitle: string,
  modules: ProgramClassroomModule[],
): LiveSessionItem[] {
  const sessions: LiveSessionItem[] = [];

  for (const module of modules) {
    for (const lesson of module.lessons ?? []) {
      if (lesson.lessonType !== "live_session" || !lesson.startsAt) continue;
      sessions.push({
        id: lesson.id,
        title: lesson.title,
        courseName: programTitle,
        startsAt: lesson.startsAt,
        isLive: Boolean(lesson.isLiveNow),
        meetingUrl: lesson.zoomJoinUrl || lesson.liveSessionUrl,
      });
    }
  }

  return sessions;
}

function buildCourseAssignedNotifications(
  programs: AdminProgram[],
): NotificationDto[] {
  return programs.map((program) => ({
    id: `course-assigned-${program.id}`,
    kind: "course-assigned",
    message: `You've been added to "${program.title}". Open the course to manage modules and live sessions.`,
    createdAt:
      program.updatedAt || program.createdAt || new Date().toISOString(),
    read: false,
    href: `/courses/${program.id}`,
  }));
}

function lessonHref(
  programId: string,
  modules: ProgramClassroomModule[],
  lessonId: string,
): string {
  for (const module of modules) {
    if (module.lessons?.some((lesson) => lesson.id === lessonId)) {
      return `/courses/${programId}/modules/${module.id}/lessons/${lessonId}`;
    }
  }
  return `/courses/${programId}`;
}

function buildStaffSessionNotifications(
  program: AdminProgram,
  modules: ProgramClassroomModule[],
  now = new Date(),
): NotificationDto[] {
  const sessions = lessonsToSessions(program.title, modules);
  return buildClassNotifications(sessions, now).map((notification) => {
    const lessonId = notification.id
      .replace("class-live-", "")
      .replace("class-upcoming-", "");

    return {
      ...notification,
      id: `${notification.id}-${program.id}`,
      href: lessonHref(program.id, modules, lessonId),
    };
  });
}

async function listClassSessionNotifications(): Promise<NotificationDto[]> {
  if (!isStudentAuthenticated()) return [];

  const profileRes = await getStudentPofile();
  if (!profileRes.ok) return [];

  const profile = profileRes.data as Record<string, unknown>;
  const program =
    profile.program && typeof profile.program === "object"
      ? (profile.program as Record<string, unknown>)
      : null;

  const programId = readString(program?.id ?? program?._id);
  const programTitle = readString(program?.title ?? program?.name);
  if (!programId) return [];

  const classroomRes = await getStudentClassroom(programId);
  if (!classroomRes.ok) return [];

  const sessions = mapClassroomLessonsToSessions(
    classroomRes.data.classroom.modules,
    classroomRes.data.program.title || programTitle,
  );

  return buildClassNotifications(sessions);
}

async function listStaffNotifications(): Promise<NotificationDto[]> {
  if (!getStoredAuthToken()) return [];

  const session = readSession();
  if (!session || !isStaffRole(session.role)) return [];

  const programsRes = await listAdminPrograms({ page: 1, limit: 100 });
  if (!programsRes.ok) return [];

  const isTutor = isTutorRole(session.role);
  const programs = isTutor
    ? filterProgramsForTutor(programsRes.data.items, {
        id: session.id,
        email: session.email,
        accessToken: session.accessToken || getStoredAuthToken() || undefined,
      })
    : programsRes.data.items;

  // Tutors always get an “added to course” notice for each of their programs.
  const assignedNotifications = isTutor
    ? buildCourseAssignedNotifications(programs)
    : [];

  const snapshots = await Promise.all(
    programs.map(async (program) => {
      const modulesRes = await getProgramClassroomModules(program.id);
      return {
        program,
        modules: modulesRes.ok ? modulesRes.data : [],
      };
    }),
  );

  const sessionNotifications = snapshots.flatMap(({ program, modules }) =>
    buildStaffSessionNotifications(program, modules),
  );

  return [...assignedNotifications, ...sessionNotifications]
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    )
    .slice(0, MAX_STAFF_NOTIFICATIONS);
}

async function listNotifications(): Promise<NotificationDto[]> {
  const session = readSession();
  if (!session) return [];

  if (session.role === "students") {
    return listClassSessionNotifications();
  }

  if (isStaffRole(session.role)) {
    return listStaffNotifications();
  }

  return [];
}

export const notificationsApi = {
  /** Swap this implementation when the backend notifications API is ready. */
  list: listNotifications,
};
