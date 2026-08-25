import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createAssessment } from "@ssu/api";
import { toast } from "sonner";

function readProgramId(value: unknown): string {
  if (
    typeof value === "string" &&
    value.trim() &&
    value !== "[object Object]"
  ) {
    return value.trim();
  }
  if (value && typeof value === "object") {
    const row = value as Record<string, unknown>;
    const id = row._id ?? row.id;
    if (typeof id === "string" && id.trim()) return id.trim();
  }
  return "";
}

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
      const programId = readProgramId(
        (data as { programId?: unknown } | null | undefined)?.programId,
      );
      if (programId) {
        localStorage.setItem("programId", programId);
      }
      void qc.invalidateQueries({ queryKey: ["assessments"] });
    },
  });
}
