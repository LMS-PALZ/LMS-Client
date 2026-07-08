import type {
  AdminProgram,
  AdminProgramListResponse,
  CreateProgramPayload,
  ProgramApplicantsResponse,
  ProgramApplicant,
  ProgramStatus,
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

function readStringArray(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value.filter((item): item is string => typeof item === "string");
}

function normalizeProgram(row: Record<string, unknown>): AdminProgram | null {
  const id = readString(row.id ?? row._id);
  const title = readString(row.title ?? row.name);
  if (!id || !title) return null;

  return {
    id,
    title,
    slug: readString(row.slug),
    description: readString(row.description),
    category: readString(row.category),
    priceAmount: readNumber(row.priceAmount ?? row.price),
    priceCurrency: readString(row.priceCurrency) || "NGN",
    cohortName: readString(row.cohortName) || undefined,
    cohortCode: readString(row.cohortCode) || undefined,
    cohortStartDate: readString(row.cohortStartDate) || undefined,
    cohortEndDate: readString(row.cohortEndDate) || undefined,
    capacity: readNumber(row.capacity) || undefined,
    status: readString(row.status) || "draft",
    assignedTutorIds: readStringArray(row.assignedTutorIds),
    createdBy: readString(row.createdBy) || undefined,
    updatedBy: readString(row.updatedBy) || undefined,
    createdAt: readString(row.createdAt),
    updatedAt: readString(row.updatedAt),
  };
}

function extractProgramRows(payload: unknown): AdminProgram[] {
  if (!payload || typeof payload !== "object") return [];

  const root = payload as Record<string, unknown>;
  const data = root.data;

  const candidates: unknown[] = [];
  if (Array.isArray(data)) candidates.push(...data);
  if (data && typeof data === "object") {
    const dataObj = data as Record<string, unknown>;
    if (Array.isArray(dataObj.items)) candidates.push(...dataObj.items);
    if (Array.isArray(dataObj.programs)) candidates.push(...dataObj.programs);
  }
  if (Array.isArray(root.items)) candidates.push(...root.items);
  if (Array.isArray(root.programs)) candidates.push(...root.programs);

  return candidates
    .map((item) =>
      item && typeof item === "object"
        ? normalizeProgram(item as Record<string, unknown>)
        : null,
    )
    .filter((item): item is AdminProgram => item !== null);
}

function extractPagination(
  payload: unknown,
): AdminProgramListResponse["pagination"] {
  const fallback = {
    page: 1,
    limit: 10,
    offset: 0,
    total: 0,
    totalPages: 0,
    hasNextPage: false,
    hasPreviousPage: false,
  };

  if (!payload || typeof payload !== "object") return fallback;

  const root = payload as Record<string, unknown>;
  const data = root.data;
  const pagination =
    data && typeof data === "object"
      ? (data as Record<string, unknown>).pagination
      : root.pagination;

  if (!pagination || typeof pagination !== "object") return fallback;

  const pageInfo = pagination as Record<string, unknown>;
  return {
    page: readNumber(pageInfo.page) || 1,
    limit: readNumber(pageInfo.limit) || 10,
    offset: readNumber(pageInfo.offset),
    total: readNumber(pageInfo.total),
    totalPages: readNumber(pageInfo.totalPages),
    hasNextPage: Boolean(pageInfo.hasNextPage),
    hasPreviousPage: Boolean(pageInfo.hasPreviousPage),
  };
}

function extractProgram(payload: unknown): AdminProgram | null {
  if (!payload || typeof payload !== "object") return null;

  const root = payload as Record<string, unknown>;
  const data = root.data;

  if (data && typeof data === "object" && !Array.isArray(data)) {
    return normalizeProgram(data as Record<string, unknown>);
  }

  return normalizeProgram(root);
}

function getErrorMessage(error: unknown, fallback: string): string {
  const err = error as {
    response?: { data?: { message?: string } };
    message?: string;
  };
  return err.response?.data?.message || err.message || fallback;
}

export async function listAdminPrograms(params?: {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
}) {
  try {
    const token = getStoredAuthToken();
    if (!token) {
      return {
        ok: false as const,
        message: "You are not signed in. Please log in again.",
      };
    }

    const query: Record<string, string | number> = {
      page: params?.page ?? 1,
      limit: params?.limit ?? 50,
    };

    if (params?.search?.trim()) query.search = params.search.trim();
    if (params?.status && params.status !== "All statuses") {
      query.status = params.status.toLowerCase();
    }

    const res = await axios.get(`${API_BASE_URL}/api/v1/programs`, {
      params: query,
      headers: authHeaders(),
    });

    const items = extractProgramRows(res.data);
    const pagination = extractPagination(res.data);
    pagination.total = pagination.total || items.length;

    return {
      ok: true as const,
      data: { items, pagination } satisfies AdminProgramListResponse,
      message: readString((res.data as { message?: string }).message),
    };
  } catch (error: unknown) {
    return {
      ok: false as const,
      message: getErrorMessage(error, "Failed to fetch courses."),
    };
  }
}

export async function getAdminProgram(programId: string) {
  try {
    const trimmedId = programId.trim();
    if (!trimmedId) {
      return {
        ok: false as const,
        message: "Course not found.",
      };
    }

    const listRes = await listAdminPrograms({ page: 1, limit: 100 });
    if (!listRes.ok) {
      return {
        ok: false as const,
        message: listRes.message,
      };
    }

    const program = listRes.data.items.find((item) => item.id === trimmedId);
    if (!program) {
      return {
        ok: false as const,
        message: "Course not found.",
      };
    }

    return {
      ok: true as const,
      data: program,
      message: "",
    };
  } catch (error: unknown) {
    return {
      ok: false as const,
      message: getErrorMessage(error, "Failed to fetch course."),
    };
  }
}

export async function createAdminProgram(payload: CreateProgramPayload) {
  try {
    const body: CreateProgramPayload = {
      ...payload,
      priceAmount: Number(payload.priceAmount),
      capacity: Number(payload.capacity),
    };

    if (!Number.isFinite(body.priceAmount) || body.priceAmount <= 0) {
      return {
        ok: false as const,
        message: "Price must be a valid number greater than zero.",
      };
    }

    if (!Number.isFinite(body.capacity) || body.capacity <= 0) {
      return {
        ok: false as const,
        message: "Capacity must be a valid number greater than zero.",
      };
    }

    const res = await axios.post(
      `${API_BASE_URL}/api/v1/programs/create`,
      body,
      {
        headers: authHeaders(),
      },
    );

    const program = extractProgram(res.data);
    if (!program) {
      return {
        ok: false as const,
        message: "Course was created but the response was invalid.",
      };
    }

    return {
      ok: true as const,
      data: program,
      message: readString((res.data as { message?: string }).message),
    };
  } catch (error: unknown) {
    return {
      ok: false as const,
      message: getErrorMessage(error, "Failed to create course."),
    };
  }
}

export async function updateAdminProgramStatus(
  programId: string,
  status: ProgramStatus,
) {
  try {
    const res = await axios.patch(
      `${API_BASE_URL}/api/v1/programs/${programId}/status`,
      { status },
      { headers: authHeaders() },
    );

    const program = extractProgram(res.data);
    if (!program) {
      return {
        ok: false as const,
        message: "Course status was updated but the response was invalid.",
      };
    }

    return {
      ok: true as const,
      data: program,
      message: readString((res.data as { message?: string }).message),
    };
  } catch (error: unknown) {
    return {
      ok: false as const,
      message: getErrorMessage(error, "Failed to update course status."),
    };
  }
}

export async function assignAdminProgramTutors(
  programId: string,
  tutorIds: string[],
) {
  try {
    const uniqueTutorIds = [
      ...new Set(tutorIds.map((id) => id.trim()).filter(Boolean)),
    ];
    if (uniqueTutorIds.length === 0) {
      return {
        ok: false as const,
        message: "At least one tutor id is required.",
      };
    }

    const res = await axios.patch(
      `${API_BASE_URL}/api/v1/programs/${programId}/tutors`,
      { tutorIds: uniqueTutorIds },
      { headers: authHeaders() },
    );

    const program = extractProgram(res.data);
    if (!program) {
      return {
        ok: false as const,
        message: "Tutors were assigned but the response was invalid.",
      };
    }

    return {
      ok: true as const,
      data: program,
      message: readString((res.data as { message?: string }).message),
    };
  } catch (error: unknown) {
    return {
      ok: false as const,
      message: getErrorMessage(error, "Failed to assign tutors to course."),
    };
  }
}

function normalizeApplicant(
  row: Record<string, unknown>,
): ProgramApplicant | null {
  const id = readString(row.id ?? row._id);
  const studentName = readString(row.studentName ?? row.name);
  if (!id || !studentName) return null;

  return {
    id,
    programId: readString(row.programId),
    studentName,
    studentEmail: readString(row.studentEmail ?? row.email),
    studentPhoneNumber:
      readString(row.studentPhoneNumber ?? row.phoneNumber) || null,
    motivation: readString(row.motivation) || null,
    status: readString(row.status) || "pending",
    reviewedBy: readString(row.reviewedBy) || null,
    reviewedAt: readString(row.reviewedAt) || null,
    createdAt: readString(row.createdAt),
    updatedAt: readString(row.updatedAt),
  };
}

function extractApplicants(payload: unknown): ProgramApplicantsResponse {
  const empty: ProgramApplicantsResponse = {
    items: [],
    pagination: {
      page: 1,
      limit: 10,
      offset: 0,
      total: 0,
      totalPages: 0,
      hasNextPage: false,
      hasPreviousPage: false,
    },
  };

  if (!payload || typeof payload !== "object") return empty;

  const root = payload as Record<string, unknown>;
  const data =
    root.data && typeof root.data === "object"
      ? (root.data as Record<string, unknown>)
      : root;

  const candidates: unknown[] = [];
  if (Array.isArray(data.applicants)) candidates.push(...data.applicants);
  if (Array.isArray(data.items)) candidates.push(...data.items);

  const items = candidates
    .map((item) =>
      item && typeof item === "object"
        ? normalizeApplicant(item as Record<string, unknown>)
        : null,
    )
    .filter((item): item is ProgramApplicant => item !== null);

  const paginationRaw =
    data.pagination && typeof data.pagination === "object"
      ? (data.pagination as Record<string, unknown>)
      : {};

  const total = readNumber(paginationRaw.total) || items.length;
  const limit = readNumber(paginationRaw.limit) || 10;
  const page = readNumber(paginationRaw.page) || 1;
  const totalPages =
    readNumber(paginationRaw.totalPages) || Math.ceil(total / limit) || 0;

  return {
    items,
    pagination: {
      page,
      limit,
      offset: readNumber(paginationRaw.offset),
      total,
      totalPages,
      hasNextPage: Boolean(paginationRaw.hasNextPage),
      hasPreviousPage: Boolean(paginationRaw.hasPreviousPage),
    },
  };
}

export async function getProgramApplicants(
  programId: string,
  params?: { page?: number; limit?: number },
) {
  const trimmedId = programId.trim();
  if (!trimmedId) {
    return {
      ok: false as const,
      message: "Course id is required.",
    };
  }

  try {
    const res = await axios.get(
      `${API_BASE_URL}/api/v1/programs/${trimmedId}/applicants`,
      {
        headers: authHeaders(),
        params: {
          page: params?.page ?? 1,
          limit: params?.limit ?? 10,
        },
      },
    );

    return {
      ok: true as const,
      data: extractApplicants(res.data),
      message: readString((res.data as { message?: string }).message),
    };
  } catch (error: unknown) {
    return {
      ok: false as const,
      message: getErrorMessage(error, "Failed to fetch enrolled students."),
    };
  }
}
