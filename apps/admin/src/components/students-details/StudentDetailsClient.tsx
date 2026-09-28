"use client";

import { useStudentDetails } from "@ssu/queries";
import { StudentDetails } from "@/components/students-details/studentdetail";
import { AdminStudentDetailSkeleton } from "@/components/skeletons";
import { AlertBanner, GoBack } from "@ssu/ui";
import { adminPath } from "@ssu/config/portal-paths";

interface Props {
  id: string;
}

export function StudentDetailsClient({ id }: Props) {
  const { data, isLoading, isError, error } = useStudentDetails(id);

  if (isLoading && !data) {
    return (
      <div className="space-y-4">
        <GoBack fallbackHref={adminPath("/students")} />
        <AdminStudentDetailSkeleton />
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="space-y-4">
        <GoBack fallbackHref={adminPath("/students")} />
        <AlertBanner variant="error">
          {error instanceof Error
            ? error.message
            : "Could not load student details."}
        </AlertBanner>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <GoBack fallbackHref={adminPath("/students")} />
      <StudentDetails student={data} />
    </div>
  );
}
