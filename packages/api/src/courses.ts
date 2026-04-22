import type { CourseSummary } from "@ssu/types";
import { mockCourses } from "./mock/data";

function delay<T>(value: T, ms = 200): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(value), ms));
}

export const coursesApi = {
  getEnrolled: async (): Promise<CourseSummary[]> => delay(mockCourses),
  getById: async (id: string): Promise<CourseSummary | null> => {
    const c = mockCourses.find((x) => x.id === id) ?? null;
    return delay(c);
  },
};
