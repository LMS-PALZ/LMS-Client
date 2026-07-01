import { getProgramClassroom, getProgramClassroomModules } from "@ssu/api";
import { useQuery } from "@tanstack/react-query";
import { programClassroomKeys } from "./keys";

export function useProgramClassroomModules(programId: string, enabled = true) {
  return useQuery({
    queryKey: programClassroomKeys.modules(programId),
    queryFn: async () => {
      const res = await getProgramClassroomModules(programId);
      if (!res.ok) throw new Error(res.message);
      return res.data;
    },
    enabled: enabled && Boolean(programId),
  });
}

export function useProgramClassroom(programId: string, enabled = true) {
  return useQuery({
    queryKey: programClassroomKeys.classroom(programId),
    queryFn: async () => {
      const res = await getProgramClassroom(programId);
      if (!res.ok) throw new Error(res.message);
      return res.data;
    },
    enabled: enabled && Boolean(programId),
  });
}
