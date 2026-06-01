import { useMutation } from "@tanstack/react-query";
import { signupStudent } from "@ssu/api";
import type { SignUpFormValues } from "@ssu/schema";
import { getErrorMessage, mutationToast } from "./notify";

export function useSignupMutation() {
  return useMutation({
    mutationFn: async (input: SignUpFormValues) => signupStudent(input),
    onSuccess: (data) => {
      if (!data.status) {
        mutationToast.error(data.message);
        return;
      }
      mutationToast.success(data.message || "Signup successful");
    },
    onError: (error) => {
      mutationToast.error(
        getErrorMessage(error, "Signup failed. Please try again."),
      );
    },
  });
}
