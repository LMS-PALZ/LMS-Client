"use client";

import { LoginForm } from "@ssu/ui";

export function LoginPage() {
  return (
    <LoginForm
      role="tutor"
      onSuccessRedirect="/"
      title="Tutor sign in"
      description="Sign in to continue to your dashboard."
      showSignupLink={false}
    />
  );
}
