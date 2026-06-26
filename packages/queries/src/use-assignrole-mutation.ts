import { useMutation, useQueryClient } from "@tanstack/react-query";
import { assignRole } from "@ssu/api";

export function useAssignroleMutation() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async ({
      programId,
      tutorIds,
    }: {
      programId: string;
      tutorIds: string[];
    }) => {
      const res = await assignRole({
        programId,
        tutorIds,
      });

      if (!res.ok) {
        throw new Error(res.message);
      }

      return res;
    },

    onSuccess: () => {
      qc.invalidateQueries({
        queryKey: ["staff"],
      });
    },
  });
}
