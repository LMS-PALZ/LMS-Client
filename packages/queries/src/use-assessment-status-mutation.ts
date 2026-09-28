import { useMutation, useQueryClient } from "@tanstack/react-query";
import { draftAssessment, publishAssessment } from "@ssu/api";
import { getErrorMessage, mutationToast } from "./notify";

export function usePublishAssessmentMutation(programId: string) {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async (assessmentId: string) => {
      const res = await publishAssessment(assessmentId);
      if (!res.ok) throw new Error(res.message);
      return res;
    },
    onSuccess: (res) => {
      mutationToast.success(res.message || "Assessment published.");
      void qc.invalidateQueries({ queryKey: ["assessments", programId] });
      void qc.invalidateQueries({ queryKey: ["assessment"] });
    },
    onError: (error) => {
      mutationToast.error(
        getErrorMessage(error, "Failed to publish assessment."),
      );
    },
  });
}

export function useDraftAssessmentMutation(programId: string) {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async (assessmentId: string) => {
      const res = await draftAssessment(assessmentId);
      if (!res.ok) throw new Error(res.message);
      return res;
    },
    onSuccess: (res) => {
      mutationToast.success(res.message || "Assessment moved to draft.");
      void qc.invalidateQueries({ queryKey: ["assessments", programId] });
      void qc.invalidateQueries({ queryKey: ["assessment"] });
    },
    onError: (error) => {
      mutationToast.error(
        getErrorMessage(error, "Failed to move assessment to draft."),
      );
    },
  });
}
