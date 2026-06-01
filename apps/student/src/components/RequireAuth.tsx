"use client";

import { isStudentAuthenticated } from "@ssu/api";
import { useSession } from "@ssu/queries";
import { DashboardShellSkeleton } from "@ssu/ui";
import { useRouter } from "next/navigation";
import { useEffect, useState, type ReactNode } from "react";

export function RequireAuth({ children }: { children: ReactNode }) {
  const { isLoading } = useSession();
  const router = useRouter();
  const [authed, setAuthed] = useState(false);

  useEffect(() => {
    if (isLoading) return;
    if (!isStudentAuthenticated()) {
      router.replace("/login");
      return;
    }
    setAuthed(true);
  }, [isLoading, router]);

  if (isLoading || !authed) {
    return <DashboardShellSkeleton />;
  }

  return <>{children}</>;
}
