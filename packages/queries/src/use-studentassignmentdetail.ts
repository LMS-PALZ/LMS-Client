import { useQuery } from "@tanstack/react-query";
import { getStudentAssessmentById } from "@ssu/api";

export function useStudentAssessmentById(assessmentId: string) {
  return useQuery({
    queryKey: ["student-assessment", assessmentId],
    queryFn: async () => {
      const res = await getStudentAssessmentById(assessmentId);
      if (!res.ok) throw new Error(res.message);
      return res.data;
    },
    enabled: !!assessmentId,
  });
}
