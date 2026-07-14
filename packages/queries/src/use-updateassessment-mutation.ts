import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateAssessment } from "@ssu/api";
import { toast } from "sonner";

export function useUpdateAssessmentMutation(programId: string) {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async (
      input: { assessmentId: string } & Parameters<typeof updateAssessment>[1],
    ) => {
      const { assessmentId, ...data } = input;
      const res = await updateAssessment(assessmentId, data);
      if (!res.ok) throw new Error(res.message);
      return res.data;
    },
    onSuccess: () => {
      toast.success("Assessment updated successfully");
      void qc.invalidateQueries({ queryKey: ["assessments", programId] });
    },
  });
}
