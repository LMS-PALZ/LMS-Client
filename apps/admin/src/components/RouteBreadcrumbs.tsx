"use client";

import { useDefaultBreadcrumbs } from "@ssu/ui";
import { usePathname } from "next/navigation";
import { buildAdminBreadcrumbs } from "@/lib/admin-breadcrumbs";

export function RouteBreadcrumbs() {
  const pathname = usePathname();
  useDefaultBreadcrumbs(buildAdminBreadcrumbs(pathname));
  return null;
}
