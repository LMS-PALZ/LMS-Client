import { studentProgressApi } from "@ssu/api";
import { useQuery } from "@tanstack/react-query";

export const studentProgressKeys = {
  all: ["student-progress"] as const,
};

export function useStudentProgress() {
  return useQuery({
    queryKey: studentProgressKeys.all,
    queryFn: () => studentProgressApi.get(),
  });
}
