import { RequireAdminRole } from "@/components/RequireAdminRole";
import { RequireAuth } from "@/components/RequireAuth";
import { AdminLayout } from "@/layouts/AdminLayout";
import type { ReactNode } from "react";

export default function DashboardRootLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <RequireAuth>
      <RequireAdminRole>
        <AdminLayout>{children}</AdminLayout>
      </RequireAdminRole>
    </RequireAuth>
  );
}
