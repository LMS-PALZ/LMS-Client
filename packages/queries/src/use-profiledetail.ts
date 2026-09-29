import { useQuery } from "@tanstack/react-query";
import { getStudentPofile } from "@ssu/api";
import { useSignupStore } from "@ssu/store";
import { useEffect } from "react";

export function useProfileDetail() {
  const setUser = useSignupStore((state) => state.setUser);

  const query = useQuery({
    queryKey: ["profiledetails"],
    queryFn: async () => {
      const res = await getStudentPofile();
      if (!res.ok) return null;
      return res.data;
    },
  });

  useEffect(() => {
    if (!query.data) return;

    const program = query.data.program;
    const current = useSignupStore.getState().user;
    if (!current) return;

    setUser({
      programId: program?.id ?? current.programId ?? "",
      programSlug: program?.slug ?? current.programSlug ?? "",
      program_title: program?.title ?? current.program_title ?? "",
    });
  }, [query.data, setUser]);

  return query;
}
