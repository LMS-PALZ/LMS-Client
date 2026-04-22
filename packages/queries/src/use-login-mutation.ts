import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { UserRole } from "@ssu/types";
import { loginDemo, writeSession } from "@ssu/api";
import { sessionKey } from "./keys";

export function useLoginMutation(expectedRole: UserRole) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (input: { email: string; password: string }) => {
      const res = await loginDemo(input.email, input.password, expectedRole);
      return res;
    },
    onSuccess: (data) => {
      if (!data.ok) return;
      writeSession(data.user);
      void qc.setQueryData(sessionKey, data.user);
    },
  });
}
