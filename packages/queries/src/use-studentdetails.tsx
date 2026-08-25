import { useQuery } from "@tanstack/react-query";
import { getStudentDetails } from "@ssu/api";

export function useStudentDetails(userId: string) {
  return useQuery({
    queryKey: ["student", userId],
    queryFn: async () => {
      const res = await getStudentDetails(userId);

      if (!res.ok) throw new Error(res.message);

      return res.data;
    },
    enabled: !!userId,
  });
}
