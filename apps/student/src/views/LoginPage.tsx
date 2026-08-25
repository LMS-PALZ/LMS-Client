"use client";

import { clearStudentAuth, isStudentAuthenticated } from "@ssu/api";
import { sessionKey } from "@ssu/queries";
import { LoginForm } from "@ssu/ui";
import { useQueryClient } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect } from "react";

function LoginPageContent() {
  const queryClient = useQueryClient();
  const searchParams = useSearchParams();
  const forceLogin = searchParams.get("fresh") === "1";

  useEffect(() => {
    if (forceLogin) {
      clearStudentAuth();
      void queryClient.setQueryData(sessionKey, null);
      return;
    }
    if (isStudentAuthenticated()) return;
    clearStudentAuth();
    void queryClient.setQueryData(sessionKey, null);
  }, [forceLogin, queryClient]);

  return (
    <LoginForm
      role="student"
      onSuccessRedirect="/home"
      requireSessionCheck={!forceLogin}
      signupLink="/"
      showSignupLink
      title="Welcome back!"
      description="Sign in to continue to your dashboard."
    />
  );
}

export function LoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginPageContent />
    </Suspense>
  );
}
