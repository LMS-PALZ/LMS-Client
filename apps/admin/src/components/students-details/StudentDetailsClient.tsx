"use client";

import { useStudentDetails } from "@ssu/queries";
import { StudentDetails } from "@/components/students-details/studentdetail";
import { AdminStudentDetailSkeleton } from "@/components/skeletons";
import { AlertBanner, GoBack, usePageBreadcrumbs } from "@ssu/ui";
import { adminPath } from "@ssu/config/portal-paths";

interface Props {
  id: string;
}

export function StudentDetailsClient({ id }: Props) {
  const { data, isLoading, isError } = useStudentDetails(id);
  const studentName = data
    ? `${data.firstName ?? ""} ${data.lastName ?? ""}`.trim() || "Student"
    : "Student";

  usePageBreadcrumbs([
    { label: "Students", href: adminPath("/students") },
    { label: studentName },
  ]);

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
          Go back to students and try again.
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
