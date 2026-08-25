import { useQuery } from "@tanstack/react-query";
import { getStudentList } from "@ssu/api";

export function useStudentList(
  page = 1,
  limit = 10,
  search = "",
  status = "",
  role = "",
  course = "",
) {
  return useQuery({
    queryKey: ["students", page, limit, search, status, role, course],

    queryFn: async () => {
      const res = await getStudentList(
        page,
        limit,
        search,
        status,
        role,
        course,
      );

      if (!res.ok) {
        throw new Error(res.message);
      }

      return res.data;
    },
  });
}
