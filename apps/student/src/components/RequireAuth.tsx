"use client";

import { studentPath } from "@/lib/studentRoutes";
import { useSession } from "@ssu/queries";
import { useRouter } from "next/navigation";
import { useEffect, type ReactNode } from "react";

export function RequireAuth({ children }: { children: ReactNode }) {
  const { data: user, isLoading } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !user) {
      router.replace(studentPath("/login"));
    }
  }, [isLoading, user, router]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center text-body text-neutral-500">
        Loading…
      </div>
    );
  }
  if (!user) {
    return null;
  }
  return <>{children}</>;
}
