import { updateStaffStatus } from "@ssu/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useUpdateStaffStatusMutation() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: ({
      userId,
      status,
    }: {
      userId: string;
      status: "active" | "suspended" | "invited";
    }) => updateStaffStatus(userId, status),

    onSuccess: () => {
      qc.invalidateQueries({
        queryKey: ["staff"],
      });
    },
  });
}
