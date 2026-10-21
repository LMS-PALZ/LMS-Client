"use client";

import { useDefaultBreadcrumbs } from "@ssu/ui";
import { usePathname } from "next/navigation";
import { buildStudentBreadcrumbs } from "@/lib/student-breadcrumbs";

export function RouteBreadcrumbs() {
  const pathname = usePathname();
  useDefaultBreadcrumbs(buildStudentBreadcrumbs(pathname));
  return null;
}
