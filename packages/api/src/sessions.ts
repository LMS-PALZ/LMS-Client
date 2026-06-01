import type { LiveSessionItem } from "@ssu/types";
import { mockSessions } from "./mock/data";
import { studentHomeApi, useStudentHomeLiveApi } from "./student-home";

function delay<T>(value: T, ms = 200): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(value), ms));
}

export const sessionsApi = {
  listUpcoming: async (): Promise<LiveSessionItem[]> => {
    if (!useStudentHomeLiveApi()) {
      return studentHomeApi.getSessions();
    }
    return delay(mockSessions);
  },
  getById: async (sessionId: string): Promise<LiveSessionItem | null> => {
    const sessions = useStudentHomeLiveApi()
      ? mockSessions
      : await studentHomeApi.getSessions();
    const s = sessions.find((x) => x.id === sessionId) ?? null;
    return delay(s);
  },
};
