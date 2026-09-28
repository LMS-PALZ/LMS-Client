import { useQuery } from "@tanstack/react-query";
import { getStudentList } from "@ssu/api";

export function useStudentList(
  page = 1,
  limit = 10,
  search = "",
  status = "",
  role = "",
  program = "",
  options?: { enabled?: boolean; programId?: string },
) {
  const programId = options?.programId?.trim() || "";

  return useQuery({
    queryKey: [
      "students",
      page,
      limit,
      search,
      status,
      role,
      program,
      programId,
    ],

    queryFn: async () => {
      const res = await getStudentList(
        page,
        limit,
        search,
        status,
        role,
        program,
        programId,
      );

      if (!res.ok) {
        throw new Error(res.message);
      }

      return res.data;
    },
    enabled: options?.enabled ?? true,
  });
}
