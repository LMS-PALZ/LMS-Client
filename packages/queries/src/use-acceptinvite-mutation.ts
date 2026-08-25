import { useMutation, useQueryClient } from "@tanstack/react-query";
import { acceptinvite } from "@ssu/api";
import { getErrorMessage, mutationToast } from "./notify";

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
    onSuccess: (data) => {
      mutationToast.success(data.message || "Invitation accepted successfully");
      void qc.invalidateQueries({ queryKey: ["acceptInvite"] });
    },
    onError: (error) => {
      mutationToast.error(
        getErrorMessage(
          error,
          "Failed to accept invitation. Please try again.",
        ),
      );
    },
  });
}
