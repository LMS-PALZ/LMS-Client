import { useQuery } from "@tanstack/react-query";
import { getStudentClassroom } from "@ssu/api";
import { useProfileDetail } from "./use-profiledetail";

export function useEnrolledProgram() {
  const profileQuery = useProfileDetail();
  const programId = profileQuery.data?.program?.id ?? "";

  return {
    ...profileQuery,
    programId,
    program: profileQuery.data?.program,
    student: profileQuery.data?.student,
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
