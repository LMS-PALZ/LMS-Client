import { RequireAuth } from "@/components/RequireAuth";
import { TutorLayout } from "@/layouts/TutorLayout";
import type { ReactNode } from "react";

export default function DashboardRootLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <RequireAuth>
      <TutorLayout>{children}</TutorLayout>
    </RequireAuth>
  );
}
