import type { AuthUser, UserRole } from "@ssu/types";
import { readPortalSessionRaw, readPortalTokenRaw } from "./auth-portal";

export type StudentLoginSuccess = {
  ok: true;
  data: AuthUser;
  accessToken: string;
  message: string;
};

export type StudentLoginFailure = {
  ok: false;
  code: "invalid" | "pending_approval" | "suspended";
  message: string;
};

export type StudentLoginResult = StudentLoginSuccess | StudentLoginFailure;

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
    if (typeof value === "string" && value.trim()) return value;
  }
  return "";
}

function mapRole(value: string): UserRole {
  if (value === "trainer" || value === "admin") return value;
  return "students";
}

function mapAdminRole(value: string): UserRole {
  const normalized = value.toLowerCase().trim();
  if (normalized === "super_admin" || normalized === "superadmin") {
    return "super_admin";
  }
  if (normalized === "admin") return "admin";
  if (
    normalized === "tutor" ||
    normalized === "trainer" ||
    normalized === "instructor"
  ) {
    return "tutor";
  }
  return "admin";
}

/**
 * Parses student login API bodies:
 * `{ status: true, message, data: { …user, access_token } }`
 */
export function parseStudentLoginResponse(
  body: unknown,
): StudentLoginSuccess | null {
  const root = asRecord(body);
  if (!root) return null;

  if (root.status === false) return null;

  const payload = asRecord(root.data) ?? root;
  const userRecord =
    asRecord(payload.student) ?? asRecord(payload.user) ?? payload;

  const email = readString(userRecord, "email");
  if (!email) return null;

  const accessToken =
    readString(
      payload,
      "access_token",
      "accessToken",
      "token",
      "jwt",
      "auth_token",
      "bearer_token",
    ) ||
    readString(
      userRecord,
      "access_token",
      "accessToken",
      "token",
      "jwt",
      "auth_token",
    );

  if (!accessToken) return null;

  const user: AuthUser = {
    id: readString(userRecord, "id", "_id", "studentId"),
    email,
    firstName: readString(userRecord, "firstName", "first_name"),
    lastName: readString(userRecord, "lastName", "last_name"),
    role: mapRole(readString(userRecord, "role") || "students"),
    status: readString(userRecord, "status") || "active",
    accessToken: accessToken,
  };

  const message =
    typeof root.message === "string" && root.message.trim()
      ? root.message
      : "Login successful";

  return { ok: true, data: user, accessToken, message };
}

/**
 * Parses admin/tutor login API bodies:
 * `{ status: "success", message, data: { admin/user, access_token } }`
 */
export function parseAdminLoginResponse(
  body: unknown,
): StudentLoginSuccess | null {
  const root = asRecord(body);
  if (!root) return null;

  if (root.status === false) return null;

  const payload = asRecord(root.data) ?? root;
  const userRecord =
    asRecord(payload.admin) ??
    asRecord(payload.staff) ??
    asRecord(payload.user) ??
    asRecord(payload.trainer) ??
    payload;

  const email = readString(userRecord, "email");
  if (!email) return null;

  const accessToken =
    readString(
      root,
      "access_token",
      "accessToken",
      "token",
      "jwt",
      "auth_token",
      "bearer_token",
    ) ||
    readString(
      payload,
      "access_token",
      "accessToken",
      "token",
      "jwt",
      "auth_token",
      "bearer_token",
    ) ||
    readString(
      userRecord,
      "access_token",
      "accessToken",
      "token",
      "jwt",
      "auth_token",
    );

  if (!accessToken) return null;

  const roleValue = readString(userRecord, "role");
  const fullName = readString(userRecord, "name");
  const firstName =
    readString(userRecord, "firstName", "first_name") ||
    fullName.split(/\s+/)[0] ||
    "";
  const lastName =
    readString(userRecord, "lastName", "last_name") ||
    fullName.split(/\s+/).slice(1).join(" ") ||
    "";
  const user: AuthUser = {
    id: readString(
      userRecord,
      "id",
      "_id",
      "adminId",
      "userId",
      "user_id",
      "tutorId",
      "tutor_id",
      "staffId",
      "staff_id",
    ),
    email,
    firstName,
    lastName,
    role: mapAdminRole(roleValue || "admin"),
    status: readString(userRecord, "status") || "active",
    accessToken,
  };

  const message =
    typeof root.message === "string" && root.message.trim()
      ? root.message
      : "Login successful";

  return { ok: true, data: user, accessToken, message };
}

function readTokenFromRaw(raw: string | null): string | null {
  if (!raw || raw === "undefined" || raw === "null") return null;

  if (raw.startsWith("{")) {
    try {
      const parsed = asRecord(JSON.parse(raw));
      if (!parsed) return null;
      return (
        readString(parsed, "access_token", "accessToken", "token", "jwt") ||
        null
      );
    } catch {
      return null;
    }
  }

  const trimmed = raw.trim();
  if (!trimmed) return null;
  return trimmed.startsWith("Bearer ") ? trimmed.slice(7).trim() : trimmed;
}

export function getStoredAuthToken(): string | null {
  if (typeof window === "undefined") return null;

  const fromTokenKey = readTokenFromRaw(readPortalTokenRaw());
  if (fromTokenKey) return fromTokenKey;

  try {
    const sessionRaw = readPortalSessionRaw();
    if (!sessionRaw) return null;
    const session = asRecord(JSON.parse(sessionRaw));
    if (!session) return null;
    return (
      readString(session, "accessToken", "access_token", "token", "jwt") || null
    );
  } catch {
    return null;
  }
}
