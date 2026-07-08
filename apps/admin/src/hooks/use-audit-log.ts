"use client";

import { useEffect, useState } from "react";
import {
  AUDIT_LOG_UPDATED_EVENT,
  getAuditLogEntries,
  type AuditLogEntry,
} from "@/lib/audit-log";

export function useAuditLogEntries() {
  const [entries, setEntries] = useState<AuditLogEntry[]>([]);

  useEffect(() => {
    const refresh = () => setEntries(getAuditLogEntries());
    refresh();
    window.addEventListener(AUDIT_LOG_UPDATED_EVENT, refresh);
    return () => window.removeEventListener(AUDIT_LOG_UPDATED_EVENT, refresh);
  }, []);

  return entries;
}
