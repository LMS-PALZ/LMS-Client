import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createAssessment } from "@ssu/api";
import { toast } from "sonner";

export function usecreateAssessmentMutation() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async (data: Parameters<typeof createAssessment>[0]) => {
      const res = await createAssessment(data);
      if (!res.ok) throw new Error(res.message);
      return res.data;
    },
    onSuccess: (data) => {
      toast.success("Assessment created successfully");
      localStorage.setItem("programId", data?.programId);
      void qc.invalidateQueries({ queryKey: ["assessments"] });
    },
  });
}
