import { useMutation } from "@tanstack/react-query";
import { signupStudent } from "@ssu/api";
import type { SignUpFormValues } from "@ssu/schema";

export function useSignupMutation() {
  return useMutation({
    mutationFn: async (input: SignUpFormValues) => signupStudent(input),
  });
}
