import type { StudentProgress } from "@ssu/types";
import { studentDashboardApi } from "./student-dashboard";

export const studentProgressApi = {
  async get(): Promise<StudentProgress> {
    return studentDashboardApi.getProgress();
  },
};
