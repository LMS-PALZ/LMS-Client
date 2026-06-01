import type { AuthUser, UserRole } from "@ssu/types";

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
  };

  const message =
    typeof root.message === "string" && root.message.trim()
      ? root.message
      : "Login successful";

  return { ok: true, data: user, accessToken, message };
}

export function getStoredAuthToken(): string | null {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem("token");
  if (!raw) return null;

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

  return raw;
}
