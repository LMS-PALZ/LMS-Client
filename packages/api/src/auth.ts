import type { AuthUser, UserRole } from "@ssu/types";

const MOCK_USERS: Record<
  string,
  {
    id: string;
    role: UserRole;
    firstName: string;
    lastName: string;
    status: string;
  }
> = {
  "student@skillscaleup.dev": {
    id: "u-student",
    role: "student",
    firstName: "Sam",
    lastName: "Student",
    status: "active",
  },
  "trainer@skillscaleup.dev": {
    id: "u-trainer",
    role: "trainer",
    firstName: "Terry",
    lastName: "Tutor",
    status: "active",
  },
  "admin@skillscaleup.dev": {
    id: "u-admin",
    role: "admin",
    firstName: "Alex",
    lastName: "Admin",
    status: "active",
  },
  "pending@skillscaleup.dev": {
    id: "u-pending",
    role: "trainer",
    firstName: "Pat",
    lastName: "Pending",
    status: "pending",
  },
};

export type LoginErrorCode = "invalid" | "pending_approval" | "suspended";

export async function loginDemo(
  email: string,
  password: string,
  expectedRole: UserRole,
): Promise<
  | { ok: true; user: AuthUser }
  | { ok: false; code: LoginErrorCode; message: string }
> {
  await new Promise((r) => setTimeout(r, 150));
  const key = email.toLowerCase().trim();
  if (password.length < 1) {
    return { ok: false, code: "invalid", message: "Password is required." };
  }
  const row = MOCK_USERS[key];
  if (!row) {
    return { ok: false, code: "invalid", message: "Invalid credentials." };
  }
  if (row.role !== expectedRole) {
    return {
      ok: false,
      code: "invalid",
      message: "Use the correct app for this account.",
    };
  }
  if (row.role === "trainer" && row.status === "pending") {
    return {
      ok: false,
      code: "pending_approval",
      message: "Your tutor account is pending approval.",
    };
  }
  if (row.status === "suspended") {
    return {
      ok: false,
      code: "suspended",
      message: "Your account is suspended.",
    };
  }
  const user: AuthUser = {
    id: row.id,
    email: key,
    firstName: row.firstName,
    lastName: row.lastName,
    role: row.role,
    status: row.status,
  };
  return { ok: true, user };
}

export const SESSION_STORAGE_KEY = "ssu_session";

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

export function writeSession(user: AuthUser | null): void {
  if (typeof window === "undefined") return;
  if (!user) {
    localStorage.removeItem(SESSION_STORAGE_KEY);
    return;
  }
  localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(user));
}
