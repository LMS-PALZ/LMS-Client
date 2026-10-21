import {
  deleteProgramLesson,
  getProgramClassroom,
  getProgramClassroomModules,
  upsertProgramClassroom,
} from "@ssu/api";
import type { UpsertProgramClassroomPayload } from "@ssu/types";
import {
  useMutation,
  useQuery,
  useQueryClient,
  type QueryClient,
} from "@tanstack/react-query";
import { programClassroomKeys } from "./keys";

async function refetchClassroom(qc: QueryClient, programId: string) {
  await Promise.all([
    qc.invalidateQueries({ queryKey: programClassroomKeys.all }),
    qc.refetchQueries({
      queryKey: programClassroomKeys.modules(programId),
    }),
    qc.refetchQueries({
      queryKey: programClassroomKeys.classroom(programId),
    }),
  ]);
}

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
    onSuccess: async (_data, variables) => {
      await refetchClassroom(qc, variables.programId);
    },
  });
}

/** DELETE .../classroom/modules/{moduleId}/lessons/{lessonId} */
export function useDeleteProgramLessonMutation() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async ({
      programId,
      moduleId,
      lessonId,
    }: {
      programId: string;
      moduleId: string;
      lessonId: string;
    }) => {
      const res = await deleteProgramLesson(programId, moduleId, lessonId);
      if (!res.ok) throw new Error(res.message);
      return res;
    },
    onSuccess: async (_data, variables) => {
      await refetchClassroom(qc, variables.programId);
    },
  });
}
