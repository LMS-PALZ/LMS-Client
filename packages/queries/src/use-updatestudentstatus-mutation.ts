import { updateStudentStatus } from "@ssu/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";

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

    onSuccess: () => {
      qc.invalidateQueries({
        queryKey: ["students"],
      });
    },
  });
}
