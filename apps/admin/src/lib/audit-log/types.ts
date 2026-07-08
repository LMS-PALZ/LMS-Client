export type AuditLogAction = "sign_in" | "sign_out";

export interface AuditLogEntry {
  id: string;
  action: AuditLogAction;
  userId: string;
  userName: string;
  userEmail: string;
  userRole: string;
  timestamp: string;
  device: string;
  userAgent: string;
  platform: string;
  language: string;
  timezone: string;
  screenResolution: string;
  location: string;
}

export const AUDIT_LOG_UPDATED_EVENT = "ssu-audit-log-updated";
