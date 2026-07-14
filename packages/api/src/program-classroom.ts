import type {
  ClassroomLessonType,
  ProgramClassroomLesson,
  ProgramClassroomModule,
  ProgramClassroomSummary,
  UpsertProgramClassroomPayload,
} from "@ssu/types";
import axios from "axios";
import { getStoredAuthToken } from "./student-login";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  "https://base-api.skillscaleup.org";

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
    resources: normalizeLessonResources(row.resources),
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
    .filter((item): item is ProgramClassroomLesson => item !== null);

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

function extractModuleRows(payload: unknown): ProgramClassroomModule[] {
  if (!payload || typeof payload !== "object") return [];

  const root = payload as Record<string, unknown>;
  const data = root.data;
  const candidates: unknown[] = [];

  if (Array.isArray(root.modules)) candidates.push(...root.modules);
  if (data && typeof data === "object") {
    const dataObj = data as Record<string, unknown>;
    if (Array.isArray(dataObj.modules)) candidates.push(...dataObj.modules);
    if (Array.isArray(dataObj.items)) candidates.push(...dataObj.items);

    const classroom = dataObj.classroom;
    if (classroom && typeof classroom === "object") {
      const classroomObj = classroom as Record<string, unknown>;
      if (Array.isArray(classroomObj.modules)) {
        candidates.push(...classroomObj.modules);
      }
    }
  }

  return candidates
    .map((item) =>
      item && typeof item === "object"
        ? normalizeModule(item as Record<string, unknown>)
        : null,
    )
    .filter((item): item is ProgramClassroomModule => item !== null);
}

function getErrorMessage(error: unknown, fallback: string): string {
  const err = error as {
    response?: { data?: { message?: string }; status?: number };
    message?: string;
  };
  return err.response?.data?.message || err.message || fallback;
}

function isMissingClassroomError(error: unknown): boolean {
  const err = error as {
    response?: { status?: number; data?: { message?: string } };
  };
  const status = err.response?.status;
  const message = (err.response?.data?.message ?? "").toLowerCase();

  return (
    status === 404 ||
    message.includes("not found") ||
    message.includes("does not exist")
  );
}

export async function getProgramClassroomModules(programId: string) {
  const trimmedId = programId.trim();
  if (!trimmedId) {
    return {
      ok: false as const,
      message: "Course id is required.",
    };
  }

  try {
    const res = await axios.get(
      `${API_BASE_URL}/api/v1/tutors/programs/${trimmedId}/classroom/modules`,
      { headers: authHeaders() },
    );

    return {
      ok: true as const,
      data: extractModuleRows(res.data),
      message: readString((res.data as { message?: string }).message),
    };
  } catch (error: unknown) {
    if (isMissingClassroomError(error)) {
      return {
        ok: true as const,
        data: [] as ProgramClassroomModule[],
        message: "",
      };
    }

    return {
      ok: false as const,
      message: getErrorMessage(error, "Failed to fetch course modules."),
    };
  }
}

export async function getProgramClassroom(programId: string) {
  const trimmedId = programId.trim();
  if (!trimmedId) {
    return {
      ok: false as const,
      message: "Course id is required.",
    };
  }

  try {
    const res = await axios.get(
      `${API_BASE_URL}/api/v1/tutors/programs/${trimmedId}/classroom`,
      { headers: authHeaders() },
    );

    const root = res.data as Record<string, unknown>;
    const data =
      root.data && typeof root.data === "object"
        ? (root.data as Record<string, unknown>)
        : root;
    const classroom =
      data.classroom && typeof data.classroom === "object"
        ? (data.classroom as Record<string, unknown>)
        : data;

    const modules = extractModuleRows(res.data);

    const summary: ProgramClassroomSummary = {
      id: readString(classroom.id) || undefined,
      title: readString(classroom.title) || undefined,
      description: readString(classroom.description) || undefined,
      status:
        readString(classroom.status) === "published" ? "published" : "draft",
      modules,
    };

    return {
      ok: true as const,
      data: summary,
      message: readString(root.message),
    };
  } catch (error: unknown) {
    if (isMissingClassroomError(error)) {
      return {
        ok: true as const,
        data: { modules: [] } satisfies ProgramClassroomSummary,
        message: "",
      };
    }

    return {
      ok: false as const,
      message: getErrorMessage(error, "Failed to fetch course classroom."),
    };
  }
}

export async function upsertProgramClassroom(
  programId: string,
  payload: UpsertProgramClassroomPayload,
) {
  const trimmedId = programId.trim();
  if (!trimmedId) {
    return {
      ok: false as const,
      message: "Course id is required.",
    };
  }

  try {
    const res = await axios.put(
      `${API_BASE_URL}/api/v1/tutors/programs/${trimmedId}/classroom`,
      payload,
      { headers: authHeaders() },
    );

    const root = res.data as Record<string, unknown>;
    const data =
      root.data && typeof root.data === "object"
        ? (root.data as Record<string, unknown>)
        : root;
    const classroom =
      data.classroom && typeof data.classroom === "object"
        ? (data.classroom as Record<string, unknown>)
        : data;

    const summary: ProgramClassroomSummary = {
      id: readString(classroom.id) || undefined,
      title: readString(classroom.title) || undefined,
      description: readString(classroom.description) || undefined,
      status:
        readString(classroom.status) === "published" ? "published" : "draft",
      modules: extractModuleRows(res.data),
    };

    return {
      ok: true as const,
      data: summary,
      message: readString(root.message),
    };
  } catch (error: unknown) {
    return {
      ok: false as const,
      message: getErrorMessage(error, "Failed to save course content."),
    };
  }
}
