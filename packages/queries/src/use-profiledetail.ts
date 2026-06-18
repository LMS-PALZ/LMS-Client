import { useQuery } from "@tanstack/react-query";
import { getStudentPofile } from "@ssu/api";

export function Profiledetail() {
  return useQuery({
    queryKey: ["profiledetails"],
    queryFn: async () => {
      const res = await getStudentPofile();

      if (!res.ok) throw new Error(res.message);

      return res.data;
    },
  });
}
