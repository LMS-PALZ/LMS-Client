import { useQuery } from "@tanstack/react-query";
import { assignmentsApi } from "@ssu/api";
import { assignmentKeys } from "./keys";

export function useStudentAssignments() {
  return useQuery({
    queryKey: assignmentKeys.list(),
    queryFn: assignmentsApi.listForStudent,
    staleTime: 1000 * 60 * 2,
  });
}

export function useAssignment(id: string) {
  return useQuery({
    queryKey: assignmentKeys.detail(id),
    queryFn: () => assignmentsApi.getById(id),
    enabled: !!id,
  });
}
