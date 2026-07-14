import type {
  ClassroomLessonType,
  ProgramClassroomLesson,
  ProgramClassroomModule,
} from "@ssu/types";
import axios from "axios";
import { getStoredAuthToken } from "./student-login";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  "https://base-api.skillscaleup.org";

export interface StudentClassroomProgram {
  id: string;
  title: string;
  description?: string;
  duration?: string;
  startDate?: string;
  endDate?: string;
  cohortName?: string;
  cohortCode?: string;
}

export interface StudentClassroomSummary {
  totalLessons: number;
}

export interface StudentClassroomData {
  program: StudentClassroomProgram;
  classroom: {
    id: string;
    title: string;
    description?: string;
    status?: string;
    modules: ProgramClassroomModule[];
  };
  summary: StudentClassroomSummary;
}

function authHeaders() {
  const token = getStoredAuthToken();
  if (!token) return {};
  return { Authorization: `Bearer ${token}` };
}

function readString(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

function readNumber(value: unknown): number {
  if (typeof value === "number" && !Number.isNaN(value)) return value;
  if (typeof value === "string" && value.trim() !== "") {
    const parsed = Number(value);
    if (!Number.isNaN(parsed)) return parsed;
  }
  return 0;
}

function readLessonType(value: unknown): ClassroomLessonType {
  const raw = readString(value);
  const allowed: ClassroomLessonType[] = [
    "live_session",
    "recording",
    "reading",
    "assignment",
    "resource",
    "other",
  ];
  return allowed.includes(raw as ClassroomLessonType)
    ? (raw as ClassroomLessonType)
    : "other";
}

function normalizeLessonResources(
  value: unknown,
): ProgramClassroomLesson["resources"] {
  if (!Array.isArray(value)) return undefined;

  const resources = value
    .map((item) => {
      if (!item || typeof item !== "object") return null;
      const row = item as Record<string, unknown>;
      const title = readString(row.title ?? row.name);
      const url = readString(row.url ?? row.href);
      if (!title && !url) return null;
      return {
        id: readString(row.id ?? row._id) || undefined,
        title: title || undefined,
        url: url || undefined,
        type: readString(row.type) || undefined,
      };
    })
    .filter((item): item is NonNullable<typeof item> => item !== null);

  return resources.length > 0 ? resources : [];
}

function normalizeLesson(
  row: Record<string, unknown>,
): ProgramClassroomLesson | null {
  const id = readString(row.id ?? row._id);
  const title = readString(row.title ?? row.name);
  if (!id || !title) return null;

  const zoomJoinUrl =
    readString(row.zoomJoinUrl ?? row.zoom_join_url) || undefined;
  const liveSessionUrl =
    readString(row.liveSessionUrl ?? row.live_session_url) ||
    zoomJoinUrl ||
    undefined;

  return {
    id,
    title,
    summary: readString(row.summary) || undefined,
    overview: readString(row.overview) || undefined,
    lessonType: readLessonType(row.lessonType ?? row.lesson_type ?? row.type),
    order: readNumber(row.order ?? row.sortOrder) || undefined,
    isPublished:
      typeof row.isPublished === "boolean" ? row.isPublished : undefined,
    durationMinutes:
      readNumber(row.durationMinutes ?? row.duration_minutes) || undefined,
    liveSessionUrl,
    startsAt: readString(row.startsAt ?? row.starts_at) || undefined,
    recordingUrl:
      readString(row.recordingUrl ?? row.recording_url) || undefined,
    zoomMeetingId:
      readString(row.zoomMeetingId ?? row.zoom_meeting_id) || undefined,
    zoomMeetingUuid:
      readString(row.zoomMeetingUuid ?? row.zoom_meeting_uuid) || undefined,
    zoomJoinUrl,
    zoomStartUrl:
      readString(row.zoomStartUrl ?? row.zoom_start_url) || undefined,
    isLiveNow: Boolean(row.isLiveNow ?? row.is_live_now),
    resources: normalizeLessonResources(row.resources) ?? [],
  };
}

function normalizeModule(
  row: Record<string, unknown>,
): ProgramClassroomModule | null {
  const id = readString(row.id ?? row._id);
  const title = readString(row.title ?? row.name);
  if (!id || !title) return null;

  const lessonRows = Array.isArray(row.lessons) ? row.lessons : [];
  const lessons = lessonRows
    .map((item) =>
      item && typeof item === "object"
        ? normalizeLesson(item as Record<string, unknown>)
        : null,
    )
    .filter((item): item is NonNullable<typeof item> => item !== null);

  return {
    id,
    title,
    description: readString(row.description) || undefined,
    summary: readString(row.summary) || undefined,
    weekLabel: readString(row.weekLabel ?? row.week_label) || undefined,
    moduleType:
      readString(row.moduleType ?? row.module_type ?? row.type) || undefined,
    lessonCount:
      lessons.length || readNumber(row.lessonCount ?? row.lesson_count),
    order: readNumber(row.order ?? row.sortOrder) || undefined,
    lessons,
  };
}

function extractModules(payload: unknown): ProgramClassroomModule[] {
  if (!payload || typeof payload !== "object") return [];

  const root = payload as Record<string, unknown>;
  const data =
    root.data && typeof root.data === "object"
      ? (root.data as Record<string, unknown>)
      : root;
  const classroom =
    data.classroom && typeof data.classroom === "object"
      ? (data.classroom as Record<string, unknown>)
      : data;

  const candidates: unknown[] = [];
  if (Array.isArray(classroom.modules)) candidates.push(...classroom.modules);
  if (Array.isArray(data.modules)) candidates.push(...data.modules);

  return candidates
    .map((item) =>
      item && typeof item === "object"
        ? normalizeModule(item as Record<string, unknown>)
        : null,
    )
    .filter((item): item is ProgramClassroomModule => item !== null);
}

function normalizeStudentClassroom(
  payload: unknown,
): StudentClassroomData | null {
  if (!payload || typeof payload !== "object") return null;

  const root = payload as Record<string, unknown>;
  const data =
    root.data && typeof root.data === "object"
      ? (root.data as Record<string, unknown>)
      : root;

  const programRow =
    data.program && typeof data.program === "object"
      ? (data.program as Record<string, unknown>)
      : ({} as Record<string, unknown>);
  const classroomRow =
    data.classroom && typeof data.classroom === "object"
      ? (data.classroom as Record<string, unknown>)
      : data;

  const programId = readString(programRow?.id ?? programRow?._id);
  const programTitle = readString(programRow?.title ?? programRow?.name);
  if (!programId || !programTitle) return null;

  const modules = extractModules(payload);
  const classroomId =
    readString(classroomRow.id ?? classroomRow._id) || programId;

  const summaryRow =
    data.summary && typeof data.summary === "object"
      ? (data.summary as Record<string, unknown>)
      : {};

  return {
    program: {
      id: programId,
      title: programTitle,
      description: readString(programRow.description) || undefined,
      duration: readString(programRow.duration) || undefined,
      startDate:
        readString(programRow.startDate ?? programRow.start_date) || undefined,
      endDate:
        readString(programRow.endDate ?? programRow.end_date) || undefined,
      cohortName:
        readString(programRow.cohortName ?? programRow.cohort_name) ||
        undefined,
      cohortCode:
        readString(programRow.cohortCode ?? programRow.cohort_code) ||
        undefined,
    },
    classroom: {
      id: classroomId,
      title: readString(classroomRow.title) || programTitle,
      description: readString(classroomRow.description) || undefined,
      status: readString(classroomRow.status) || undefined,
      modules,
    },
    summary: {
      totalLessons:
        readNumber(summaryRow.totalLessons ?? summaryRow.total_lessons) ||
        modules.reduce(
          (total, module) => total + (module.lessons?.length ?? 0),
          0,
        ),
    },
  };
}

function getErrorMessage(error: unknown, fallback: string): string {
  const err = error as {
    response?: { data?: { message?: string }; status?: number };
    message?: string;
  };
  return err.response?.data?.message || err.message || fallback;
}

function buildEmptyClassroom(programId: string): StudentClassroomData {
  return {
    program: {
      id: programId,
      title: "",
    },
    classroom: {
      id: programId,
      title: "",
      modules: [],
    },
    summary: { totalLessons: 0 },
  };
}

function isUnavailableClassroomError(error: unknown): boolean {
  const err = error as {
    response?: {
      status?: number;
      data?: {
        message?: string;
        error_code?: string;
        status?: string;
      };
    };
  };
  const status = err.response?.status;
  const data = err.response?.data;
  const message = (data?.message ?? "").toLowerCase();
  const errorCode = (data?.error_code ?? "").toLowerCase();

  return (
    status === 404 ||
    status === 403 ||
    status === 409 ||
    errorCode === "conflict" ||
    data?.status === "error" ||
    message.includes("not found") ||
    message.includes("does not exist") ||
    message.includes("not published") ||
    message.includes("do not have access") ||
    message.includes("no access")
  );
}

export async function getStudentClassroom(programId: string) {
  const trimmedId = programId.trim();
  if (!trimmedId) {
    return {
      ok: false as const,
      message: "Program id is required.",
    };
  }

  try {
    const res = await axios.get(
      `${API_BASE_URL}/api/v1/students/classroom/${trimmedId}`,
      { headers: authHeaders() },
    );

    const normalized = normalizeStudentClassroom(res.data);
    if (!normalized) {
      return {
        ok: false as const,
        message: "Could not parse classroom response.",
      };
    }

    return {
      ok: true as const,
      data: normalized,
      message: readString((res.data as { message?: string }).message),
    };
  } catch (error: unknown) {
    if (isUnavailableClassroomError(error)) {
      return {
        ok: true as const,
        data: buildEmptyClassroom(trimmedId),
        message: "",
      };
    }

    return {
      ok: false as const,
      message: getErrorMessage(error, "Failed to fetch classroom."),
    };
  }
}

// Backwards-compatible alias used by existing hooks.
export async function getStudentclassroom(programId: string) {
  const res = await getStudentClassroom(programId);
  if (!res.ok) return res;
  return {
    ok: true as const,
    data: res.data,
    message: res.message,
  };
}
