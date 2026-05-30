"use client";

import { LoginForm } from "@ssu/ui";

export function LoginPage() {
  return (
    <LoginForm
      role="student"
      onSuccessRedirect="/home"
      signupLink="/"
      showSignupLink
      title="Welcome back!"
      description="Sign in to continue to your dashboard."
    />
  );
}
