"use client";

import { CreateAssignmentPage, GoBack } from "@ssu/ui";
import { adminPath } from "@ssu/config/portal-paths";
import { useSession } from "@ssu/queries";
import { canCreateAssessments } from "@/lib/admin-roles";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Page() {
  const router = useRouter();
  const { data: user, isLoading } = useSession();
  const allowed = canCreateAssessments(user?.role);

  useEffect(() => {
    if (!isLoading && user && !allowed) {
      router.replace(adminPath("/assessment"));
    }
  }, [allowed, isLoading, router, user]);

  if (isLoading || (user && !allowed)) {
    return null;
  }

  return (
    <div className="space-y-4">
      <GoBack fallbackHref={adminPath("/assessment")} />
      <CreateAssignmentPage />
    </div>
  );
}
