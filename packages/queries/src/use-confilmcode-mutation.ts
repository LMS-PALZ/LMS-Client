import { useMutation } from "@tanstack/react-query";
import { verifyStudentEmail } from "@ssu/api";
import type { ConfirmCodeFormValues } from "@ssu/schema";
import { useSignupStore } from "@ssu/store";
import { getErrorMessage, mutationToast } from "./notify";

export function useConfirmCodeMutation() {
  const user = useSignupStore((state) => state.user);
  const email = user?.email;

  return useMutation({
    mutationFn: async (input: ConfirmCodeFormValues) => {
      if (!email) {
        throw new Error("User email not found");
      }

      const res = await verifyStudentEmail(email, input.code);
      return res;
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
