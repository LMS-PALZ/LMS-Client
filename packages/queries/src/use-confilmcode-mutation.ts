import { useMutation } from "@tanstack/react-query";
import { verifyStudentEmail } from "@ssu/api";
import type { ConfirmCodeFormValues } from "@ssu/schema";
import { getErrorMessage, mutationToast } from "./notify";

interface UseConfirmCodeMutationProps {
  email: string;
}

export function useConfirmCodeMutation({ email }: UseConfirmCodeMutationProps) {
  return useMutation({
    mutationFn: async (input: ConfirmCodeFormValues) => {
      if (!email) {
        throw new Error("User email not found");
      }

      return verifyStudentEmail(email, input.code);
    },

    onSuccess: (data) => {
      if (!data.ok) {
        mutationToast.error(data.message);
        return;
      }

      mutationToast.success(data.message || "Email verified successfully");
    },

    onError: (error) => {
      mutationToast.error(
        getErrorMessage(error, "Verification failed. Please try again."),
      );
    },
  });
}
