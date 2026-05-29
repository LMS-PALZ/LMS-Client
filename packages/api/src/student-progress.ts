import type { StudentProgress } from "@ssu/types";

function delay<T>(value: T, ms = 200): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(value), ms));
}

export const studentProgressApi = {
  async get(): Promise<StudentProgress> {
    return delay({
      overallScorePercent: 17,
      enrolledProgramTitle: "web development",
    });
  },
};
