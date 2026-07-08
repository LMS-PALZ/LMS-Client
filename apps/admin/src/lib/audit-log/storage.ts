import type { AuditLogEntry } from "./types";
import { AUDIT_LOG_UPDATED_EVENT } from "./types";

const STORAGE_KEY = "ssu_admin_audit_log";
const MAX_ENTRIES = 500;

export function getAuditLogEntries(): AuditLogEntry[] {
  if (typeof window === "undefined") return [];

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as AuditLogEntry[]) : [];
  } catch {
    return [];
  }
}

export function appendAuditLogEntry(entry: AuditLogEntry): void {
  if (typeof window === "undefined") return;

  const entries = getAuditLogEntries();
  entries.unshift(entry);

  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(entries.slice(0, MAX_ENTRIES)),
  );

  window.dispatchEvent(new Event(AUDIT_LOG_UPDATED_EVENT));
}
