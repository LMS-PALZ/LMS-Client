import { useMutation, useQueryClient } from "@tanstack/react-query";
import { acceptinvite } from "@ssu/api";

export function useacceptInviteMutation() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async (input: {
      email: string;
      token: string;
      password: string;
    }) => {
      const res = await acceptinvite(input);

      if (!res.ok) {
        throw new Error(res.message);
      }

      return res;
    },
    onSuccess: () => {
      void qc.invalidateQueries({
        queryKey: ["acceptInvite"],
      });
    },
  });
}
