import type { LiveSessionItem } from "@ssu/types";
import { mockSessions } from "./mock/data";

function delay<T>(value: T, ms = 200): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(value), ms));
}

export const sessionsApi = {
  listUpcoming: async (): Promise<LiveSessionItem[]> => delay(mockSessions),
  getById: async (sessionId: string): Promise<LiveSessionItem | null> => {
    const s = mockSessions.find((x) => x.id === sessionId) ?? null;
    return delay(s);
  },
};
