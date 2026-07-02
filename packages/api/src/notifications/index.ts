import type { NotificationDto } from "@ssu/types";
import { getStudentPofile, isStudentAuthenticated } from "../auth";
import { getStudentClassroom } from "../student-classroom";
import { mapClassroomLessonsToSessions } from "../student-dashboard";
import { buildClassNotifications } from "./build-class-notifications";

function readString(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
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

export const notificationsApi = {
  /** Swap this implementation when the backend notifications API is ready. */
  list: listClassSessionNotifications,
};
