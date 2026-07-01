import {
  assignAdminProgramTutors,
  createAdminProgram,
  getAdminProgram,
  listAdminPrograms,
  updateAdminProgramStatus,
} from "@ssu/api";
import type {
  AdminProgramListResponse,
  CreateProgramPayload,
  ProgramStatus,
} from "@ssu/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { adminProgramKeys } from "./keys";

export interface CreateProgramInput {
  payload: CreateProgramPayload;
  tutorIds?: string[];
}

export function useAdminPrograms(params?: {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
}) {
  return useQuery({
    queryKey: adminProgramKeys.list(params),
    queryFn: async () => {
      const res = await listAdminPrograms(params);
      if (!res.ok) throw new Error(res.message);
      return res.data;
    },
  });
}

export function useAdminProgram(programId: string, enabled = true) {
  const queryClient = useQueryClient();

  return useQuery({
    queryKey: adminProgramKeys.detail(programId),
    queryFn: async () => {
      const res = await getAdminProgram(programId);
      if (!res.ok) throw new Error(res.message);
      return res.data;
    },
    enabled: enabled && Boolean(programId),
    placeholderData: () => {
      const cachedLists = queryClient.getQueriesData<AdminProgramListResponse>({
        queryKey: adminProgramKeys.all,
      });

      for (const [, data] of cachedLists) {
        const match = data?.items.find((item) => item.id === programId);
        if (match) return match;
      }

      return undefined;
    },
  });
}

export function useCreateProgramMutation() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async ({ payload, tutorIds = [] }: CreateProgramInput) => {
      const res = await createAdminProgram(payload);
      if (!res.ok) throw new Error(res.message);

      if (tutorIds.length === 0) {
        return res.data;
      }

      const assignRes = await assignAdminProgramTutors(res.data.id, tutorIds);
      if (!assignRes.ok) throw new Error(assignRes.message);
      return assignRes.data;
    },
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: adminProgramKeys.all });
    },
  });
}

export function useUpdateProgramStatusMutation() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async ({
      programId,
      status,
    }: {
      programId: string;
      status: ProgramStatus;
    }) => {
      const res = await updateAdminProgramStatus(programId, status);
      if (!res.ok) throw new Error(res.message);
      return res.data;
    },
    onSuccess: (data) => {
      void qc.invalidateQueries({ queryKey: adminProgramKeys.all });
      void qc.invalidateQueries({ queryKey: adminProgramKeys.detail(data.id) });
    },
  });
}
