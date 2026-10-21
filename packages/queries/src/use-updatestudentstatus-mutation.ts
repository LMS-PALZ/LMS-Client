import { updateStudentStatus, type StudentStatusAction } from "@ssu/api";
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
      status: StudentStatusAction;
    }) => updateStudentStatus(userId, status),

    onSuccess: (data) => {
      toast.success(data?.message ?? "Student status updated successfully.");

      void qc.invalidateQueries({
        queryKey: ["students"],
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
