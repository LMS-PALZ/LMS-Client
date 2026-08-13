import type { AssignmentListItem, AssignmentStatus } from "@ssu/types";
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

function readNumber(value: unknown): number | undefined {
  if (typeof value === "number" && !Number.isNaN(value)) return value;
  if (typeof value === "string" && value.trim() !== "") {
    const parsed = Number(value);
    if (!Number.isNaN(parsed)) return parsed;
  }
  return undefined;
}

function extractRows(payload: unknown): Record<string, unknown>[] {
  if (!payload || typeof payload !== "object") return [];
  const root = payload as Record<string, unknown>;
  const data = root.data;

  if (Array.isArray(data)) {
    return data.filter(
      (item): item is Record<string, unknown> =>
        Boolean(item) && typeof item === "object",
    );
  }

  if (data && typeof data === "object") {
    const dataObj = data as Record<string, unknown>;
    for (const key of ["items", "assessments", "submissions", "grades"]) {
      if (Array.isArray(dataObj[key])) {
        return (dataObj[key] as unknown[]).filter(
          (item): item is Record<string, unknown> =>
            Boolean(item) && typeof item === "object",
        );
      }
    }
  }

  return [];
}

function mapStatus(value: string): AssignmentStatus {
  const normalized = value.toLowerCase();
  if (
    normalized.includes("grade") ||
    normalized === "recorded" ||
    normalized.includes("recorded") ||
    normalized === "scored" ||
    normalized === "marked"
  ) {
    return "graded";
  }
  if (normalized.includes("submit") || normalized.includes("pending")) {
    return "submitted";
  }
  if (normalized.includes("overdue") || normalized.includes("miss")) {
    return "overdue";
  }
  if (normalized.includes("progress") || normalized.includes("todo")) {
    return "not-started";
  }
  return "not-started";
}

function mapAssessmentRow(
  row: Record<string, unknown>,
  submission?: Record<string, unknown>,
): AssignmentListItem | null {
  const assessment =
    row.assessment && typeof row.assessment === "object"
      ? (row.assessment as Record<string, unknown>)
      : row;

  const id = readString(
    assessment.id ?? assessment._id ?? row.assessmentId ?? row.id,
  );
  const title = readString(assessment.title ?? assessment.name ?? row.title);
  if (!id || !title) return null;

  const statusRaw = readString(
    row.status ?? submission?.status ?? assessment.status ?? "not-started",
  );
  const score =
    readNumber(row.score ?? submission?.score ?? row.grade) ??
    readNumber(assessment.score);

  return {
    id,
    title,
    courseId: readString(assessment.classroomId ?? assessment.programId) || id,
    courseName:
      readString(assessment.moduleLabel ?? assessment.moduleName) ||
      readString(assessment.courseName) ||
      "Course module",
    moduleLabel:
      readString(assessment.moduleLabel ?? assessment.moduleName) || undefined,
    dueAt:
      readString(assessment.dueAt ?? assessment.dueDate ?? assessment.due_at) ||
      new Date().toISOString(),
    status: mapStatus(statusRaw),
    weightPercent:
      readNumber(assessment.weightPercent ?? assessment.weight_percent) ??
      readNumber(assessment.weight),
    scoreDisplay:
      score !== undefined ? `${score}%` : readString(row.scoreDisplay) || "N/A",
  };
}

function getErrorMessage(error: unknown, fallback: string): string {
  const err = error as {
    response?: { data?: { message?: string } };
    message?: string;
  };
  return err.response?.data?.message || err.message || fallback;
}

export async function getStudentAssessments(classroomId: string) {
  const trimmedId = classroomId.trim();
  if (!trimmedId) {
    return { ok: true as const, data: [] as AssignmentListItem[], message: "" };
  }

  try {
    const res = await axios.get(
      `${API_BASE_URL}/api/v1/students/assessment/${trimmedId}`,
      { headers: authHeaders() },
    );

    const items = extractRows(res.data)
      .map((row) => mapAssessmentRow(row))
      .filter((item): item is AssignmentListItem => item !== null);

    return {
      ok: true as const,
      data: items,
      message: readString((res.data as { message?: string }).message),
    };
  } catch (error: unknown) {
    return {
      ok: false as const,
      message: getErrorMessage(error, "Failed to fetch assessments."),
    };
  }
}

export async function getStudentAssessmentGrades(classroomId: string) {
  const trimmedId = classroomId.trim();
  if (!trimmedId) {
    return { ok: true as const, data: [] as AssignmentListItem[], message: "" };
  }

  try {
    const res = await axios.get(
      `${API_BASE_URL}/api/v1/students/assessments/grades/${trimmedId}`,
      { headers: authHeaders() },
    );

    const items = extractRows(res.data)
      .map((row) => mapAssessmentRow(row, row))
      .filter((item): item is AssignmentListItem => item !== null);

    return {
      ok: true as const,
      data: items,
      message: readString((res.data as { message?: string }).message),
    };
  } catch (error: unknown) {
    return {
      ok: false as const,
      message: getErrorMessage(error, "Failed to fetch assessment grades."),
    };
  }
}

function parseScoreDisplay(scoreDisplay?: string): number | null {
  if (!scoreDisplay || scoreDisplay.trim().toUpperCase() === "N/A") return null;
  const match = scoreDisplay.match(/([\d.]+)/);
  if (!match) return null;
  const value = Number(match[1]);
  return Number.isFinite(value) ? value : null;
}

export function calculateOverallScorePercent(
  assignments: AssignmentListItem[],
): number {
  const scored = assignments
    .map((item) => parseScoreDisplay(item.scoreDisplay))
    .filter((value): value is number => value !== null);

  if (scored.length === 0) return 0;

  const total = scored.reduce((sum, value) => sum + value, 0);
  return Math.round(total / scored.length);
}
