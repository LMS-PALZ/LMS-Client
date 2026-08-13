export type AuthPortal = "admin" | "student";

const LEGACY_SESSION_KEY = "ssu_session";
const LEGACY_TOKEN_KEY = "token";

let portalOverride: AuthPortal | null = null;

/** Call once from each app's providers before auth reads. */
export function setAuthPortal(portal: AuthPortal): void {
  portalOverride = portal;
}

export function getAuthPortal(): AuthPortal {
  if (portalOverride) return portalOverride;
  const fromEnv = process.env.NEXT_PUBLIC_APP_PORTAL?.trim().toLowerCase();
  if (fromEnv === "admin") return "admin";
  return "student";
}

export function getSessionStorageKey(portal = getAuthPortal()): string {
  return portal === "admin" ? "ssu_admin_session" : "ssu_student_session";
}

export function getAuthTokenStorageKey(portal = getAuthPortal()): string {
  return portal === "admin" ? "ssu_admin_token" : "ssu_student_token";
}

export function readPortalSessionRaw(): string | null {
  if (typeof window === "undefined") return null;
  return (
    localStorage.getItem(getSessionStorageKey()) ||
    localStorage.getItem(LEGACY_SESSION_KEY)
  );
}

export function writePortalSessionRaw(value: string | null): void {
  if (typeof window === "undefined") return;
  const key = getSessionStorageKey();
  if (!value) {
    localStorage.removeItem(key);
    localStorage.removeItem(LEGACY_SESSION_KEY);
    return;
  }
  localStorage.setItem(key, value);
  // Migrate this origin off the shared legacy key.
  localStorage.removeItem(LEGACY_SESSION_KEY);
}

export function readPortalTokenRaw(): string | null {
  if (typeof window === "undefined") return null;
  return (
    localStorage.getItem(getAuthTokenStorageKey()) ||
    localStorage.getItem(LEGACY_TOKEN_KEY)
  );
}

export function writePortalTokenRaw(token: string | null): void {
  if (typeof window === "undefined") return;
  const key = getAuthTokenStorageKey();
  if (!token) {
    localStorage.removeItem(key);
    localStorage.removeItem(LEGACY_TOKEN_KEY);
    return;
  }
  localStorage.setItem(key, token);
  localStorage.removeItem(LEGACY_TOKEN_KEY);
}

/** Clears only this portal's auth keys on the current origin. */
export function clearPortalAuthStorage(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(getSessionStorageKey());
  localStorage.removeItem(getAuthTokenStorageKey());
  // Legacy shared keys (safe per-origin: each app runs on its own host/port).
  localStorage.removeItem(LEGACY_SESSION_KEY);
  localStorage.removeItem(LEGACY_TOKEN_KEY);
}
