import { useMutation, useQueryClient } from "@tanstack/react-query";
import { gradeAssessmentSubmission } from "@ssu/api";
import { studentProgressKeys } from "./use-student-progress";

export function useGradeSubmissionMutation(assessmentId: string) {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async (input: {
      submissionId: string;
      studentId: string;
      score: number;
      feedback?: string;
    }) => {
      const res = await gradeAssessmentSubmission(
        input.submissionId,
        input.studentId,
        {
          score: input.score,
          feedback: input.feedback,
        },
      );

      if (!res.ok) throw new Error(res.message);
      return res.data;
    },
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ["assessment", assessmentId] });
      void qc.invalidateQueries({ queryKey: studentProgressKeys.all });
      void qc.invalidateQueries({ queryKey: ["student-overall-progress"] });
    },
  });
}
