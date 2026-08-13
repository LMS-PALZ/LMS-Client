import { getStoredAuthToken } from "./student-login";

function readResponseData(error: unknown): Record<string, unknown> | null {
  if (!error || typeof error !== "object") return null;
  const response = (error as { response?: { data?: unknown } }).response;
  if (!response?.data || typeof response.data !== "object") return null;
  return response.data as Record<string, unknown>;
}

export function isAuthErrorMessage(message: string): boolean {
  const normalized = message.trim().toLowerCase();
  if (!normalized) return false;

  return (
    normalized.includes("invalid or expired") ||
    normalized.includes("jwt expired") ||
    normalized.includes("not authenticated") ||
    normalized.includes("token expired") ||
    normalized.includes("access token expired") ||
    normalized.includes("session expired") ||
    (normalized.includes("token") && normalized.includes("invalid")) ||
    (normalized.includes("jwt") && normalized.includes("expir"))
  );
}

export function isStoredJwtExpired(skewMs = 15_000): boolean {
  if (typeof window === "undefined") return false;
  const token = getStoredAuthToken();
  if (!token) return false;

  const parts = token.split(".");
  if (parts.length < 2) return false;

  try {
    const json = atob(parts[1].replace(/-/g, "+").replace(/_/g, "/"));
    const payload = JSON.parse(json) as { exp?: number };
    if (typeof payload.exp !== "number") return false;
    return payload.exp * 1000 <= Date.now() + skewMs;
  } catch {
    return false;
  }
}

export function isAuthExpiredError(error: unknown): boolean {
  if (!error || typeof error !== "object") return false;

  const data = readResponseData(error);
  const errorCode =
    typeof data?.error_code === "string" ? data.error_code.toLowerCase() : "";
  if (
    errorCode === "not_authenticated" ||
    errorCode === "token_expired" ||
    errorCode === "session_expired"
  ) {
    return true;
  }

  const message =
    typeof data?.message === "string" ? data.message.toLowerCase() : "";
  if (isAuthErrorMessage(message)) return true;

  const nested = data?.error;
  if (nested && typeof nested === "object") {
    const name =
      typeof (nested as { name?: string }).name === "string"
        ? (nested as { name?: string }).name
        : "";
    if (name === "TokenExpiredError" || name === "JsonWebTokenError") {
      return true;
    }

    const nestedMessage =
      typeof (nested as { message?: string }).message === "string"
        ? (nested as { message?: string }).message!
        : "";
    if (isAuthErrorMessage(nestedMessage)) return true;
  }

  const err = error as { response?: { status?: number } };
  if (err.response?.status === 401 && isStoredJwtExpired()) return true;

  return false;
}
