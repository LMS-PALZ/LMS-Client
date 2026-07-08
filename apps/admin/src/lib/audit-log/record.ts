import type { AuthUser } from "@ssu/types";
import { collectClientInfo, resolveApproxLocation } from "./client-info";
import { appendAuditLogEntry } from "./storage";
import type { AuditLogAction } from "./types";

export async function recordAuditEvent(
  action: AuditLogAction,
  user: AuthUser,
): Promise<void> {
  if (typeof window === "undefined") return;

  const clientInfo = collectClientInfo();
  const location = await resolveApproxLocation();

  appendAuditLogEntry({
    id:
      typeof crypto !== "undefined" && "randomUUID" in crypto
        ? crypto.randomUUID()
        : `${Date.now()}-${Math.random().toString(36).slice(2)}`,
    action,
    userId: user.id,
    userName:
      [user.firstName, user.lastName].filter(Boolean).join(" ") || user.email,
    userEmail: user.email,
    userRole: user.role,
    timestamp: new Date().toISOString(),
    location,
    ...clientInfo,
  });
}
