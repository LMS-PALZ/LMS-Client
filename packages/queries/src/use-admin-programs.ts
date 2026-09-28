import {
  assignAdminProgramTutors,
  createAdminProgram,
  deleteAdminProgram,
  getAdminProgram,
  listPortalPrograms,
  updateAdminProgramStatus,
} from "@ssu/api";
import type {
  AdminProgramListResponse,
  CreateProgramPayload,
  ProgramStatus,
} from "@ssu/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { adminProgramKeys, programClassroomKeys } from "./keys";

export interface CreateProgramInput {
  payload: CreateProgramPayload;
  tutorIds?: string[];
}

export function useAdminPrograms(
  params?: {
    page?: number;
    limit?: number;
    search?: string;
    status?: string;
  },
  options?: {
    asTutor?: boolean;
    tutorUserId?: string;
    tutorEmail?: string;
    accessToken?: string;
    enabled?: boolean;
  },
) {
  const asTutor = Boolean(options?.asTutor);
  const tutorUserId = options?.tutorUserId?.trim() || "";
  const tutorEmail = options?.tutorEmail?.trim() || "";
  const accessToken = options?.accessToken?.trim() || "";

  return useQuery({
    queryKey: [
      ...adminProgramKeys.list(params),
      asTutor ? "tutor" : "admin",
      tutorUserId,
      tutorEmail,
    ],
    queryFn: async () => {
      const res = await listPortalPrograms(params, {
        asTutor,
        tutorUserId: asTutor ? tutorUserId : undefined,
        tutorEmail: asTutor ? tutorEmail : undefined,
        accessToken: asTutor ? accessToken : undefined,
      });
      if (!res.ok) throw new Error(res.message);
      return res.data;
    },
    enabled: options?.enabled ?? true,
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

export function useDeleteProgramMutation() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async (programId: string) => {
      const res = await deleteAdminProgram(programId);
      if (!res.ok) throw new Error(res.message);
      return { programId, message: res.message };
    },
    onSuccess: (data) => {
      qc.removeQueries({ queryKey: adminProgramKeys.detail(data.programId) });
      qc.removeQueries({
        queryKey: programClassroomKeys.modules(data.programId),
      });
      qc.removeQueries({
        queryKey: programClassroomKeys.classroom(data.programId),
      });

      // Remove deleted course from every cached list immediately.
      qc.setQueriesData<AdminProgramListResponse>(
        { queryKey: adminProgramKeys.all },
        (current) => {
          if (!current?.items) return current;
          const items = current.items.filter(
            (item) => item.id !== data.programId,
          );
          if (items.length === current.items.length) return current;
          return {
            ...current,
            items,
            pagination: {
              ...current.pagination,
              total: Math.max(
                0,
                (current.pagination.total ?? items.length) - 1,
              ),
            },
          };
        },
      );

      void qc.invalidateQueries({ queryKey: adminProgramKeys.all });
      void qc.invalidateQueries({ queryKey: ["admin-calendar"] });
      void qc.invalidateQueries({ queryKey: ["notifications"] });
    },
  });
}
