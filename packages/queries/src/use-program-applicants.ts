import { getProgramApplicants } from "@ssu/api";
import { useQuery } from "@tanstack/react-query";
import { adminProgramKeys } from "./keys";

export function useProgramApplicants(
  programId: string,
  params?: { page?: number; limit?: number },
  enabled = true,
) {
  return useQuery({
    queryKey: adminProgramKeys.applicants(programId, params),
    queryFn: async () => {
      const res = await getProgramApplicants(programId, params);
      if (!res.ok) throw new Error(res.message);
      return res.data;
    },
    enabled: enabled && Boolean(programId),
  });
}
