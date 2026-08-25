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

      const assessments = Array.isArray(res.data?.assessments)
        ? res.data.assessments
        : [];
      const pagination = res.data?.pagination ?? {
        page,
        limit,
        offset: 0,
        total: assessments.length,
        totalPages: assessments.length > 0 ? 1 : 0,
        hasNextPage: false,
        hasPreviousPage: false,
      };

      return { assessments, pagination };
    },
    enabled: Boolean(programId?.trim()),
  });
}
