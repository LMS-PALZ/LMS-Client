import { useMutation, useQueryClient } from "@tanstack/react-query";
import { adminlogin, login, writeSession } from "@ssu/api";
import { sessionKey } from "./keys";

export type LoginPortal = "student" | "admin" | "tutor";

export function useLoginMutation(portal: LoginPortal = "student") {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (input: { email: string; password: string }) => {
      if (portal === "admin" || portal === "tutor") {
        return adminlogin(input.email, input.password);
      }
      return login(input.email, input.password);
    },
    onSuccess: (data) => {
      if (!data.ok) return;
      writeSession(data.data);
      localStorage.setItem("token", data.accessToken);
      void qc.setQueryData(sessionKey, data.data);
    },
  });
}
