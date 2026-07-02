import {
  getProgramClassroom,
  getProgramClassroomModules,
  upsertProgramClassroom,
} from "@ssu/api";
import type { UpsertProgramClassroomPayload } from "@ssu/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
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

export function useUpsertProgramClassroomMutation() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async ({
      programId,
      payload,
    }: {
      programId: string;
      payload: UpsertProgramClassroomPayload;
    }) => {
      const res = await upsertProgramClassroom(programId, payload);
      if (!res.ok) throw new Error(res.message);
      return res.data;
    },
    onSuccess: (_data, variables) => {
      void qc.invalidateQueries({
        queryKey: programClassroomKeys.modules(variables.programId),
      });
      void qc.invalidateQueries({
        queryKey: programClassroomKeys.classroom(variables.programId),
      });
    },
  });
}
