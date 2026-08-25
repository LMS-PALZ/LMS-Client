import { useQuery } from "@tanstack/react-query";
import { getStudentClassroom } from "@ssu/api";
import { useProfileDetail } from "./use-profiledetail";

export function useEnrolledProgram() {
  const profileQuery = useProfileDetail();
  const programId = profileQuery.data?.program?.id ?? "";
  const generalPrograms = profileQuery.data?.generalPrograms ?? [];
  const liveGeneralPrograms = profileQuery.data?.liveGeneralPrograms ?? [];
  const hasLiveGeneralProgram = Boolean(
    profileQuery.data?.hasLiveGeneralProgram,
  );

  return {
    ...profileQuery,
    programId,
    program: profileQuery.data?.program,
    student: profileQuery.data?.student,
    generalPrograms,
    liveGeneralPrograms,
    hasLiveGeneralProgram,
  };
}

export function useStudentclassroom(programId: string) {
  return useQuery({
    queryKey: ["studentclassroom", programId],
    queryFn: async () => {
      const res = await getStudentClassroom(programId);
      if (!res.ok) throw new Error(res.message);
      return res.data;
    },
    enabled: Boolean(programId),
  });
}
