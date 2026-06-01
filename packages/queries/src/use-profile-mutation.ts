import { useMutation } from "@tanstack/react-query";
import { createStudentProfile } from "@ssu/api";

export function useCreateProfileMutation() {
  return useMutation({
    mutationFn: async (data: {
      day: string;
      month: string;
      year: number;
      gender: string;
      employment_status: string;
      address: string;
      state: string;
      city: string;
      photo: File;
    }) => {
      const res = await createStudentProfile(data);

      if (!res.ok) throw new Error(res.message);

      return res.data;
    },
  });
}
