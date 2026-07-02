import { getStaffList } from "@ssu/api";
import type { Trainers } from "@ssu/types";
import { useQuery } from "@tanstack/react-query";

function isTutorRole(role: string | undefined): boolean {
  const normalized = (role ?? "").toLowerCase();
  return normalized === "tutor" || normalized === "trainer";
}

async function fetchTutorStaff(search: string): Promise<Trainers[]> {
  const tutorRes = await getStaffList(1, 100, search, "", "tutor");
  if (tutorRes.ok && tutorRes.data.items.length > 0) {
    return tutorRes.data.items as Trainers[];
  }

  const trainerRes = await getStaffList(1, 100, search, "", "trainer");
  if (trainerRes.ok && trainerRes.data.items.length > 0) {
    return trainerRes.data.items as Trainers[];
  }

  const allRes = await getStaffList(1, 100, search);
  if (!allRes.ok) {
    throw new Error(allRes.message);
  }

  return (allRes.data.items as Trainers[]).filter((item) =>
    isTutorRole(item.role),
  );
}

export function useTutorStaff(search = "") {
  return useQuery<Trainers[]>({
    queryKey: ["staff", "tutors", search],
    queryFn: () => fetchTutorStaff(search),
  });
}
