import { useMutation, useQueryClient } from "@tanstack/react-query";
import { inviteStaff } from "@ssu/api";

export function useInviteStaffMutation() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async (input: {
      email: string;
      name: string;
      role: string;
    }) => {
      const res = await inviteStaff(input);

      if (!res.ok) {
        throw new Error(res.message);
      }

      return res;
    },
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ["staff"] });
    },
  });
}
