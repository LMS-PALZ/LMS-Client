import { useQuery } from "@tanstack/react-query";
import { getStaffAnalysis } from "@ssu/api";

export function StaffAnalysis() {
  return useQuery({
    queryKey: ["staff-analysis"],
    queryFn: async () => {
      const res = await getStaffAnalysis();

      if (!res.ok) throw new Error(res.message);

      return res.data;
    },
  });
}
