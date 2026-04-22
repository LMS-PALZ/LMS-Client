import { RequireAuth } from "@/components/RequireAuth";
import { StudentLayout } from "@/layouts/StudentLayout";
import type { ReactNode } from "react";

export default function DashboardRootLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <RequireAuth>
      <StudentLayout>{children}</StudentLayout>
    </RequireAuth>
  );
}
