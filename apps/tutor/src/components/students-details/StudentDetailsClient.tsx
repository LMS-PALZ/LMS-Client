"use client";

import { useStudentDetails } from "@ssu/queries";
import { StudentDetails } from "@/components/students-details/studentdetail";

interface Props {
  id: string;
}

export function StudentDetailsClient({ id }: Props) {
  const { data } = useStudentDetails(id);

  return (
    <StudentDetails
      profile={data}
      info={data}
      completion={data}
      cumulativeScore={data}
      attendance={data?.sessionAttendance ?? []}
      onRevokeAccess={() => console.log("revoke", id)}
    />
  );
}
