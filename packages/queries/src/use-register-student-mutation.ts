import { useMutation, useQueryClient } from "@tanstack/react-query";
import { registerAndEnrollStudent } from "@ssu/api";

export function useRegisterStudentMutation() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async (input: {
      first_name: string;
      last_name: string;
      email: string;
      phone_number: string;
      programId: string;
    }) => {
      const res = await registerAndEnrollStudent(input);

      if (!res.ok) {
        throw new Error(res.message);
      }

      return res;
    },
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ["students"] });
    },
  });
}
