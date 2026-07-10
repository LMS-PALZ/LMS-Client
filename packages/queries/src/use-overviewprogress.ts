import { useQuery } from "@tanstack/react-query";
import { getStudentOverallProgress } from "@ssu/api";

export function useStudentOverallProgress(programId: string) {
  return useQuery({
    queryKey: ["student-overall-progress", programId],
    queryFn: async () => {
      const res = await getStudentOverallProgress(programId);
      if (!res.ok) throw new Error(res.message);
      return res.data;
    },
  });
}
