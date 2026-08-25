import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createStudentProfile } from "@ssu/api";
import { studentProfileKey } from "./keys";
import { getErrorMessage, mutationToast } from "./notify";

export function useCreateProfileMutation() {
  const queryClient = useQueryClient();

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
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: studentProfileKey });
      void queryClient.invalidateQueries({ queryKey: ["profiledetails"] });
      mutationToast.success("Profile saved successfully");
    },
    onError: (error) => {
      mutationToast.error(
        getErrorMessage(error, "Failed to save profile. Please try again."),
      );
    },
  });
}
