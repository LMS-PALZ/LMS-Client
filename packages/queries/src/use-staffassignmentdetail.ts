import { useQuery } from "@tanstack/react-query";
import { getAssessmentById } from "@ssu/api";

export function useAssessmentById(assessmentId: string) {
  return useQuery({
    queryKey: ["assessment", assessmentId],
    queryFn: async () => {
      const res = await getAssessmentById(assessmentId);
      if (!res.ok) throw new Error(res.message);
      return res.data;
    },
    enabled: !!assessmentId,
  });
}
