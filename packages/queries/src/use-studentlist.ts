import { useQuery } from "@tanstack/react-query";
import { getStudentList } from "@ssu/api";

export function StudentList(page = 1, limit = 10) {
  return useQuery({
    queryKey: ["students", page, limit],
    queryFn: async () => {
      const res = await getStudentList(page, limit);

      if (!res.ok) throw new Error(res.message);

      return res.data;
    },
  });
}
