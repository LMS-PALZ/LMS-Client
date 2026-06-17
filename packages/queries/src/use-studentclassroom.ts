import { useQuery } from "@tanstack/react-query";
import { getStudentclassroom } from "@ssu/api";

export function useStudentclassroom(programId: string) {
  return useQuery({
    queryKey: ["studentclassroom", programId],
    queryFn: async () => {
      const res = await getStudentclassroom(programId);

      if (!res.ok) throw new Error(res.message);

      return res.data;
    },
    enabled: !!programId,
  });
}
