import { useMutation, useQueryClient } from "@tanstack/react-query";
import { archiveAssessment } from "@ssu/api";

export function useArchiveAssessmentMutation(programId: string) {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async (assessmentId: string) => {
      const res = await archiveAssessment(assessmentId);
      if (!res.ok) throw new Error(res.message);
      return res;
    },
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ["assessments", programId] });
    },
  });
}
