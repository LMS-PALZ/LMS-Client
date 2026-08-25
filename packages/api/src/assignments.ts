import type { AssignmentListItem } from "@ssu/types";
import { studentDashboardApi } from "./student-dashboard";

export const assignmentsApi = {
  listForStudent: async (): Promise<AssignmentListItem[]> => {
    return studentDashboardApi.getAssignments();
  },
  getById: async (id: string): Promise<AssignmentListItem | null> => {
    const list = await studentDashboardApi.getAssignments();
    return list.find((item) => item.id === id) ?? null;
  },
};
