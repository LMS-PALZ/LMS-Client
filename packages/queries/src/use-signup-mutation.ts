import { useMutation, useQueryClient } from "@tanstack/react-query";
import { signupStudent, writeSession } from "@ssu/api";
import { sessionKey } from "./keys";
import type { SignUpFormValues } from "@ssu/schema";
import { useSignupStore } from "@ssu/store";

export function useSignupMutation() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async (input: SignUpFormValues) => {
      console.log("Signup mutation input:", input);

      const res = await signupStudent(input);

      console.log("Signup mutation response:", res);

      return res;
    },

    onSuccess: (data) => {
      if (!data.status) return;

      writeSession(data.data);

      qc.setQueryData(sessionKey, data.data);
      useSignupStore.getState().setUser(data.data);
      localStorage.setItem("user-email", data.data.email);
    },
  });
}
