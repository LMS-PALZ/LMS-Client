import axios from "axios";
import { getStoredAuthToken } from "./student-login";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  "https://base-api.skillscaleup.org";

export type StudentProfileDob = {
  day?: string;
  month?: string;
  year?: number;
};

export type StudentProfile = {
  id?: string;
  studentId?: string;
  dob?: StudentProfileDob;
  gender?: string;
  employment_status?: string;
  address?: string;
  state?: string;
  city?: string;
  photo?: {
    url?: string;
    public_id?: string;
  };
};

function asRecord(value: unknown): Record<string, unknown> | null {
  if (value && typeof value === "object" && !Array.isArray(value)) {
    return value as Record<string, unknown>;
  }
  return null;
}

function readString(
  record: Record<string, unknown>,
  ...keys: string[]
): string {
  for (const key of keys) {
    const value = record[key];
    if (typeof value === "string" && value.trim()) return value.trim();
  }
  return "";
}

function parseDob(value: unknown): StudentProfileDob | undefined {
  const record = asRecord(value);
  if (!record) return undefined;

  const yearRaw = record.year;
  const year =
    typeof yearRaw === "number"
      ? yearRaw
      : typeof yearRaw === "string"
        ? Number.parseInt(yearRaw, 10)
        : undefined;

  const day = readString(record, "day");
  const month = readString(record, "month");

  if (!day && !month && !year) return undefined;

  return {
    day: day || undefined,
    month: month || undefined,
    year: Number.isFinite(year) ? year : undefined,
  };
}

function parseProfileRecord(value: unknown): StudentProfile | null {
  const record = asRecord(value);
  if (!record) return null;

  const photoRecord = asRecord(record.photo);
  const dob = parseDob(record.dob);

  const profile: StudentProfile = {
    id: readString(record, "id", "_id"),
    studentId: readString(record, "studentId", "student_id"),
    dob,
    gender: readString(record, "gender"),
    employment_status: readString(
      record,
      "employment_status",
      "employmentStatus",
    ),
    address: readString(record, "address"),
    state: readString(record, "state"),
    city: readString(record, "city"),
    photo: photoRecord
      ? {
          url: readString(photoRecord, "url"),
          public_id: readString(photoRecord, "public_id", "publicId"),
        }
      : undefined,
  };

  const hasAnyField = Boolean(
    profile.dob?.day ||
    profile.dob?.month ||
    profile.dob?.year ||
    profile.gender ||
    profile.employment_status ||
    profile.address ||
    profile.state ||
    profile.city ||
    profile.photo?.url,
  );

  return hasAnyField ? profile : null;
}

function extractProfilePayload(body: unknown): unknown {
  const root = asRecord(body);
  if (!root) return null;

  const data = root.data ?? root.profile ?? root;

  if (Array.isArray(data)) {
    return data[0] ?? null;
  }

  return data;
}

export function isStudentProfileComplete(
  profile: StudentProfile | null | undefined,
): boolean {
  if (!profile) return false;

  return Boolean(
    profile.dob?.day &&
    profile.dob?.month &&
    profile.dob?.year &&
    profile.gender &&
    profile.employment_status &&
    profile.address?.trim() &&
    profile.state?.trim() &&
    profile.city?.trim() &&
    profile.photo?.url,
  );
}

export const PROFILE_SETUP_DISMISSED_KEY = "ssu_profile_setup_dismissed";

export function dismissProfileSetupPrompt(): void {
  if (typeof window === "undefined") return;
  sessionStorage.setItem(PROFILE_SETUP_DISMISSED_KEY, "1");
}

export function isProfileSetupDismissed(): boolean {
  if (typeof window === "undefined") return false;
  return sessionStorage.getItem(PROFILE_SETUP_DISMISSED_KEY) === "1";
}

export function clearProfileSetupDismissed(): void {
  if (typeof window === "undefined") return;
  sessionStorage.removeItem(PROFILE_SETUP_DISMISSED_KEY);
}

export async function fetchStudentProfile(): Promise<
  { ok: true; data: StudentProfile | null } | { ok: false; message: string }
> {
  const token = getStoredAuthToken();
  if (!token) {
    return { ok: false, message: "Not authenticated" };
  }

  try {
    const res = await axios.get(`${API_BASE_URL}/api/v1/profiles`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    const profile = parseProfileRecord(extractProfilePayload(res.data));
    return { ok: true, data: profile };
  } catch (error: unknown) {
    const err = error as {
      response?: { status?: number; data?: { message?: string } };
      message?: string;
    };

    if (err.response?.status === 404) {
      return { ok: true, data: null };
    }

    return {
      ok: false,
      message:
        err.response?.data?.message ||
        err.message ||
        "Unable to load your profile.",
    };
  }
}
