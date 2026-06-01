import type { AssignmentListItem } from "@ssu/types";
import { mockAssignments } from "./mock/data";
import { studentHomeApi, useStudentHomeLiveApi } from "./student-home";

function delay<T>(value: T, ms = 200): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(value), ms));
}

export const assignmentsApi = {
  listForStudent: async (): Promise<AssignmentListItem[]> => {
    if (!useStudentHomeLiveApi()) {
      return studentHomeApi.getAssignments();
    }
    return delay(mockAssignments);
  },
  getById: async (id: string): Promise<AssignmentListItem | null> => {
    const list = useStudentHomeLiveApi()
      ? mockAssignments
      : await studentHomeApi.getAssignments();
    const a = list.find((x) => x.id === id) ?? null;
    return delay(a);
  },
};
