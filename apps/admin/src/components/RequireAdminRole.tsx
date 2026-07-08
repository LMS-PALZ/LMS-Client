"use client";

import { adminPath } from "@ssu/config/portal-paths";
import { useSession } from "@ssu/queries";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, type ReactNode } from "react";
import { canAccessAdminPath } from "@/lib/admin-roles";

export function RequireAdminRole({ children }: { children: ReactNode }) {
  const { data: user } = useSession();
  const pathname = usePathname();
  const router = useRouter();
  const allowed = !user || canAccessAdminPath(user.role, pathname);

  useEffect(() => {
    if (user && !canAccessAdminPath(user.role, pathname)) {
      router.replace(adminPath("/courses"));
    }
  }, [user, pathname, router]);

  if (!allowed) {
    return null;
  }

  return <>{children}</>;
}
