import { getStaffList } from "@ssu/api";
import type { Trainers } from "@ssu/types";
import { isTutorOnlyRole } from "@ssu/utils";
import { useQuery } from "@tanstack/react-query";

/**
 * Staff who can be assigned as course tutors.
 * Plain admins are excluded — only tutor/trainer roles (and never mixed admin).
 */
async function fetchTutorStaff(search: string): Promise<Trainers[]> {
  const tutorRes = await getStaffList(1, 100, search, "", "tutor");
  if (tutorRes.ok && tutorRes.data.items.length > 0) {
    return (tutorRes.data.items as Trainers[]).filter((item) =>
      isTutorOnlyRole(item.role),
    );
  }

  const trainerRes = await getStaffList(1, 100, search, "", "trainer");
  if (trainerRes.ok && trainerRes.data.items.length > 0) {
    return (trainerRes.data.items as Trainers[]).filter((item) =>
      isTutorOnlyRole(item.role),
    );
  }

  const allRes = await getStaffList(1, 100, search);
  if (!allRes.ok) {
    throw new Error(allRes.message);
  }

  return (allRes.data.items as Trainers[]).filter((item) =>
    isTutorOnlyRole(item.role),
  );
}

export function useTutorStaff(search = "") {
  return useQuery<Trainers[]>({
    queryKey: ["staff", "tutors", search],
    queryFn: () => fetchTutorStaff(search),
  });
}
