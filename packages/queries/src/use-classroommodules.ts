import { useQuery } from "@tanstack/react-query";
import { getClassroomModules } from "@ssu/api";

export function useClassroomModules(programId: string) {
  return useQuery({
    queryKey: ["classroom-modules", programId],
    queryFn: async () => {
      const res = await getClassroomModules(programId);
      if (!res.ok) throw new Error(res.message);
      return res.data;
    },
    enabled: !!programId,
  });
}
