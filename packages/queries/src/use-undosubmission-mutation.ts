import { useMutation, useQueryClient } from "@tanstack/react-query";
import { undoAssessmentSubmission } from "@ssu/api";

export function useUndoSubmissionMutation(assessmentId: string) {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async (submissionId: string) => {
      const res = await undoAssessmentSubmission(submissionId);
      if (!res.ok) throw new Error(res.message);
      return res;
    },
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ["assessment", assessmentId] });
    },
  });
}
