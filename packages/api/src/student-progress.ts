import type { StudentProgress } from "@ssu/types";
import { studentHomeApi } from "./student-home";

export const studentProgressApi = {
  async get(): Promise<StudentProgress> {
    return studentHomeApi.getProgress();
  },
};
