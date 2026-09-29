import type { AuthUser } from "@ssu/types";
import axios from "axios";
import {
  clearPortalAuthStorage,
  readPortalSessionRaw,
  writePortalSessionRaw,
  writePortalTokenRaw,
} from "./auth-portal";
import {
  appendProfileFormData,
  formatProfileDob,
  formatProfileEmploymentStatus,
  formatProfileGender,
} from "./profile-payload";
import { clearProfileSetupDismissed } from "./student-profile";
import {
  getStoredAuthToken,
  parseAdminLoginResponse,
  parseStudentLoginResponse,
  type StudentLoginResult,
} from "./student-login";

export {
  getAuthPortal,
  getAuthTokenStorageKey,
  getSessionStorageKey,
  setAuthPortal,
  writePortalTokenRaw,
  type AuthPortal,
} from "./auth-portal";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  "https://base-api.skillscaleup.org";

export type LoginErrorCode = "invalid" | "pending_approval" | "suspended";

export async function login(
  email: string,
  password: string,
): Promise<StudentLoginResult> {
  try {
    const url = `${API_BASE_URL}/api/v1/students/auth/login`;

    const res = await axios.post(url, { email, password });
    const body = res.data as {
      status?: boolean;
      message?: string;
      code?: string;
    };

    if (body?.status === false) {
      return {
        ok: false,
        code: (body.code as LoginErrorCode) || "invalid",
        message: body.message ?? "Login failed. Please try again.",
      };
    }

    const parsed = parseStudentLoginResponse(res.data);
    if (!parsed) {
      return {
        ok: false,
        code: "invalid",
        message:
          body?.message ??
          "Login response was invalid. Please contact support.",
      };
    }

    return parsed;
  } catch (error: unknown) {
    const err = error as {
      response?: { data?: { code?: string; message?: string } };
      message?: string;
    };
    return {
      ok: false,
      code: (err.response?.data?.code as LoginErrorCode) || "invalid",
      message:
        err.response?.data?.message ||
        err.message ||
        "Login failed. Please try again.",
    };
  }
}

export type InviteStaffErrorCode =
  | "invalid"
  | "duplicate_email"
  | "server_error";

export async function inviteStaff(data: {
  email: string;
  name: string;
  role: string;
}): Promise<
  | { ok: true; data: any; message: string }
  | { ok: false; code: InviteStaffErrorCode; message: string }
> {
  try {
    const token = getStoredAuthToken();
    if (!token) {
      return {
        ok: false,
        code: "invalid",
        message: "You are not signed in. Please log in again.",
      };
    }

    const res = await axios.post(
      `${API_BASE_URL}/api/v1/admins/invitations`,
      data,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    return {
      ok: true,
      data: res.data.data,
      message: res.data.message || "Invitation sent successfully",
    };
  } catch (error: any) {
    return {
      ok: false,
      code: error.response?.data?.code || "invalid",
      message:
        error.response?.data?.message ||
        error.message ||
        "Failed to send invitation. Please try again.",
    };
  }
}

export async function acceptinvite(data: {
  email: string;
  token: string;
  password: string;
}): Promise<
  | { ok: true; data: any; message: string }
  | { ok: false; code: InviteStaffErrorCode; message: string }
> {
  try {
    const res = await axios.post(
      `${API_BASE_URL}/api/v1/admins/auth/invitations/accept`,
      {
        email: data.email,
        password: data.password,
        token: data.token,
      },
    );

    return {
      ok: true,
      data: res.data.data,
      message: res.data.message || "Invitation accepted successfully",
    };
  } catch (error: any) {
    return {
      ok: false,
      code: error.response?.data?.code || "invalid",
      message:
        error.response?.data?.message ||
        error.message ||
        "Failed to accept invitation.",
    };
  }
}

export type SignupErrorCode =
  | "email_exists"
  | "validation_error"
  | "invalid"
  | "server_error"
  | "pending_approval"
  | "payment_required";

export type SignupConflictData = {
  hasMadePayment: boolean;
  email?: string;
  programId?: string;
};

export async function signupStudent(input: {
  first_name: string;
  last_name: string;
  email: string;
  phone_number: string;
  program: string;
}): Promise<
  | { status: true; message: string; data: AuthUser }
  | {
      status: false;
      code: SignupErrorCode;
      message: string;
      data?: SignupConflictData;
    }
> {
  try {
    const url = `${API_BASE_URL}/api/v1/students/auth/signup`;

    const res = await axios.post(url, input);

    return res.data;
  } catch (error: unknown) {
    const err = error as {
      response?: {
        status?: number;
        data?: {
          message?: string;
          error_code?: string;
          data?: {
            hasMadePayment?: boolean;
            email?: string;
            programId?: string;
          };
        };
      };
      message?: string;
    };

    const responseData = err.response?.data;
    const conflictData = responseData?.data;
    const errorCode = (responseData?.error_code ?? "").toLowerCase();
    const unpaidConflict =
      err.response?.status === 409 &&
      errorCode === "conflict" &&
      conflictData?.hasMadePayment === false;

    if (unpaidConflict) {
      return {
        status: false,
        code: "payment_required",
        message:
          responseData?.message ||
          "A student with this email already exists, but payment has not been made yet.",
        data: {
          hasMadePayment: false,
          email:
            typeof conflictData?.email === "string"
              ? conflictData.email
              : undefined,
          programId:
            typeof conflictData?.programId === "string"
              ? conflictData.programId
              : undefined,
        },
      };
    }

    return {
      status: false,
      code: "server_error",
      message:
        responseData?.message ||
        err.message ||
        "Signup failed. Please try again.",
    };
  }
}

export type ResetPasswordErrorCode = "invalid" | "server_error";

export async function resetPassword(
  email: string,
  password: string,
): Promise<
  | { ok: true; message: string }
  | { ok: false; code: ResetPasswordErrorCode; message: string }
> {
  try {
    const url = `${API_BASE_URL}/api/v1/auth/reset`;

    await axios.post(url, { email, password });

    return {
      ok: true,
      message: "Password reset successful",
    };
  } catch (error: unknown) {
    const err = error as {
      response?: { data?: { code?: string; message?: string } };
      message?: string;
    };
    return {
      ok: false,
      code:
        (err.response?.data?.code as ResetPasswordErrorCode) || "server_error",
      message:
        err.response?.data?.message ||
        err.message ||
        "Reset password failed. Please try again.",
    };
  }
}

export type ForgetPasswordErrorCode =
  | "invalid"
  | "server_error"
  | "payment_required";

function isUnpaidPasswordRecoveryMessage(message: string): boolean {
  const normalized = message.toLowerCase();
  if (!normalized.includes("payment")) return false;
  return (
    normalized.includes("completed payment") ||
    normalized.includes("complete payment") ||
    normalized.includes("pending") ||
    normalized.includes("failed") ||
    normalized.includes("not been made") ||
    normalized.includes("incomplete") ||
    normalized.includes("uncompleted") ||
    normalized.includes("unpaid")
  );
}

export async function forgetPassword(
  email: string,
): Promise<
  | { ok: true; message: string }
  | { ok: false; code: ForgetPasswordErrorCode; message: string }
> {
  try {
    const url = `${API_BASE_URL}/api/v1/auth/forget`;

    await axios.post(url, { email });

    return {
      ok: true,
      message: "Check your email to reset your password",
    };
  } catch (error: unknown) {
    const err = error as {
      response?: {
        data?: {
          code?: string;
          error_code?: string;
          message?: string;
        };
      };
      message?: string;
    };
    const responseData = err.response?.data;
    const message =
      responseData?.message ||
      err.message ||
      "Forget password failed. Please try again.";
    const rawCode = (
      responseData?.error_code ||
      responseData?.code ||
      ""
    ).toLowerCase();
    const paymentRequired =
      rawCode === "payment_required" ||
      rawCode === "payment_pending" ||
      rawCode === "payment_failed" ||
      rawCode === "incomplete_payment" ||
      isUnpaidPasswordRecoveryMessage(message);

    return {
      ok: false,
      code: paymentRequired
        ? "payment_required"
        : (responseData?.code as ForgetPasswordErrorCode) || "invalid",
      message,
    };
  }
}

export type VerifyEmailErrorCode = "invalid" | "server_error";

export async function verifyStudentEmail(
  email: string,
  otp: string,
): Promise<
  | { ok: true; message: string }
  | { ok: false; code: VerifyEmailErrorCode; message: string }
> {
  try {
    const url = `${API_BASE_URL}/api/v1/students/auth/verify`;

    await axios.post(url, {
      email,
      otp,
    });

    return {
      ok: true,
      message: "Email verified successfully",
    };
  } catch (error: unknown) {
    const err = error as {
      response?: { data?: { code?: string; message?: string } };
      message?: string;
    };
    return {
      ok: false,
      code: (err.response?.data?.code as VerifyEmailErrorCode) || "invalid",
      message:
        err.response?.data?.message ||
        err.message ||
        "Email verification failed. Please try again.",
    };
  }
}

export type ResendOtpErrorCode = "invalid" | "server_error";

export async function resendOtp(
  email: string,
): Promise<
  | { ok: true; message: string }
  | { ok: false; code: ResendOtpErrorCode; message: string }
> {
  try {
    const url = `${API_BASE_URL}/api/v1/students/auth/resend`;

    await axios.post(url, { email });

    return {
      ok: true,
      message: "OTP resent successfully",
    };
  } catch (error: unknown) {
    const err = error as {
      response?: { data?: { code?: string; message?: string } };
      message?: string;
    };
    return {
      ok: false,
      code: (err.response?.data?.code as ResendOtpErrorCode) || "invalid",
      message:
        err.response?.data?.message ||
        err.message ||
        "Resend OTP failed. Please try again.",
    };
  }
}

export type SetPasswordErrorCode = "invalid" | "server_error";

export async function setPassword(
  email: string,
  password: string,
): Promise<
  | { ok: true; message: string }
  | { ok: false; code: SetPasswordErrorCode; message: string }
> {
  try {
    const url = `${API_BASE_URL}/api/v1/students/auth/password`;

    await axios.post(url, { email, password });

    return {
      ok: true,
      message: "Password set successfully",
    };
  } catch (error: unknown) {
    const err = error as {
      response?: { data?: { code?: string; message?: string } };
      message?: string;
    };
    return {
      ok: false,
      code: (err.response?.data?.code as SetPasswordErrorCode) || "invalid",
      message:
        err.response?.data?.message ||
        err.message ||
        "Set password failed. Please try again.",
    };
  }
}

export async function programslist(): Promise<
  | {
      status: "success";
      message: string;
      data: {
        items: {
          id: string;
          title: string;
          slug: string;
          priceAmount: number;
        }[];
      };
    }
  | {
      status: "error";
      message: string;
    }
> {
  try {
    const url = `${API_BASE_URL}/api/v1/programs/available`;

    const res = await axios.get(url);

    return {
      status: "success",
      message: res.data.message,
      data: res.data.data,
    };
  } catch (error: unknown) {
    const err = error as { message?: string };
    return {
      status: "error",
      message: err.message || "Failed to fetch programs. Please try again.",
    };
  }
}

export async function adminlogin(
  email: string,
  password: string,
): Promise<
  | { ok: true; data: AuthUser; message: string }
  | { ok: false; code: LoginErrorCode; message: string }
> {
  try {
    const url = `${API_BASE_URL}/api/v1/admins/auth/login`;

    const res = await axios.post(url, { email, password });
    const parsed = parseAdminLoginResponse(res.data);

    if (!parsed) {
      const body = res.data as { message?: string };
      return {
        ok: false,
        code: "invalid",
        message:
          body?.message ??
          "Login response was invalid. Please contact support.",
      };
    }

    return {
      ok: true,
      data: parsed.data,
      message: parsed.message,
    };
  } catch (error: unknown) {
    const err = error as {
      response?: { data?: { code?: string; message?: string } };
      message?: string;
    };
    return {
      ok: false,
      code: (err.response?.data?.code as LoginErrorCode) || "invalid",
      message:
        err.response?.data?.message ||
        err.message ||
        "Login failed. Please try again.",
    };
  }
}

export async function initializePayment(
  email: string,
  program: string,
  options?: { callbackUrl?: string },
) {
  try {
    const payload: Record<string, string> = { email, program };
    if (options?.callbackUrl) {
      payload.callback_url = options.callbackUrl;
    }

    const url =
      typeof window !== "undefined"
        ? "/api/payments/initialize"
        : `${API_BASE_URL}/api/v1/payments/initialize`;

    const res = await axios.post(url, payload);

    return {
      ok: true as const,
      data: res.data.data,
      message: res.data.message,
    };
  } catch (error: unknown) {
    const err = error as { response?: { data?: { message?: string } } };
    return {
      ok: false as const,
      message: err.response?.data?.message || "Payment initialization failed.",
    };
  }
}

export async function verifyPayment(reference: string): Promise<
  | {
      ok: true;
      data: import("./payment-verification").PaymentVerificationData;
      message: string;
    }
  | { ok: false; message: string }
> {
  try {
    const url =
      typeof window !== "undefined"
        ? `/api/payments/verify?reference=${encodeURIComponent(reference)}&_=${Date.now()}`
        : `${API_BASE_URL}/api/v1/payments/verify`;

    const res = await axios.get(url, {
      params:
        typeof window === "undefined"
          ? { reference, _: Date.now() }
          : undefined,
      headers: {
        "Cache-Control": "no-cache, no-store, must-revalidate",
        Pragma: "no-cache",
      },
    });

    const { normalizePaymentVerification } =
      await import("./payment-verification");
    const data = normalizePaymentVerification(res.data?.data);
    if (!data) {
      return {
        ok: false as const,
        message:
          res.data?.message ||
          "Payment verification returned an unexpected response.",
      };
    }

    return {
      ok: true as const,
      data,
      message:
        typeof res.data?.message === "string"
          ? res.data.message
          : "Payment verification completed",
    };
  } catch (error: unknown) {
    const err = error as { response?: { data?: { message?: string } } };
    return {
      ok: false as const,
      message: err.response?.data?.message || "Payment verification failed.",
    };
  }
}

export async function createStudentProfile(data: {
  day: string;
  month: string;
  year: number;
  gender: string;
  employment_status: string;
  address: string;
  state: string;
  city: string;
  photo: File;
}) {
  try {
    const token = getStoredAuthToken();

    const formData = new FormData();
    appendProfileFormData(formData, {
      dob: formatProfileDob(data.day, data.month, data.year),
      gender: formatProfileGender(data.gender),
      employment_status: formatProfileEmploymentStatus(data.employment_status),
      address: data.address,
      state: data.state,
      city: data.city,
      photo: data.photo,
    });

    const res = await axios.post(
      `${API_BASE_URL}/api/v1/profiles/uploads`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      },
    );

    return {
      ok: true as const,
      data: res.data.data,
      message: res.data.message,
    };
  } catch (error: unknown) {
    const err = error as {
      message?: string;
      response?: {
        data?: {
          message?: string;
          errors?: Array<{ message?: string; path?: string }>;
        };
      };
    };

    const validationMessages =
      err.response?.data?.errors
        ?.map((item) => item.message)
        .filter((message): message is string => Boolean(message?.trim())) ?? [];

    return {
      ok: false as const,
      message:
        validationMessages.join(". ") ||
        err.response?.data?.message ||
        err.message ||
        "Failed to create profile.",
    };
  }
}

export async function getStaffList(
  page = 1,
  limit = 10,
  search = "",
  status = "",
  role?: "admin" | "tutor" | "trainer",
  course = "",
) {
  try {
    const token = getStoredAuthToken();

    const params: Record<string, string | number> = { page, limit };

    if (role) params.role = role;

    if (search) params.search = search;
    if (status && status !== "All") params.status = status;
    if (course && course !== "All") params.course = course;

    const res = await axios.get(`${API_BASE_URL}/api/v1/admins/staff`, {
      params,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return {
      ok: true as const,
      data: res.data.data,
      message: res.data.message,
    };
  } catch (error: any) {
    return {
      ok: false as const,
      message: error.response?.data?.message || "Failed to fetch staff list.",
    };
  }
}

export async function getStudentList(
  page = 1,
  limit = 10,
  search = "",
  status = "",
  role = "",
  program = "",
  programId = "",
) {
  try {
    const token = getStoredAuthToken();

    const params: Record<string, any> = { page, limit };

    if (search) params.search = search;
    if (status && status !== "All" && !status.toLowerCase().startsWith("all")) {
      params.status = status.toLowerCase();
    }
    if (role && role !== "All") params.role = role;

    // Swagger: `program` filters by enrolled program label (title/slug).
    const trimmedProgram = program.trim();
    if (trimmedProgram) params.program = trimmedProgram;

    // Some deployments also accept programId.
    const trimmedProgramId = programId.trim();
    if (trimmedProgramId) params.programId = trimmedProgramId;

    const res = await axios.get(`${API_BASE_URL}/api/v1/admins/students`, {
      params,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const payload = res.data?.data ?? res.data;
    const items = Array.isArray(payload?.items)
      ? payload.items.map((row: Record<string, unknown>) => {
          const programValue =
            row.programTitle ?? row.program ?? row.programName ?? row.programs;
          let programLabel = "";
          if (typeof programValue === "string") {
            programLabel = programValue.trim();
          } else if (Array.isArray(programValue)) {
            programLabel = programValue
              .map((entry) => {
                if (typeof entry === "string") return entry.trim();
                if (entry && typeof entry === "object") {
                  const record = entry as Record<string, unknown>;
                  return String(
                    record.title ?? record.name ?? record.slug ?? "",
                  ).trim();
                }
                return "";
              })
              .filter(Boolean)
              .join(", ");
          } else if (programValue && typeof programValue === "object") {
            const record = programValue as Record<string, unknown>;
            programLabel = String(
              record.title ?? record.name ?? record.slug ?? "",
            ).trim();
          }

          return {
            ...row,
            id: String(row.id ?? row._id ?? ""),
            firstName: String(row.firstName ?? row.first_name ?? ""),
            lastName: String(row.lastName ?? row.last_name ?? ""),
            programTitle: programLabel,
            progressPercent: Number(row.progressPercent ?? row.progress ?? 0),
            attendance:
              row.attendance && typeof row.attendance === "object"
                ? row.attendance
                : { display: "—" },
            status: String(row.status ?? "active"),
          };
        })
      : [];

    return {
      ok: true as const,
      data: {
        ...payload,
        items,
      },
      message: res.data.message,
    };
  } catch (error: any) {
    return {
      ok: false as const,
      message: error.response?.data?.message || "Failed to fetch student list.",
    };
  }
}

export async function getAssessmentsByProgram(
  programId: string,
  page = 1,
  limit = 8,
  status = "",
  search = "",
) {
  try {
    const token = getStoredAuthToken();
    const trimmedProgramId = programId.trim();
    if (!trimmedProgramId) {
      return {
        ok: false as const,
        message: "Course id is required.",
      };
    }

    const normalizedStatus = status.trim().toLowerCase();
    const params: Record<string, string | number> = { page, limit };
    if (
      normalizedStatus &&
      normalizedStatus !== "all" &&
      normalizedStatus !== "all status" &&
      normalizedStatus !== "all statuses"
    ) {
      params.status =
        normalizedStatus === "archive" ? "archived" : normalizedStatus;
    }
    if (search.trim()) params.search = search.trim();

    const res = await axios.get(
      `${API_BASE_URL}/api/v1/staff/assessments/program/${trimmedProgramId}`,
      {
        params,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    const body = res.data as Record<string, unknown> | null;
    const payload =
      body?.data && typeof body.data === "object" && !Array.isArray(body.data)
        ? (body.data as Record<string, unknown>)
        : (body ?? {});

    const assessments = Array.isArray(payload.assessments)
      ? payload.assessments
      : Array.isArray(payload.items)
        ? payload.items
        : Array.isArray(payload)
          ? payload
          : [];

    const paginationRaw =
      payload.pagination && typeof payload.pagination === "object"
        ? (payload.pagination as Record<string, unknown>)
        : {};

    const total =
      typeof paginationRaw.total === "number"
        ? paginationRaw.total
        : assessments.length;
    const totalPages =
      typeof paginationRaw.totalPages === "number"
        ? paginationRaw.totalPages
        : total > 0
          ? Math.max(1, Math.ceil(total / limit))
          : 0;

    return {
      ok: true as const,
      data: {
        assessments,
        pagination: {
          page:
            typeof paginationRaw.page === "number" ? paginationRaw.page : page,
          limit:
            typeof paginationRaw.limit === "number"
              ? paginationRaw.limit
              : limit,
          offset:
            typeof paginationRaw.offset === "number" ? paginationRaw.offset : 0,
          total,
          totalPages,
          hasNextPage: Boolean(paginationRaw.hasNextPage),
          hasPreviousPage: Boolean(paginationRaw.hasPreviousPage),
        },
      },
      message:
        typeof body?.message === "string"
          ? body.message
          : "Assessments fetched successfully.",
    };
  } catch (error: any) {
    return {
      ok: false as const,
      message: error.response?.data?.message || "Failed to fetch assessments.",
    };
  }
}
export async function getStaffAnalysis() {
  try {
    const token = getStoredAuthToken();

    const res = await axios.get(
      `${API_BASE_URL}/api/v1/admins/staff/analysis`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    return {
      ok: true as const,
      data: res.data.data,
      message: res.data.message,
    };
  } catch (error: any) {
    return {
      ok: false as const,
      message:
        error.response?.data?.message || "Failed to fetch staff analysis.",
    };
  }
}

function mapAttendanceStatus(
  value: unknown,
): "present" | "absent" | "not_recorded" {
  const raw = String(value ?? "")
    .trim()
    .toLowerCase();
  if (raw === "present" || raw === "attended") return "present";
  if (raw === "absent" || raw === "missed") return "absent";
  return "not_recorded";
}

function formatAttendanceDate(value: unknown): string {
  const raw = typeof value === "string" ? value.trim() : "";
  if (!raw) return "";
  const date = new Date(raw);
  if (Number.isNaN(date.getTime())) return raw;
  return date.toLocaleString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

function mapSessionAttendance(value: unknown) {
  if (!Array.isArray(value)) return [];

  return value.map((row, index) => {
    const item =
      row && typeof row === "object" && !Array.isArray(row)
        ? (row as Record<string, unknown>)
        : {};

    const startsAt =
      typeof item.startsAt === "string"
        ? item.startsAt
        : typeof item.date === "string"
          ? item.date
          : "";

    return {
      id:
        typeof item.id === "string"
          ? item.id
          : `${index}-${String(item.title ?? "session")}`,
      title: typeof item.title === "string" ? item.title : "",
      date: formatAttendanceDate(startsAt),
      week: typeof item.week === "string" ? item.week : "",
      status: mapAttendanceStatus(item.attendance ?? item.status),
    };
  });
}

function mapAdminStudentDetails(raw: unknown) {
  const row =
    raw && typeof raw === "object" && !Array.isArray(raw)
      ? (raw as Record<string, unknown>)
      : {};

  const completion =
    row.overallCompletion &&
    typeof row.overallCompletion === "object" &&
    !Array.isArray(row.overallCompletion)
      ? (row.overallCompletion as Record<string, unknown>)
      : {};

  const week =
    typeof completion.week === "number"
      ? completion.week
      : Number(completion.week ?? 0) || 0;
  const totalWeeks =
    typeof completion.totalWeeks === "number"
      ? completion.totalWeeks
      : Number(completion.totalWeeks ?? 0) || 0;

  return {
    id: String(row.id ?? ""),
    firstName: typeof row.firstName === "string" ? row.firstName : "",
    lastName: typeof row.lastName === "string" ? row.lastName : "",
    email: typeof row.email === "string" ? row.email : "",
    phoneNumber: typeof row.phoneNumber === "string" ? row.phoneNumber : "",
    program: typeof row.program === "string" ? row.program : undefined,
    programTitle: typeof row.programTitle === "string" ? row.programTitle : "",
    cohortName: typeof row.cohortName === "string" ? row.cohortName : "",
    enrollmentDate:
      typeof row.enrollmentDate === "string" ? row.enrollmentDate : "",
    status: typeof row.status === "string" ? row.status : "active",
    progressPercent: Number(row.progressPercent ?? 0) || 0,
    overallCompletion: { week, totalWeeks },
    cumulativeScore: Number(row.cumulativeScore ?? 0) || 0,
    sessionAttendance: mapSessionAttendance(row.sessionAttendance),
    image: typeof row.image === "string" ? row.image : undefined,
  };
}

export async function getStudentDetails(userId: string) {
  try {
    const token = getStoredAuthToken();

    const res = await axios.get(
      `${API_BASE_URL}/api/v1/admins/students/${userId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    return {
      ok: true as const,
      data: mapAdminStudentDetails(res.data.data),
      message: res.data.message,
    };
  } catch (error: any) {
    return {
      ok: false as const,
      message: error.response?.data?.message || "Failed to fetch student list.",
    };
  }
}

function asRecord(value: unknown): Record<string, unknown> | null {
  if (value && typeof value === "object" && !Array.isArray(value)) {
    return value as Record<string, unknown>;
  }
  return null;
}

function readMeString(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

function mapStudentMeProgram(value: unknown) {
  const row = asRecord(value);
  if (!row) return null;

  const id = readMeString(row.id ?? row._id);
  if (!id) return null;

  const cohortStartDate = readMeString(row.cohortStartDate ?? row.startDate);
  const cohortEndDate = readMeString(row.cohortEndDate ?? row.endDate);

  return {
    id,
    title: readMeString(row.title ?? row.name) || "Untitled course",
    slug: readMeString(row.slug) || undefined,
    description: readMeString(row.description) || undefined,
    category: readMeString(row.category) || undefined,
    programType: readMeString(row.programType) || undefined,
    priceAmount:
      typeof row.priceAmount === "number" ? row.priceAmount : undefined,
    priceCurrency: readMeString(row.priceCurrency) || undefined,
    cohortName: readMeString(row.cohortName) || undefined,
    cohortCode: readMeString(row.cohortCode) || undefined,
    cohortStartDate: cohortStartDate || undefined,
    cohortEndDate: cohortEndDate || undefined,
    startDate: cohortStartDate || undefined,
    endDate: cohortEndDate || undefined,
    capacity: typeof row.capacity === "number" ? row.capacity : undefined,
    status: readMeString(row.status) || undefined,
    assignedTutorIds: Array.isArray(row.assignedTutorIds)
      ? row.assignedTutorIds.filter(
          (id): id is string => typeof id === "string" && id.trim().length > 0,
        )
      : undefined,
    duration: readMeString(row.duration) || undefined,
    isLiveNow: Boolean(row.isLiveNow),
    liveLesson: mapStudentMeLiveLesson(row.liveLesson),
  };
}

function mapStudentMeLiveLesson(value: unknown) {
  const row = asRecord(value);
  if (!row) return null;

  const lessonId = readMeString(row.lessonId ?? row.id ?? row._id);
  const programId = readMeString(row.programId);
  if (!lessonId || !programId) return null;

  return {
    programId,
    programTitle: readMeString(row.programTitle ?? row.courseName),
    lessonId,
    lessonTitle: readMeString(row.lessonTitle ?? row.title),
    startsAt: readMeString(row.startsAt) || new Date().toISOString(),
    durationMinutes:
      typeof row.durationMinutes === "number" ? row.durationMinutes : undefined,
    liveSessionUrl: readMeString(row.liveSessionUrl) || null,
    zoomJoinUrl: readMeString(row.zoomJoinUrl) || null,
  };
}

function parseStudentMePayload(raw: unknown) {
  const root = asRecord(raw) ?? {};
  const generalPrograms = Array.isArray(root.generalPrograms)
    ? root.generalPrograms
        .map(mapStudentMeProgram)
        .filter((item): item is NonNullable<typeof item> => Boolean(item))
    : [];

  const liveFromArray = Array.isArray(root.liveGeneralPrograms)
    ? root.liveGeneralPrograms
        .map(mapStudentMeLiveLesson)
        .filter((item): item is NonNullable<typeof item> => Boolean(item))
    : [];

  // Some responses only mark programs live on generalPrograms.isLiveNow / liveLesson.
  const liveFromPrograms = generalPrograms
    .map((program) => {
      if (program.liveLesson) return program.liveLesson;
      if (!program.isLiveNow) return null;
      return null;
    })
    .filter((item): item is NonNullable<typeof item> => Boolean(item));

  const liveByLessonId = new Map<string, (typeof liveFromArray)[number]>();
  for (const item of [...liveFromArray, ...liveFromPrograms]) {
    liveByLessonId.set(item.lessonId, item);
  }
  const liveGeneralPrograms = Array.from(liveByLessonId.values());
  // Trust the API flag for live general sessions only.
  const hasLiveGeneralProgram = root.hasLiveGeneralProgram === true;

  return {
    student: asRecord(root.student) as {
      _id: string;
      first_name?: string;
      last_name?: string;
      email?: string;
      phone_number?: string;
      role?: string;
      status?: string;
      isVerified?: boolean;
      profileUploaded?: boolean;
      program?: string;
    } | null,
    profile: root.profile ?? null,
    program: mapStudentMeProgram(root.program),
    generalPrograms,
    liveGeneralPrograms: hasLiveGeneralProgram ? liveGeneralPrograms : [],
    hasLiveGeneralProgram,
  };
}

export async function getStudentPofile() {
  try {
    const token = getStoredAuthToken();

    const res = await axios.get(`${API_BASE_URL}/api/v1/students/auth/me`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const payload =
      res.data?.data && typeof res.data.data === "object"
        ? res.data.data
        : res.data;

    return {
      ok: true as const,
      data: parseStudentMePayload(payload),
      message: res.data?.message,
    };
  } catch (error: any) {
    return {
      ok: false as const,
      message: error.response?.data?.message,
    };
  }
}

export async function updateStaffStatus(
  userId: string,
  status: "active" | "suspended" | "invited",
) {
  const token = getStoredAuthToken();

  const res = await axios.patch(
    `${API_BASE_URL}/api/v1/admins/staff/${userId}/status`,
    { status },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );

  return {
    ok: true,
    data: res.data.data,
    message: res.data.message,
  };
}

export async function updateStudentStatus(
  userId: string,
  status: "active" | "suspended",
) {
  const token = getStoredAuthToken();

  const res = await axios.patch(
    `${API_BASE_URL}/api/v1/admins/students/${userId}/status`,
    { status },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );

  return {
    ok: true,
    data: res.data.data,
    message: res.data.message,
  };
}

export async function assignRole({
  programId,
  tutorIds,
}: {
  programId: string;
  tutorIds: string[];
}) {
  const token = getStoredAuthToken();

  const res = await axios.patch(
    `${API_BASE_URL}/api/v1/programs/${programId}/tutors`,
    {
      tutorIds,
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );

  return {
    ok: true,
    data: res.data.data,
    message: res.data.message,
  };
}

export async function createAssessment(data: {
  program: string;
  title: string;
  module?: string;
  instructions?: string;
  dueDate?: string;
  weight?: number;
  submissionType?: "file" | "url";
  submissionLink?: string;
  referenceMaterialsMeta?: Array<{ name: string; type: string; url?: string }>;
  files?: File[];
  isDraft?: boolean;
}) {
  try {
    const token = getStoredAuthToken();
    const formData = new FormData();

    formData.append("program", data.program);
    formData.append("title", data.title);
    if (data.module) formData.append("module", data.module);
    formData.append("status", data.isDraft ? "draft" : "published");
    if (data.instructions) formData.append("instructions", data.instructions);
    if (data.dueDate) formData.append("dueDate", data.dueDate);
    if (data.weight !== undefined)
      formData.append("weight", String(data.weight));
    const submissionType =
      data.submissionType ??
      (data.files && data.files.length
        ? "file"
        : data.submissionLink
          ? "url"
          : "url");
    formData.append("submissionType", submissionType);
    if (data.referenceMaterialsMeta) {
      formData.append(
        "referenceMaterialsMeta",
        JSON.stringify(data.referenceMaterialsMeta),
      );
    }
    if (data.files?.length) {
      data.files.forEach((file) => formData.append("referenceMaterials", file));
    }

    if (data.submissionLink) {
      formData.append("submissionLink", data.submissionLink);
    }

    const res = await axios.post(
      `${API_BASE_URL}/api/v1/staff/assessments/create`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    return {
      ok: true as const,
      data: res.data.data,
      message: res.data.message,
    };
  } catch (error: any) {
    return {
      ok: false as const,
      message: error.response?.data?.message || "Failed to create assessment.",
    };
  }
}

export async function getClassroomModules(programId: string) {
  try {
    const token = getStoredAuthToken();

    const res = await axios.get(
      `${API_BASE_URL}/api/v1/tutors/programs/${programId}/classroom/modules`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    return {
      ok: true as const,
      data: res.data.data,
      message: res.data.message,
    };
  } catch (error: any) {
    return {
      ok: false as const,
      message: error.response?.data?.message || "Failed to fetch modules.",
    };
  }
}

export async function getAssessmentById(assessmentId: string) {
  try {
    const token = getStoredAuthToken();

    const res = await axios.get(
      `${API_BASE_URL}/api/v1/staff/assessments/${assessmentId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    return {
      ok: true as const,
      data: res.data.data,
      message: res.data.message,
    };
  } catch (error: any) {
    return {
      ok: false as const,
      message: error.response?.data?.message || "Failed to fetch assessment.",
    };
  }
}

export async function getStudentassignments(programId: string) {
  try {
    const token = getStoredAuthToken();

    const res = await axios.get(
      `${API_BASE_URL}/api/v1/students/assessments/program/${programId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    return {
      ok: true as const,
      data: res.data.data,
      message: res.data.message,
    };
  } catch (error: any) {
    return {
      ok: false as const,
      message: error.response?.data?.message,
    };
  }
}

export async function getStudentAssessmentById(assessmentId: string) {
  try {
    const token = getStoredAuthToken();

    const res = await axios.get(
      `${API_BASE_URL}/api/v1/students/assessments/${assessmentId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    return {
      ok: true as const,
      data: res.data.data,
      message: res.data.message,
    };
  } catch (error: any) {
    return {
      ok: false as const,
      message: error.response?.data?.message || "Failed to fetch assessment.",
    };
  }
}

export async function archiveAssessment(assessmentId: string) {
  try {
    const token = getStoredAuthToken();

    const res = await axios.patch(
      `${API_BASE_URL}/api/v1/staff/assessments/${assessmentId}/archive`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    return { ok: true as const, message: res.data.message };
  } catch (error: any) {
    return {
      ok: false as const,
      message: error.response?.data?.message || "Failed to archive assessment.",
    };
  }
}

export async function publishAssessment(assessmentId: string) {
  try {
    const token = getStoredAuthToken();

    const res = await axios.patch(
      `${API_BASE_URL}/api/v1/staff/assessments/${assessmentId}/publish`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    return {
      ok: true as const,
      data: res.data.data,
      message: res.data.message || "Assessment published.",
    };
  } catch (error: any) {
    return {
      ok: false as const,
      message: error.response?.data?.message || "Failed to publish assessment.",
    };
  }
}

export async function draftAssessment(assessmentId: string) {
  try {
    const token = getStoredAuthToken();

    const res = await axios.patch(
      `${API_BASE_URL}/api/v1/staff/assessments/${assessmentId}/draft`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    return {
      ok: true as const,
      data: res.data.data,
      message: res.data.message || "Assessment moved to draft.",
    };
  } catch (error: any) {
    return {
      ok: false as const,
      message:
        error.response?.data?.message || "Failed to move assessment to draft.",
    };
  }
}

export async function updateAssessment(
  assessmentId: string,
  data: {
    title?: string;
    module?: string;
    instructions?: string;
    submissionType?: "file" | "url";
    submissionLink?: string;
    dueDate?: string;
    weight?: number;
    files?: File[];
  },
) {
  try {
    const token = getStoredAuthToken();
    const formData = new FormData();

    if (data.title) formData.append("title", data.title);
    if (data.module) formData.append("module", data.module);
    if (data.instructions) formData.append("instructions", data.instructions);
    if (data.submissionType)
      formData.append("submissionType", data.submissionType);
    if (data.submissionLink)
      formData.append("submissionLink", data.submissionLink);
    if (data.dueDate) formData.append("dueDate", data.dueDate);
    if (data.weight !== undefined)
      formData.append("weight", String(data.weight));
    if (data.files?.length) {
      data.files.forEach((file) => formData.append("referenceMaterials", file));
    }

    const res = await axios.patch(
      `${API_BASE_URL}/api/v1/staff/assessments/${assessmentId}`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    return {
      ok: true as const,
      data: res.data.data,
      message: res.data.message,
    };
  } catch (error: any) {
    return {
      ok: false as const,
      message: error.response?.data?.message || "Failed to update assessment.",
    };
  }
}

export const SESSION_STORAGE_KEY = "ssu_session";

export function readSession(): AuthUser | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = readPortalSessionRaw();
    if (!raw) return null;
    return JSON.parse(raw) as AuthUser;
  } catch {
    return null;
  }
}

export async function submitAssessment(
  assessmentId: string,
  data: {
    submissionType: "file" | "link";
    file?: File;
    submissionLink?: string;
    comment?: string;
  },
) {
  try {
    const token = getStoredAuthToken();
    const formData = new FormData();

    formData.append("submissionType", data.submissionType);
    if (data.file) formData.append("file", data.file);
    if (data.submissionLink)
      formData.append("submissionLink", data.submissionLink);
    if (data.comment) formData.append("comment", data.comment);

    const res = await axios.post(
      `${API_BASE_URL}/api/v1/students/assessments/submit/${assessmentId}`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    return {
      ok: true as const,
      data: res.data.data,
      message: res.data.message,
    };
  } catch (error: any) {
    return {
      ok: false as const,
      message: error.response?.data?.message || "Failed to submit assessment.",
    };
  }
}

export async function undoAssessmentSubmission(submissionId: string) {
  try {
    const token = getStoredAuthToken();

    const res = await axios.delete(
      `${API_BASE_URL}/api/v1/students/assessments/undo/${submissionId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    return { ok: true as const, message: res.data.message };
  } catch (error: any) {
    return {
      ok: false as const,
      message: error.response?.data?.message || "Failed to undo submission.",
    };
  }
}

export async function gradeAssessmentSubmission(
  submissionId: string,
  studentId: string,
  data: {
    score: number;
    feedback?: string;
  },
) {
  try {
    const token = getStoredAuthToken();

    const res = await axios.patch(
      `${API_BASE_URL}/api/v1/staff/assessments/grade/${submissionId}/${studentId}`,
      data,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    return {
      ok: true as const,
      data: res.data.data,
      message: res.data.message,
    };
  } catch (error: any) {
    return {
      ok: false as const,
      message: error.response?.data?.message || "Failed to grade submission.",
    };
  }
}

export async function getMySubmissions() {
  try {
    const token = getStoredAuthToken();

    const res = await axios.get(
      `${API_BASE_URL}/api/v1/students/assessments/submissions`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    return {
      ok: true as const,
      data: res.data.data,
      message: res.data.message,
    };
  } catch (error: any) {
    return {
      ok: false as const,
      message: error.response?.data?.message || "Failed to fetch submissions.",
    };
  }
}

export async function getStudentOverallProgress(programId: string) {
  try {
    const token = getStoredAuthToken();

    const res = await axios.get(
      `${API_BASE_URL}/api/v1/students/assessments/overall/${programId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    return {
      ok: true as const,
      data: res.data.data,
      message: res.data.message,
    };
  } catch (error: any) {
    return {
      ok: false as const,
      message:
        error.response?.data?.message || "Failed to fetch overall progress.",
    };
  }
}

export async function getAdminDashboard() {
  const token = getStoredAuthToken();

  const { data } = await axios.get(`${API_BASE_URL}/api/v1/admins/dashboard`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return data.data;
}

export function isStudentAuthenticated(): boolean {
  if (typeof window === "undefined") return false;
  const session = readSession();
  const token = getStoredAuthToken();
  return Boolean(session?.email && token);
}

export function clearStudentAuth(): void {
  if (typeof window === "undefined") return;
  writeSession(null);
  clearPortalAuthStorage();
  localStorage.removeItem("reset-email");
  clearProfileSetupDismissed();
}

export function writeSession(user: AuthUser | null): void {
  if (typeof window === "undefined") return;
  if (!user) {
    writePortalSessionRaw(null);
    writePortalTokenRaw(null);
    return;
  }
  writePortalSessionRaw(JSON.stringify(user));
  if (user.accessToken) {
    writePortalTokenRaw(user.accessToken);
  }
}
