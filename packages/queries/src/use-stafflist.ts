import { useQuery } from "@tanstack/react-query";
import { getStaffList } from "@ssu/api";

export function StaffList(
  page = 1,
  limit = 10,
  search = "",
  status = "",
  role: "admin" | "tutor" = "admin",
  course = "",
) {
  return useQuery({
    queryKey: ["staff", page, limit, search, status, role, course],
    queryFn: async () => {
      const res = await getStaffList(page, limit, search, status, role, course);

      if (!res.ok) throw new Error(res.message);

      return res.data;
    },
  });
}
