import { programslist } from "@ssu/api";
import { useQuery } from "@tanstack/react-query";

export function usePrograms() {
  return useQuery({
    queryKey: ["programs"],
    queryFn: async () => {
      const res = await programslist();

      if (res.status !== "success") {
        throw new Error(res.message);
      }

      return res.data.items;
    },
  });
}
