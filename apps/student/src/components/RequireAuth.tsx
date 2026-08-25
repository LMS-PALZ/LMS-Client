"use client";

import { isStudentAuthenticated } from "@ssu/api";
import { useSession } from "@ssu/queries";
import { DashboardShellSkeleton } from "@ssu/ui";
import { useRouter } from "next/navigation";
import { useEffect, type ReactNode } from "react";

export function RequireAuth({ children }: { children: ReactNode }) {
  const { data: user, isLoading } = useSession();
  const router = useRouter();

  const authenticated = Boolean(user) && isStudentAuthenticated();

  useEffect(() => {
    if (!isLoading && !authenticated) {
      router.replace("/login");
    }
  }, [isLoading, authenticated, router]);

  if (isLoading) {
    return <DashboardShellSkeleton />;
  }

  if (!authenticated) {
    return null;
  }

  return <>{children}</>;
}
