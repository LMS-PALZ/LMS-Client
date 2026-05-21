import { useMutation, useQueryClient } from "@tanstack/react-query";
import { adminlogin, writeSession } from "@ssu/api";
import { sessionKey } from "./keys";

export function useLoginMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (input: { email: string; password: string }) => {
      const res = await adminlogin(input.email, input.password);
      return res;
    },
    onSuccess: (data) => {
      if (!data.ok) return;
      writeSession(data.data);
      void qc.setQueryData(sessionKey, data.data);
    },
  });
}
