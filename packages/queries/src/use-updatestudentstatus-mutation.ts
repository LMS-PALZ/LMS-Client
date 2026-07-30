import { updateStudentStatus } from "@ssu/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export function useUpdateStudentStatusMutation() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: ({
      userId,
      status,
    }: {
      userId: string;
      status: "active" | "suspended";
    }) => updateStudentStatus(userId, status),

    onSuccess: (data, variables) => {
      toast.success(data?.message ?? "Student status updated successfully.");

      qc.invalidateQueries({
        queryKey: ["students"],
      });

      qc.invalidateQueries({
        queryKey: ["student", variables.userId],
      });
    },

    onError: (error: any) => {
      toast.error(
        error?.response?.data?.message ??
          error?.message ??
          "Failed to update student status.",
      );
    },
  });
}
