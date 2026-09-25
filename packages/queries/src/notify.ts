import { toast } from "sonner";

function readBackendMessage(error: unknown): string {
  if (!error || typeof error !== "object") return "";

  const data = (error as { response?: { data?: unknown } }).response?.data;
  if (typeof data === "string") return data.trim();
  if (!data || typeof data !== "object") return "";

  const message = (data as { message?: unknown }).message;
  if (typeof message === "string") return message.trim();
  if (Array.isArray(message)) {
    return message
      .filter((item): item is string => typeof item === "string")
      .map((item) => item.trim())
      .filter(Boolean)
      .join(" ");
  }

  return "";
}

export function getErrorMessage(
  error: unknown,
  fallback = "Something went wrong. Please try again.",
): string {
  const backendMessage = readBackendMessage(error);
  if (backendMessage) return backendMessage;

  if (error instanceof Error && error.message.trim()) {
    const message = error.message.trim();
    if (!/^Request failed with status code \d+$/.test(message)) {
      return message;
    }
  }

  if (typeof error === "string" && error.trim()) {
    return error.trim();
  }

  return fallback;
}

export const mutationToast = {
  success(message: string) {
    toast.success(message);
  },
  error(message: string) {
    toast.error(message);
  },
  warning(message: string) {
    toast.warning(message);
  },
  info(message: string) {
    toast.info(message);
  },
};
