import type { AuthUser } from "@ssu/types";
import axios from "axios";
import {
  appendProfileFormData,
  formatProfileDob,
  formatProfileEmploymentStatus,
  formatProfileGender,
} from "./profile-payload";
import { clearProfileSetupDismissed } from "./student-profile";
import {
  getStoredAuthToken,
  parseStudentLoginResponse,
  type StudentLoginResult,
} from "./student-login";

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

    const res = await axios.post(
      `${API_BASE_URL}/api/v1/admins/admins/invitations`,
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

export type SignupErrorCode =
  | "email_exists"
  | "validation_error"
  | "invalid"
  | "server_error"
  | "pending_approval";

export async function signupStudent(input: {
  first_name: string;
  last_name: string;
  email: string;
  phone_number: string;
  program: string;
}): Promise<
  | { status: true; message: string; data: AuthUser }
  | { status: false; code: SignupErrorCode; message: string }
> {
  try {
    const url = `${API_BASE_URL}/api/v1/students/auth/signup`;

    const res = await axios.post(url, input);

    return res.data;
  } catch (error: unknown) {
    const err = error as {
      response?: { data?: { message?: string } };
      message?: string;
    };
    return {
      status: false,
      code: "server_error",
      message:
        err.response?.data?.message ||
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

export type ForgetPasswordErrorCode = "invalid" | "server_error";

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
      response?: { data?: { code?: string; message?: string } };
      message?: string;
    };
    return {
      ok: false,
      code: (err.response?.data?.code as ForgetPasswordErrorCode) || "invalid",
      message:
        err.response?.data?.message ||
        err.message ||
        "Forget password failed. Please try again.",
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

    return {
      ok: true,
      data: res.data.data,
      message: res.data.message || "Login successful",
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

export async function verifyPayment(reference: string) {
  try {
    const res = await axios.get(`${API_BASE_URL}/api/v1/payments/verify`, {
      params: { reference },
    });

    return {
      ok: true as const,
      data: res.data.data,
      message: res.data.message,
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
  role: "admin" | "tutor" = "admin",
  course = "",
) {
  try {
    const token = getStoredAuthToken();

    const params: Record<string, any> = { page, limit, role };

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
  course = "",
) {
  try {
    const token = getStoredAuthToken();

    const params: Record<string, any> = { page, limit };

    if (search) params.search = search;
    if (status && status !== "All") params.status = status;
    if (role && role !== "All") params.role = role;
    if (course && course !== "All") params.course = course;

    const res = await axios.get(`${API_BASE_URL}/api/v1/admins/students`, {
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
      message: error.response?.data?.message || "Failed to fetch student list.",
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
      data: res.data.data,
      message: res.data.message,
    };
  } catch (error: any) {
    return {
      ok: false as const,
      message: error.response?.data?.message || "Failed to fetch student list.",
    };
  }
}

export async function getStudentPofile() {
  try {
    const token = getStoredAuthToken();

    const res = await axios.get(`${API_BASE_URL}/api/v1/students/auth/me`, {
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
      message: error.response?.data?.message,
    };
  }
}

export async function getStudentclassroom(programId: string) {
  try {
    const token = getStoredAuthToken();

    const res = await axios.get(
      `${API_BASE_URL}/api/v1/students/classroom/${programId}`,
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

export const SESSION_STORAGE_KEY = "ssu_session";

const AUTH_TOKEN_STORAGE_KEY = "token";

export function readSession(): AuthUser | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(SESSION_STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as AuthUser;
  } catch {
    return null;
  }
}

export function isStudentAuthenticated(): boolean {
  if (typeof window === "undefined") return false;
  const session = readSession();
  const token = getStoredAuthToken();
  return Boolean(session?.email && token);
}

export function clearStudentAuth(): void {
  writeSession(null);
  if (typeof window === "undefined") return;
  localStorage.removeItem(AUTH_TOKEN_STORAGE_KEY);
  localStorage.removeItem("reset-email");
  clearProfileSetupDismissed();
}

export function writeSession(user: AuthUser | null): void {
  if (typeof window === "undefined") return;
  if (!user) {
    localStorage.removeItem(SESSION_STORAGE_KEY);
    return;
  }
  localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(user));
}
