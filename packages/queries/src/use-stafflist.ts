import { useQuery } from "@tanstack/react-query";
import { getStaffList } from "@ssu/api";

export function StaffList(
  page = 1,
  limit = 10,
  role: "admin" | "tutor" = "admin",
) {
  return useQuery({
    queryKey: ["staff", page, limit, role],
    queryFn: async () => {
      const res = await getStaffList(page, limit, role);

      if (!res.ok) throw new Error(res.message);

      return res.data;
    },
  });
}
