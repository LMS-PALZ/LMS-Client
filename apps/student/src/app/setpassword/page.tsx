"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import HubStudentSetPasswordPage from "@/views/hubstudentsetpasswordpage";
import SetPasswordPage from "@/views/setpasswordpage";

function SetPasswordRoute() {
  const searchParams = useSearchParams();

  // Admin-enrolled students arrive from the admission email with ?email=;
  // paid signups carry their email in the signup session instead.
  if (searchParams.get("email")?.trim()) {
    return <HubStudentSetPasswordPage />;
  }

  return <SetPasswordPage />;
}

export default function Page() {
  return (
    <Suspense fallback={null}>
      <SetPasswordRoute />
    </Suspense>
  );
}
