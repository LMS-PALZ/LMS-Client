import { deleteAdminStudent } from "@ssu/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export function useDeleteStudentMutation() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async (userId: string) => {
      const res = await deleteAdminStudent(userId);
      if (!res.ok) throw new Error(res.message);
      return res;
    },

    onSuccess: (data) => {
      toast.success(data.message ?? "Student deleted successfully.");
      void qc.invalidateQueries({
        queryKey: ["students"],
      });
    },

    onError: (error: unknown) => {
      toast.error(
        error instanceof Error ? error.message : "Failed to delete student.",
      );
    },
  });
}
