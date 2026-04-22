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
      <AdminLayout>{children}</AdminLayout>
    </RequireAuth>
  );
}
