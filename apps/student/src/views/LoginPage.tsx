"use client";

import { studentPath } from "@/lib/studentRoutes";
import { LoginForm } from "@ssu/ui";

export function LoginPage() {
  return (
    <LoginForm
      role="student"
      onSuccessRedirect={studentPath("/home")}
      signupLink={studentPath("/signup")}
      showSignupLink
      title="Welcome back!"
      description="Sign in to continue to your dashboard."
    />
  );
}
