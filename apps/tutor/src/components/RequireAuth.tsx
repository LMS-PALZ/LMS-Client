"use client";

import { tutorPath } from "@ssu/config/portal-paths";
import { useSession } from "@ssu/queries";
import { DashboardShellSkeleton } from "@ssu/ui";
import { useRouter } from "next/navigation";
import { useEffect, type ReactNode } from "react";

export function RequireAuth({ children }: { children: ReactNode }) {
  const { data: user, isLoading } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !user) {
      router.replace(tutorPath("/login"));
    }
  }, [isLoading, user, router]);

  if (isLoading) {
    return <DashboardShellSkeleton />;
  }
  if (!user) {
    return null;
  }
  return <>{children}</>;
}
