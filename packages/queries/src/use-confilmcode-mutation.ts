import { useMutation } from "@tanstack/react-query";
import { verifyStudentEmail } from "@ssu/api";
import type { ConfirmCodeFormValues } from "@ssu/schema";
import { useSignupStore } from "@ssu/store";

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
  });
}
