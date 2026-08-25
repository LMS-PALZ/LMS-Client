import { useMutation, useQueryClient } from "@tanstack/react-query";
import { submitAssessment } from "@ssu/api";

export function useSubmitAssessmentMutation(assessmentId: string) {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      submissionType: "file" | "link";
      file?: File;
      submissionLink?: string;
      comment?: string;
    }) => {
      const res = await submitAssessment(assessmentId, data);
      if (!res.ok) throw new Error(res.message);
      return res.data;
    },
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ["assessment", assessmentId] });
    },
  });
}
