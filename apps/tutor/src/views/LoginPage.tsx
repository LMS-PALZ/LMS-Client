"use client";

import { tutorPath } from "@ssu/config/portal-paths";
import { LoginForm } from "@ssu/ui";

export function LoginPage() {
  return (
    <LoginForm
      role="tutor"
      onSuccessRedirect={tutorPath()}
      title="Tutor sign in"
      description="Sign in to continue to your dashboard."
      showSignupLink={false}
    />
  );
}
