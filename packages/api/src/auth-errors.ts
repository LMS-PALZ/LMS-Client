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
    normalized.includes("unauthorized")
  );
}

export function isAuthExpiredError(error: unknown): boolean {
  if (!error || typeof error !== "object") return false;

  const err = error as { response?: { status?: number } };
  const status = err.response?.status;
  if (status === 401) return true;

  const data = readResponseData(error);
  if (!data) return false;

  const errorCode =
    typeof data.error_code === "string" ? data.error_code.toLowerCase() : "";
  if (
    errorCode === "not_authenticated" ||
    errorCode === "token_expired" ||
    errorCode === "unauthorized"
  ) {
    return true;
  }

  const message =
    typeof data.message === "string" ? data.message.toLowerCase() : "";
  if (isAuthErrorMessage(message)) return true;

  const nested = data.error;
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

  return false;
}
