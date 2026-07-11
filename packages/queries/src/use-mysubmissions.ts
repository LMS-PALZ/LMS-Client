import { useQuery } from "@tanstack/react-query";
import { getMySubmissions } from "@ssu/api";

export function useMySubmissions(options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: ["my-submissions"],
    queryFn: async () => {
      const res = await getMySubmissions();
      if (!res.ok) throw new Error(res.message);
      return res.data;
    },
    enabled: options?.enabled ?? true,
  });
}
