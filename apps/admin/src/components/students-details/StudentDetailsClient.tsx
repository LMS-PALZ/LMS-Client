"use client";

import { useStudentDetails } from "@ssu/queries";
import { StudentDetails } from "@/components/students-details/studentdetail";
import { AdminStudentDetailSkeleton } from "@/components/skeletons";

interface Props {
  id: string;
}

export function StudentDetailsClient({ id }: Props) {
  const { data, isLoading } = useStudentDetails(id);

  if (isLoading && !data) {
    return <AdminStudentDetailSkeleton />;
  }

  return (
    <StudentDetails
      profile={data}
      info={data}
      completion={data}
      cumulativeScore={data}
      userId={id}
      attendance={data?.sessionAttendance ?? []}
      onRevokeAccess={() => console.log("revoke", id)}
    />
  );
}
