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

function readIdList(value: unknown): string[] {
  if (!Array.isArray(value)) return [];

  const ids: string[] = [];
  for (const item of value) {
    if (typeof item === "string" && item.trim()) {
      ids.push(item.trim());
      continue;
    }
    if (item && typeof item === "object") {
      const row = item as Record<string, unknown>;
      const id = readString(row.id ?? row._id ?? row.tutorId ?? row.userId);
      if (id) ids.push(id);
    }
  }
  return ids;
}

function readAssignedTutorIds(row: Record<string, unknown>): string[] {
  const fromIds = readIdList(
    row.assignedTutorIds ??
      row.assigned_tutor_ids ??
      row.tutorIds ??
      row.tutor_ids,
  );
  if (fromIds.length > 0) return fromIds;

  return readIdList(
    row.assignedTutors ?? row.assigned_tutors ?? row.tutors ?? row.instructors,
  );
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
    assignedTutorIds: readAssignedTutorIds(row),
    createdBy: readString(row.createdBy) || undefined,
    updatedBy: readString(row.updatedBy) || undefined,
    createdAt: readString(row.createdAt),
    updatedAt: readString(row.updatedAt),
  };
}

/** Programs assigned to a tutor — matches flexible id shapes from API/login. */
export function filterProgramsForTutor(
  programs: AdminProgram[],
  tutorIdentity: { id?: string; email?: string; accessToken?: string },
): AdminProgram[] {
  const candidateIds = new Set<string>();
  const id = tutorIdentity.id?.trim();
  const email = tutorIdentity.email?.trim().toLowerCase();
  if (id) candidateIds.add(id);

  if (tutorIdentity.accessToken) {
    try {
      const payloadPart = tutorIdentity.accessToken.split(".")[1];
      if (payloadPart) {
        const json = JSON.parse(
          atob(payloadPart.replace(/-/g, "+").replace(/_/g, "/")),
        ) as Record<string, unknown>;
        for (const key of [
          "sub",
          "id",
          "_id",
          "userId",
          "user_id",
          "tutorId",
          "tutor_id",
          "adminId",
          "staffId",
        ]) {
          const value = json[key];
          if (typeof value === "string" && value.trim()) {
            candidateIds.add(value.trim());
          }
        }
      }
    } catch {
      /* ignore invalid token payloads */
    }
  }

  const matched = programs.filter((program) => {
    if (program.assignedTutorIds.some((tutorId) => candidateIds.has(tutorId))) {
      return true;
    }
    if (
      email &&
      program.assignedTutorIds.some(
        (tutorId) => tutorId.toLowerCase() === email,
      )
    ) {
      return true;
    }
    return false;
  });

  // Backend often already scopes GET /programs to the tutor. If we can't match
  // ids (format mismatch) but courses were returned, treat them as assigned.
  if (matched.length === 0 && programs.length > 0 && candidateIds.size > 0) {
    const anyProgramHasTutors = programs.some(
      (program) => program.assignedTutorIds.length > 0,
    );
    if (!anyProgramHasTutors) return programs;
  }

  if (matched.length === 0 && programs.length > 0 && candidateIds.size === 0) {
    return programs;
  }

  return matched;
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

function isMissingRouteError(error: unknown): boolean {
  const err = error as {
    response?: { status?: number; data?: { message?: string } };
  };
  const status = err.response?.status;
  const message = (err.response?.data?.message ?? "").toLowerCase();
  return (
    status === 404 &&
    (message.includes("does not exist") || message.includes("not found"))
  );
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

/**
 * Portal program list — always uses GET /api/v1/programs.
 * Tutors: optionally filter client-side to programs where they are assigned.
 */
export async function listPortalPrograms(
  params?: {
    page?: number;
    limit?: number;
    search?: string;
    status?: string;
  },
  options?: {
    asTutor?: boolean;
    tutorUserId?: string;
    tutorEmail?: string;
    accessToken?: string;
  },
) {
  const res = await listAdminPrograms(params);
  if (!res.ok) return res;

  if (options?.asTutor) {
    const items = filterProgramsForTutor(res.data.items, {
      id: options.tutorUserId,
      email: options.tutorEmail,
      accessToken: options.accessToken,
    });
    return {
      ok: true as const,
      data: {
        items,
        pagination: {
          ...res.data.pagination,
          total: items.length,
          totalPages: items.length > 0 ? 1 : 0,
          hasNextPage: false,
          hasPreviousPage: false,
        },
      } satisfies AdminProgramListResponse,
      message: res.message,
    };
  }

  return res;
}

async function getTutorProgramFromClassroom(
  programId: string,
): Promise<
  | { ok: true; data: AdminProgram; message: string }
  | { ok: false; message: string }
> {
  try {
    const res = await axios.get(
      `${API_BASE_URL}/api/v1/tutors/programs/${programId}/classroom`,
      { headers: authHeaders() },
    );

    const root = res.data as Record<string, unknown>;
    const data =
      root.data && typeof root.data === "object"
        ? (root.data as Record<string, unknown>)
        : root;
    const programRow =
      data.program && typeof data.program === "object"
        ? (data.program as Record<string, unknown>)
        : null;

    const program = programRow ? normalizeProgram(programRow) : null;
    if (!program) {
      return {
        ok: false as const,
        message: "Course not found.",
      };
    }

    return {
      ok: true as const,
      data: program,
      message: readString(root.message),
    };
  } catch (error: unknown) {
    if (isMissingRouteError(error)) {
      try {
        const res = await axios.get(
          `${API_BASE_URL}/api/v1/tutors/programs/${programId}/classroom/modules`,
          { headers: authHeaders() },
        );
        const root = res.data as Record<string, unknown>;
        const data =
          root.data && typeof root.data === "object"
            ? (root.data as Record<string, unknown>)
            : root;
        const programRow =
          data.program && typeof data.program === "object"
            ? (data.program as Record<string, unknown>)
            : null;
        const program = programRow ? normalizeProgram(programRow) : null;
        if (program) {
          return {
            ok: true as const,
            data: program,
            message: readString(root.message),
          };
        }
      } catch {
        /* fall through */
      }
    }

    return {
      ok: false as const,
      message: getErrorMessage(error, "Failed to fetch course."),
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
    if (listRes.ok) {
      const program = listRes.data.items.find((item) => item.id === trimmedId);
      if (program) {
        return {
          ok: true as const,
          data: program,
          message: "",
        };
      }
    }

    // Tutors cannot list all programs — resolve via assigned classroom APIs.
    const tutorRes = await getTutorProgramFromClassroom(trimmedId);
    if (tutorRes.ok) {
      return tutorRes;
    }

    return {
      ok: false as const,
      message: listRes.ok ? "Course not found." : listRes.message,
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
