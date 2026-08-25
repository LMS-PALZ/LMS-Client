import type {
  AssignmentListItem,
  LiveSessionItem,
  StudentProgress,
} from "@ssu/types";
import studentHomeJson from "./mock/student-home.json";

export type StudentHomeVariant = "empty" | "populated";

export type StudentHomeData = {
  progress: StudentProgress;
  sessions: LiveSessionItem[];
  assignments: AssignmentListItem[];
};

const homeByVariant = studentHomeJson as Record<
  StudentHomeVariant,
  StudentHomeData
>;

function delay<T>(value: T, ms = 200): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(value), ms));
}

export function useStudentHomeLiveApi(): boolean {
  return process.env.NEXT_PUBLIC_STUDENT_USE_HOME_API === "true";
}

export function getStudentHomeVariant(): StudentHomeVariant {
  const variant = process.env.NEXT_PUBLIC_STUDENT_HOME_VARIANT;
  return variant === "empty" ? "empty" : "populated";
}

export function getStudentHomeMock(): StudentHomeData {
  return homeByVariant[getStudentHomeVariant()];
}

export const studentHomeApi = {
  async get(): Promise<StudentHomeData> {
    if (useStudentHomeLiveApi()) {
      return delay(getStudentHomeMock());
    }
    return delay(getStudentHomeMock());
  },
  async getProgress(): Promise<StudentProgress> {
    const home = await this.get();
    return home.progress;
  },
  async getSessions(): Promise<LiveSessionItem[]> {
    const home = await this.get();
    return home.sessions;
  },
  async getAssignments(): Promise<AssignmentListItem[]> {
    const home = await this.get();
    return home.assignments;
  },
};
