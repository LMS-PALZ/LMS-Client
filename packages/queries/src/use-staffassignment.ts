import { useQuery } from "@tanstack/react-query";
import { getAssessmentsByProgram } from "@ssu/api";

export function useAssessmentsByProgram(
  programId: string,
  page = 1,
  limit = 8,
  status = "",
  search = "",
) {
  return useQuery({
    queryKey: ["assessments", programId, page, limit, status, search],
    queryFn: async () => {
      const res = await getAssessmentsByProgram(
        programId,
        page,
        limit,
        status,
        search,
      );
      if (!res.ok) throw new Error(res.message);
      return res.data;
    },
    enabled: !!programId,
  });
}
