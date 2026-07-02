import type { LiveSessionItem } from "@ssu/types";
import { studentDashboardApi } from "./student-dashboard";

export const sessionsApi = {
  listUpcoming: async (): Promise<LiveSessionItem[]> => {
    return studentDashboardApi.getSessions();
  },
  getById: async (sessionId: string): Promise<LiveSessionItem | null> => {
    const sessions = await studentDashboardApi.getSessions();
    return sessions.find((session) => session.id === sessionId) ?? null;
  },
};
