import type { AssignmentListItem } from "@ssu/types";
import { mockAssignments } from "./mock/data";

function delay<T>(value: T, ms = 200): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(value), ms));
}

export const assignmentsApi = {
  listForStudent: async (): Promise<AssignmentListItem[]> =>
    delay(mockAssignments),
  getById: async (id: string): Promise<AssignmentListItem | null> => {
    const a = mockAssignments.find((x) => x.id === id) ?? null;
    return delay(a);
  },
};
